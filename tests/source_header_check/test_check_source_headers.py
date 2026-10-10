#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : test_check_source_headers.py
# Description : Unit tests for the Kritva RaaS source header checker
#
# Component   : Infrastructure
# Module      : Source Header Checker
# Layer       : Development Infrastructure
#
# Requirements: HEADER-001, KR-BINC-001-018
# API         : Python unittest suite
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

import importlib.util
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
_spec = importlib.util.spec_from_file_location(
    "check_source_headers", ROOT / "scripts/lint/check_source_headers.py")
chk = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(chk)


def header(c, name, **over):
    f = {"File": name, "Description": "Test fixture", "Component": "Control Plane",
         "Module": "Fixture", "Layer": "Service", "Requirements": "KR-BE-1-001",
         "API": "No callable API; test fixture", "Author": "KritvaOS",
         "Created": "10-10-2026"}
    f.update(over)
    lines = [f"{c}====", f"{c} Copyright (c) 2026 KritvaOS",
             f"{c} SPDX-License-Identifier: {over.pop('spdx', chk.LICENSE_ID)}", c]
    lines += [f"{c} {k:<12}: {v}" for k, v in f.items() if k != "spdx" and v is not None]
    lines.append(f"{c}====")
    return "\n".join(lines) + "\n\n"


class SourceHeaderTests(unittest.TestCase):
    def setUp(self):
        self._old = os.getcwd()
        self._tmp = tempfile.TemporaryDirectory()
        os.chdir(self._tmp.name)

    def tearDown(self):
        os.chdir(self._old)
        self._tmp.cleanup()

    def check(self, name, text):
        p = Path(name)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        return chk.validate_file(p)

    def ids(self, errors):
        return {e.split("[")[1].split("]")[0] for e in errors}

    def test_valid_headers_per_comment_style(self):
        for name, c in [("a.ts", "//"), ("a.tsx", "//"), ("a.js", "//"), ("a.mjs", "//"),
                        ("a.cjs", "//"), ("a.rs", "//"), ("a.sql", "--"), ("a.py", "#"),
                        ("a.sh", "#"), (".github/workflows/a.yml", "#")]:
            with self.subTest(name=name):
                self.assertEqual(self.check(name, header(c, Path(name).name) + "x\n"), [])

    def test_shebang_then_header(self):
        self.assertEqual(self.check("run.sh", "#!/usr/bin/env bash\n" + header("#", "run.sh")), [])

    def test_repo_relative_file_value_accepted(self):
        self.assertEqual(self.check("src/x.ts", header("//", "src/x.ts")), [])

    def test_missing_header(self):
        self.assertEqual(self.ids(self.check("a.ts", "export const x = 1;\n")), {"HEADER-008"})

    def test_wrong_license(self):
        self.assertIn("HEADER-001", self.ids(self.check("a.ts", header("//", "a.ts", spdx="Apache-2.0"))))

    def test_missing_copyright(self):
        text = header("//", "a.ts").replace("Copyright (c) 2026 KritvaOS", "Copyright ACME")
        self.assertIn("HEADER-003", self.ids(self.check("a.ts", text)))

    def test_spdx_must_be_exact(self):
        text = header("//", "a.ts").replace(chk.LICENSE_ID, chk.LICENSE_ID + "-INVALID")
        self.assertIn("HEADER-001", self.ids(self.check("a.ts", text)))

    def test_duplicate_spdx_rejected(self):
        line = f"// SPDX-License-Identifier: {chk.LICENSE_ID}\n"
        text = header("//", "a.ts").replace(line, line + "// SPDX-License-Identifier: Apache-2.0\n")
        self.assertIn("HEADER-001", self.ids(self.check("a.ts", text)))

    def test_copyright_must_be_exact(self):
        text = header("//", "a.ts").replace(
            "Copyright (c) 2026 KritvaOS", "Copyright (c) 2026 KritvaOS and ACME")
        self.assertIn("HEADER-003", self.ids(self.check("a.ts", text)))

    def test_duplicate_field_rejected(self):
        text = header("//", "a.ts").replace("// Module", "// Layer       : Service\n// Module")
        self.assertIn("HEADER-004", self.ids(self.check("a.ts", text)))

    def test_author_must_be_canonical(self):
        self.assertIn("HEADER-007", self.ids(self.check("a.ts", header("//", "a.ts", Author="Unknown"))))

    def test_header_must_start_at_top(self):
        self.assertEqual(self.ids(self.check("a.ts", "\n" + header("//", "a.ts"))), {"HEADER-008"})
        self.assertEqual(self.ids(self.check(
            "run.sh", "#!/usr/bin/env bash\n\n" + header("#", "run.sh"))), {"HEADER-008"})

    def test_missing_field(self):
        self.assertIn("HEADER-004", self.ids(self.check("a.ts", header("//", "a.ts", API=None))))

    def test_invalid_dates(self):
        for d in ("2026-10-10", "31-02-2026", "10/10/2026"):
            with self.subTest(d=d):
                self.assertIn("HEADER-002", self.ids(self.check("a.ts", header("//", "a.ts", Created=d))))

    def test_file_mismatch(self):
        self.assertIn("HEADER-005", self.ids(self.check("a.ts", header("//", "b.ts"))))
        # A path that names a different file with the same base name fails.
        self.assertIn("HEADER-005", self.ids(self.check("lib/x.ts", header("//", "src/x.ts"))))

    def test_sql_blank_line_ends_header(self):
        text = header("--", "a.sql").replace("-- Author", "\n-- Author")
        self.assertIn("HEADER-004", self.ids(self.check("a.sql", text)))

    def test_cli_exit_codes(self):
        good, bad = Path("good.ts"), Path("bad.ts")
        good.write_text(header("//", "good.ts"), encoding="utf-8")
        bad.write_text("export const x = 1;\n", encoding="utf-8")
        script = ROOT / "scripts/lint/check_source_headers.py"
        ok = subprocess.run([sys.executable, str(script), "--mode", "files", "--strict",
                             "--files", "good.ts"], capture_output=True, text=True)
        fail = subprocess.run([sys.executable, str(script), "--mode", "files", "--strict",
                               "--files", "good.ts", "bad.ts"], capture_output=True, text=True)
        self.assertEqual(ok.returncode, 0, ok.stdout)
        self.assertEqual(fail.returncode, 1, fail.stdout)
        self.assertIn("HEADER-008", fail.stdout)
        report = subprocess.run([sys.executable, str(script), "--mode", "files",
                                 "--files", "good.ts", "bad.ts"], capture_output=True, text=True)
        self.assertEqual(report.returncode, 0, report.stdout)
        self.assertIn("report-only", report.stdout)

    def test_vocabulary(self):
        self.assertIn("HEADER-007", self.ids(self.check("a.ts", header("//", "a.ts", Component="Backend"))))
        self.assertIn("HEADER-007", self.ids(self.check("a.ts", header("//", "a.ts", Layer="Logic"))))

    def test_classification(self):
        for name in ("a.json", "a.md", "package-lock.json", "lib.min.js",
                     "node_modules/x/a.js", "dist/a.js", "target/a.rs", "requirements.txt"):
            with self.subTest(name=name):
                self.assertEqual(chk.classify(Path(name)), "skip")
        self.assertEqual(chk.classify(Path("tests/source_header_check/fixtures/bad.ts")), "skip")
        for name in ("a.ts", "types.d.ts", "a.rs", "db/001_init.sql", ".githooks/pre-commit",
                     ".github/workflows/x.yaml", "tests/source_header_check/test_check_source_headers.py"):
            with self.subTest(name=name):
                self.assertEqual(chk.classify(Path(name)), "source")


if __name__ == "__main__":
    unittest.main()

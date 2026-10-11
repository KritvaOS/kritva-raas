#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : test_planning_root.py
# Description : Unit tests for the planning root locator and its use by the documentation checkers
#
# Component   : Infrastructure
# Module      : Planning Root Locator
# Layer       : Development Infrastructure
#
# Requirements: N/A — planning alignment migration, step 2 (PB-048)
# API         : Python unittest suite
#
# Author      : KritvaOS
# Created     : 11-10-2026
#==============================================================================

import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts/docs"


def load(name):
    sys.path.insert(0, str(SCRIPTS))
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


pr = load("planning_root")
approvals = load("check_backend_approvals")


class LocatorTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def mk(self, rel):
        (self.root / rel).mkdir(parents=True)

    def test_empty_tree_uses_the_legacy_location(self):
        self.assertEqual(pr.planning_rel(self.root), "docs/planning")

    def test_legacy_location(self):
        self.mk("docs/planning/backend")
        self.assertEqual(pr.planning_rel(self.root), "docs/planning")
        self.assertEqual(pr.planning_dir(self.root), self.root / "docs/planning")

    def test_root_location(self):
        self.mk("planning/backend")
        self.assertEqual(pr.planning_rel(self.root), "planning")
        self.assertEqual(pr.planning_dir(self.root), self.root / "planning")

    def test_stub_at_the_old_location_does_not_count(self):
        self.mk("planning/backend")
        self.mk("docs/planning")
        (self.root / "docs/planning/README.md").write_text("# Moved\n")
        self.assertEqual(pr.planning_rel(self.root), "planning")

    def test_both_locations_is_an_error(self):
        self.mk("planning/backend")
        self.mk("docs/planning/backend")
        with self.assertRaises(pr.PlanningRootError):
            pr.planning_rel(self.root)


class RepositoryTests(unittest.TestCase):
    def test_the_repository_keeps_planning_at_the_root(self):
        self.assertEqual(pr.planning_rel(ROOT), "planning")
        self.assertTrue((ROOT / "planning/PHASES.md").is_file())
        self.assertFalse((ROOT / "docs/planning/backend").exists(), "docs/planning/ may hold only the signpost")


class CheckerLocationTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        (self.root / "scripts/docs").mkdir(parents=True)
        for name in ("planning_root.py", "check_docs.py", "check_backend_traceability.py"):
            shutil.copy(SCRIPTS / name, self.root / "scripts/docs" / name)

    def tearDown(self):
        self._tmp.cleanup()

    def run_script(self, name):
        p = subprocess.run([sys.executable, str(self.root / "scripts/docs" / name)],
                           capture_output=True, text=True, cwd=self.root)
        return p.returncode, p.stdout + p.stderr

    def copy_backend(self, dest):
        shutil.copytree(pr.planning_dir(ROOT) / "backend", self.root / dest / "backend")

    def test_traceability_gives_the_same_result_in_both_locations(self):
        self.copy_backend("docs/planning")
        rc_old, out_old = self.run_script("check_backend_traceability.py")
        shutil.rmtree(self.root / "docs")
        self.copy_backend("planning")
        rc_new, out_new = self.run_script("check_backend_traceability.py")
        self.assertEqual((rc_old, rc_new), (0, 0), out_old + out_new)
        self.assertEqual(out_old, out_new)
        self.assertIn("4 dossiers checked, 0 problems", out_new)

    def test_traceability_refuses_both_locations(self):
        self.copy_backend("docs/planning")
        self.copy_backend("planning")
        rc, out = self.run_script("check_backend_traceability.py")
        self.assertEqual(rc, 1)
        self.assertIn("both planning/backend/ and docs/planning/backend/ exist", out)

    def minimal_docs_tree(self, planning):
        base = self.root / planning
        (base / "backend").mkdir(parents=True)
        for name in ("PHASES.md", "IMPLEMENTATION_ROADMAP.md", "DECISIONS.md"):
            (base / name).write_text("# T\n")
        (base / "NOTE.md").write_text("# Note\n\nThe CORE PLATFORM name is retired.\n")
        (self.root / "docs/tracking").mkdir(parents=True)
        (self.root / "docs/tracking/RISK_REGISTER.md").write_text("# R\n")

    def test_docs_check_scans_the_legacy_location(self):
        self.minimal_docs_tree("docs/planning")
        rc, out = self.run_script("check_docs.py")
        self.assertEqual(rc, 1)
        self.assertIn("docs/planning/NOTE.md: retired name", out)
        self.assertIn("docs/planning/DECISIONS.md: SYS-ADR-007 missing", out)

    def test_docs_check_scans_the_root_location(self):
        self.minimal_docs_tree("planning")
        rc, out = self.run_script("check_docs.py")
        self.assertEqual(rc, 1)
        self.assertIn("planning/NOTE.md: retired name", out)
        self.assertIn("planning/DECISIONS.md: SYS-ADR-007 missing", out)
        self.assertNotIn("docs/planning", out)

    def test_docs_check_refuses_both_locations(self):
        self.minimal_docs_tree("docs/planning")
        (self.root / "planning/backend").mkdir(parents=True)
        rc, out = self.run_script("check_docs.py")
        self.assertEqual(rc, 1)
        self.assertIn("both planning/backend/ and docs/planning/backend/ exist", out)


class ApprovalsLocationTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def test_no_packages_is_clean_in_both_locations(self):
        for base in ("docs/planning", "planning"):
            (self.root / base / "backend").mkdir(parents=True, exist_ok=True)
            self.assertEqual(approvals.check(self.root), ([], 0))
            shutil.rmtree(self.root / base)

    def test_package_at_the_root_location(self):
        base = "planning/backend"
        pkg = f"{base}/decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md"
        inc = f"{base}/increments/B-INC-001-SECURE-FOUNDATION"
        rec = f"{inc}/decisions/KR-BINC-001-001-runtime-language.md"
        link = "../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md"
        body = [f"# Package\n\n## 1. Document Control\n\n| Field | Value |\n|---|---|\n"
                f"| Document | Test |\n| Path | `{pkg}` |\n| Status | Draft |\n"
                f"| Owner role | Backend Technical Lead |\n| Decision ID | KR-BINC-001-001 |\n"
                f"| Task ID | KR-BINC-001-001 |\n| Increment | B-INC-001 |\n| Revision | 1 |\n"]
        for i, h in enumerate(approvals.REQUIRED_HEADINGS[1:], 2):
            text = f"\n## {i}. {h}\n\n"
            if h == "Canonical Decision Record":
                text += f"[record]({link})\n\n{approvals.AUTHORITY_SENTENCE}\n"
            else:
                text += "Text.\n"
            body.append(text)
        files = {
            pkg: "".join(body),
            rec: ("# Record\n\n## Document Control\n\n| Field | Value |\n|---|---|\n| Status | Proposed |\n\n"
                  "## 9. Approval Record\n\n| Approver role | Decision | Date | Evidence |\n|---|---|---|---|\n"),
            f"{inc}/TASKS.md": "# Tasks\n\n### KR-BINC-001-001 — Decide runtime\n\nBody.\n",
            f"{base}/decisions/README.md": "list approvals/APPROVAL-KR-BINC-001-001-runtime-language.md\n",
        }
        for rel, text in files.items():
            p = self.root / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(text)
        self.assertEqual(approvals.check(self.root), ([], 1))

    def test_both_locations_is_reported(self):
        (self.root / "planning/backend").mkdir(parents=True)
        (self.root / "docs/planning/backend").mkdir(parents=True)
        errors, n = approvals.check(self.root)
        self.assertEqual(n, 0)
        self.assertTrue(any("both planning/backend/" in e for e in errors), errors)


if __name__ == "__main__":
    unittest.main()

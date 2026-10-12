#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : test_status_consistency.py
# Description : Unit tests for the status consistency report
#
# Component   : Infrastructure
# Module      : Status Consistency Report
# Layer       : Development Infrastructure
#
# Requirements: N/A — planning alignment migration, step 6 (PB-052)
# API         : Python unittest suite
#
# Author      : KritvaOS
# Created     : 12-10-2026
#==============================================================================

import hashlib
import importlib.util
import io
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts/docs"
sys.path.insert(0, str(SCRIPTS))
_spec = importlib.util.spec_from_file_location("check_status_consistency", SCRIPTS / "check_status_consistency.py")
chk = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(chk)

INC1 = "planning/backend/increments/B-INC-001-SECURE-FOUNDATION/TASKS.md"
INC2 = "planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/TASKS.md"
VIEW = "docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md"


def tasks_doc(status_default="Proposed", entries=()):
    """entries: (task id, status text or None)."""
    out = [f"# Tasks\n\n## Document Control\n\n| Field | Value |\n|---|---|\n| Status | {status_default} |\n\n## 3. Tasks\n"]
    for tid, status in entries:
        out.append(f"\n### {tid} — Title\n\n- **Description:** Text.\n")
        if status is not None:
            out.append(f"- **Status:** {status}\n")
    return "".join(out)


def view_doc(rows):
    """rows: (task id, box)."""
    out = ["# Tasks\n\n| ID | Description | Estimate | Owner Role | Dependencies | Status |\n|---|---|---:|---|---|---|\n"]
    for tid, box in rows:
        out.append(f"| {tid} | Description | 1d | Backend | 001 | {box} |\n")
    return "".join(out)


class NormalizeTests(unittest.TestCase):
    def test_spelling_only(self):
        for text in ("In Review", "IN REVIEW", "in_review", "In-Review", "  in   review "):
            self.assertEqual(chk.normalize(text), "IN REVIEW")

    def test_every_vocabulary_value_is_read(self):
        for value in chk.TASK_MAP:
            self.assertEqual(chk.read_status(value.title()), value)
            self.assertEqual(chk.read_status(value.replace(" ", "_").lower()), value)

    def test_longest_value_wins(self):
        self.assertEqual(chk.read_status("In Review. The decision record is Approved"), "IN REVIEW")
        self.assertEqual(chk.read_status("Changes requested after review"), "CHANGES REQUESTED")
        self.assertEqual(chk.read_status("Accepted on 2026-10-11 by the owner"), "ACCEPTED")
        self.assertEqual(chk.read_status("Not started"), "NOT STARTED")

    def test_unknown_values_are_not_guessed(self):
        for text in ("Reviewed", "Inreview", "Acceptedly", "Finished", ""):
            self.assertIsNone(chk.read_status(text), text)

    def test_proposed_reads_as_not_started_and_keeps_its_note(self):
        self.assertEqual(chk.TASK_MAP["PROPOSED"], ("NOT STARTED", "not approved for execution"))
        self.assertNotEqual(chk.TASK_MAP["READY"][0], chk.TASK_MAP["PROPOSED"][0])

    def test_lifecycle_and_sibling_values(self):
        self.assertEqual(chk.TASK_MAP["BACKLOG"][0], "NOT STARTED")
        self.assertEqual(chk.TASK_MAP["REVIEW"][0], "IN REVIEW")

    def test_rejected_and_done_are_legacy_not_converted(self):
        for value in ("REJECTED", "DONE"):
            self.assertIn(value, chk.LEGACY)
            self.assertNotIn(value, chk.TASK_MAP)


class CheckTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def write(self, rel, text):
        p = self.root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)

    def build(self, canonical, view=None, canonical2=None):
        self.write(INC1, canonical)
        if canonical2 is not None:
            self.write(INC2, canonical2)
        if view is not None:
            self.write(VIEW, view)
        return chk.check(self.root)

    def kinds(self, findings):
        return sorted(k for k, _ in findings)

    def test_consistent_records_have_no_findings(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-001", "Accepted on 2026-10-11"), ("KR-BE-1-002", "In Review")]),
                       view_doc([("KR-BE-1-001", "[x]"), ("KR-BE-1-002", "[ ]")]))
        self.assertEqual(f, [])

    def test_unchecked_view_of_an_accepted_task_is_a_mismatch(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-001", "Accepted")]), view_doc([("KR-BE-1-001", "[ ]")]))
        self.assertEqual(self.kinds(f), ["MISMATCH"])
        self.assertIn("unchecked box", f[0][1])

    def test_checked_box_never_promotes_a_task_to_accepted(self):
        for status in ("In Review", "In Progress", "Proposed", "Changes requested", "Blocked", "Ready"):
            f = self.build(tasks_doc(entries=[("KR-BE-1-001", status)]), view_doc([("KR-BE-1-001", "[x]")]))
            self.assertEqual(self.kinds(f), ["MISMATCH"], status)
            self.assertIn("checked box", f[0][1])

    def test_checked_box_matches_accepted_and_complete(self):
        for status in ("Accepted", "Complete"):
            f = self.build(tasks_doc(entries=[("KR-BE-1-001", status)]), view_doc([("KR-BE-1-001", "[X]")]))
            self.assertEqual(f, [], status)

    def test_task_without_own_status_takes_the_document_status(self):
        f = self.build(tasks_doc("Proposed", [("KR-BE-1-001", None)]), view_doc([("KR-BE-1-001", "[ ]")]))
        self.assertEqual(f, [])
        recs = chk.parse_canonical(self.root / "planning")
        self.assertEqual(recs["KR-BE-1-001"][0]["origin"], "increment default")

    def test_unknown_status_is_reported_and_not_converted(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-001", "Finished last week")]), view_doc([("KR-BE-1-001", "[x]")]))
        self.assertEqual(self.kinds(f), ["UNKNOWN"])

    def test_legacy_values_are_reported_for_reconciliation(self):
        for status in ("Rejected", "Done"):
            f = self.build(tasks_doc(entries=[("KR-BE-1-001", status)]), view_doc([("KR-BE-1-001", "[x]")]))
            self.assertEqual(self.kinds(f), ["LEGACY"], status)
            self.assertIn("not converted", f[0][1])

    def test_missing_view_is_informational(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-001", "In Review")]), view_doc([]))
        self.assertEqual(self.kinds(f), ["MISSING"])

    def test_no_views_at_all(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-001", "In Review")]))
        self.assertEqual(self.kinds(f), ["MISSING"])

    def test_task_listed_by_two_increments_is_not_compared(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-044", "Accepted")]), view_doc([("KR-BE-1-044", "[ ]")]),
                       canonical2=tasks_doc(entries=[("KR-BE-1-044", "Proposed")]))
        self.assertEqual(self.kinds(f), ["SPANS"])

    def test_task_defined_twice_in_one_file_is_a_duplicate(self):
        f = self.build(tasks_doc(entries=[("KR-BE-1-001", "In Review"), ("KR-BE-1-001", "Accepted")]))
        self.assertEqual(self.kinds(f), ["DUPLICATE"])

    def test_phase_dossier_views_are_read(self):
        self.write(INC1, tasks_doc(entries=[("KR-BE-1-001", "Accepted")]))
        self.write("docs/milestones/PHASE-3-CONTROL-PLANE/TASKS.md", view_doc([("KR-BE-1-001", "[ ]")]))
        self.assertEqual(self.kinds(chk.check(self.root)), ["MISMATCH"])

    def test_the_check_changes_no_file(self):
        self.build(tasks_doc(entries=[("KR-BE-1-001", "Accepted"), ("KR-BE-1-002", "Rejected")]),
                   view_doc([("KR-BE-1-001", "[ ]")]))
        def digest():
            return {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(self.root.rglob("*")) if p.is_file()}
        before = digest()
        chk.check(self.root)
        self.assertEqual(digest(), before)


class ModeTests(unittest.TestCase):
    def run_main(self, argv):
        buf = io.StringIO()
        with redirect_stdout(buf):
            rc = chk.main(argv)
        return rc, buf.getvalue()

    def test_report_mode_exits_zero_on_the_repository(self):
        rc, out = self.run_main([])
        self.assertEqual(rc, 0)
        self.assertIn("status consistency (report only)", out)
        self.assertNotIn("UNKNOWN:", out)

    def test_every_record_in_the_repository_is_readable(self):
        records = chk.parse_canonical(ROOT / "planning")
        self.assertGreaterEqual(len(records), 20)
        for tid, recs in records.items():
            for r in recs:
                self.assertIsNotNone(chk.read_status(r["raw"]), f"{tid}: {r['raw'][:40]}")

    def test_strict_mode_exits_one_when_a_view_differs(self):
        findings = chk.check(ROOT)
        has = any(k in chk.STRICT_KINDS for k, _ in findings)
        rc, _ = self.run_main(["--strict"])
        self.assertEqual(rc, 1 if has else 0)


if __name__ == "__main__":
    unittest.main()

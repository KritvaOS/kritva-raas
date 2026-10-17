#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : test_gen_status.py
# Description : Regression tests for the RaaS status report generator
#
# Component   : Infrastructure
# Module      : Program Status Reporting
# Layer       : Development Infrastructure
#
# Requirements: N/A — kritva-program decisions D-009, D-011, D-012, D-026, D-030
# API         : python3 -m unittest discover -s tests/status_report
#
# Author      : KritvaOS
# Created     : 17-10-2026
#==============================================================================

import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "status"))
import gen_status  # noqa: E402

TS = "2026-10-17T00:00:00Z"


def task_file(path, rows):
    """rows: [(id, title, status text or None)]"""
    text = "# T\n\n## 3. Tasks\n\n"
    for tid, title, st in rows:
        text += f"### {tid} — {title}\n\n- **Description:** d\n"
        if st is not None:
            text += f"- **Status:** {st}\n"
        text += "- **Linked AC:** x\n\n"
    Path(path).write_text(text, encoding="utf-8")


class RealFiles(unittest.TestCase):
    def test_all_four_increments_are_covered_without_duplicates(self):
        doc, _ = gen_status.build(ROOT, TS)
        ids = [t["task_id"] for t in doc["tasks"]]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(len(ids), 67)
        for inc in gen_status.INCREMENTS:
            self.assertTrue((ROOT / gen_status.increment_path(inc)).is_file())

    def test_no_acceptance_fields_and_no_commit_bound_evidence(self):
        doc, _ = gen_status.build(ROOT, TS)
        for t in doc["tasks"]:
            self.assertEqual(set(t), {"task_id", "execution", "git_sync", "readiness", "evidence"})
            for ev in t["evidence"]:
                self.assertIsNone(ev["commit"])
                self.assertIsNone(ev["ci_run"])
                self.assertIsNone(ev["result"])

    def test_committed_status_facts_match_planning_records(self):
        doc, _ = gen_status.build(ROOT, TS)
        old = json.loads((ROOT / "status/status.json").read_text())
        self.assertEqual(gen_status.facts(old), gen_status.facts(doc))

    def test_shared_tasks_are_one_task_with_two_references(self):
        doc, _ = gen_status.build(ROOT, TS)
        by = {t["task_id"]: t for t in doc["tasks"]}
        for tid in ("KR-BE-1-044", "KR-BE-1-045"):
            self.assertEqual(len(by[tid]["evidence"]), 2)


class Parsing(unittest.TestCase):
    def parse(self, rows):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "TASKS.md"
            task_file(p, rows)
            return gen_status.parse_tasks(p)

    def test_status_words_map_conservatively(self):
        rows = [("KR-BE-1-001", "a", "Accepted on 2026-10-11 by x."), ("KR-BE-1-002", "b", "In Review. text"),
                ("KR-BE-1-003", "c", "Blocked."), ("KR-BE-1-004", "d", "Proposed."), ("KR-BE-1-005", "e", None)]
        got = {t[0]: gen_status.execution(t[2]) for t in self.parse(rows)}
        self.assertEqual(got, {"KR-BE-1-001": "COMPLETE", "KR-BE-1-002": "IN_PROGRESS",
                               "KR-BE-1-003": "BLOCKED", "KR-BE-1-004": "NOT_STARTED",
                               "KR-BE-1-005": "NOT_STARTED"})

    def test_unknown_or_deferred_status_fails(self):
        for st in ("Deferred.", "Rejected.", "SHIPPED?"):
            with self.assertRaises(ValueError, msg=st):
                self.parse([("KR-BE-1-001", "a", st)])

    def test_duplicate_task_in_one_file_fails(self):
        with self.assertRaises(ValueError):
            self.parse([("KR-BE-1-001", "a", None), ("KR-BE-1-001", "b", None)])

    def test_two_status_lines_for_one_task_fails(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "TASKS.md"
            p.write_text("### KR-BE-1-001 — a\n- **Status:** Accepted\n- **Status:** Blocked\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                gen_status.parse_tasks(p)

    def test_status_after_section_heading_is_not_attributed_to_a_task(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "TASKS.md"
            p.write_text("### KR-BE-1-001 — a\n\n## 9. Status\n\n- **Status:** Accepted\n", encoding="utf-8")
            self.assertIsNone(gen_status.parse_tasks(p)[0][2])

    def test_file_without_tasks_fails(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "TASKS.md"
            p.write_text("# nothing\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                gen_status.parse_tasks(p)


class Synthetic(unittest.TestCase):
    def repo(self, per_increment, origin=True):
        d = tempfile.TemporaryDirectory()
        self.addCleanup(d.cleanup)
        r = Path(d.name)
        for inc, rows in zip(gen_status.INCREMENTS, per_increment):
            p = r / gen_status.increment_path(inc)
            p.parent.mkdir(parents=True)
            task_file(p, rows)
        (r / ".git" / "refs" / "heads").mkdir(parents=True)
        (r / ".git" / "refs" / "heads" / "main").write_text("a" * 40)
        if origin:
            (r / ".git" / "refs" / "remotes" / "origin").mkdir(parents=True)
            (r / ".git" / "refs" / "remotes" / "origin" / "main").write_text("a" * 40)
        return r

    def base(self):
        return [[("KR-BE-1-001", "a", "Accepted")], [("KR-BE-1-010", "b", None)],
                [("KR-BE-1-022", "c", None)], [("KR-BE-1-032", "d", None)]]

    def test_missing_increment_file_fails(self):
        r = self.repo(self.base())
        (r / gen_status.increment_path(gen_status.INCREMENTS[3])).unlink()
        with self.assertRaises(ValueError):
            gen_status.build(r, TS)

    def test_shared_task_with_different_statuses_fails(self):
        rows = self.base()
        rows[1].append(("KR-BE-1-044", "x", "Accepted"))
        rows[2].append(("KR-BE-1-044", "x", None))
        with self.assertRaises(ValueError):
            gen_status.build(self.repo(rows), TS)

    def test_shared_task_with_same_status_is_one_task(self):
        rows = self.base()
        rows[1].append(("KR-BE-1-044", "x", None))
        rows[2].append(("KR-BE-1-044", "x", None))
        doc, _ = gen_status.build(self.repo(rows), TS)
        self.assertEqual(sum(t["task_id"] == "KR-BE-1-044" for t in doc["tasks"]), 1)

    def test_readiness_and_execution_for_unrecorded_task(self):
        doc, _ = gen_status.build(self.repo(self.base()), TS)
        by = {t["task_id"]: t for t in doc["tasks"]}
        self.assertEqual((by["KR-BE-1-010"]["execution"], by["KR-BE-1-010"]["readiness"]), ("NOT_STARTED", "PLANNABLE"))
        self.assertEqual((by["KR-BE-1-001"]["execution"], by["KR-BE-1-001"]["readiness"]), ("COMPLETE", "IMPLEMENTABLE"))

    def test_without_git_sync_is_never_synced(self):
        doc, unchecked = gen_status.build(self.repo(self.base()), TS)
        self.assertTrue(unchecked)
        self.assertEqual({t["git_sync"] for t in doc["tasks"]}, {"COMMITTED"})

    def test_without_origin_ref_is_not_synced(self):
        doc, _ = gen_status.build(self.repo(self.base(), origin=False), TS)
        self.assertEqual({t["git_sync"] for t in doc["tasks"]}, {"NOT_SYNCED"})


if __name__ == "__main__":
    unittest.main()

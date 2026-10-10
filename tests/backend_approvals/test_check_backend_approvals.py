#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : test_check_backend_approvals.py
# Description : Unit tests for the backend approval package checker
#
# Component   : Infrastructure
# Module      : Backend Approval Package Checker
# Layer       : Development Infrastructure
#
# Requirements: N/A — backend decision approval governance (PB-012)
# API         : Python unittest suite
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
_spec = importlib.util.spec_from_file_location(
    "check_backend_approvals", ROOT / "scripts/docs/check_backend_approvals.py")
chk = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(chk)

INC = "docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION"
PKG = "docs/planning/backend/decisions/approvals/APPROVAL-KR-BINC-001-001-runtime-language.md"
REC = INC + "/decisions/KR-BINC-001-001-runtime-language.md"
README = "docs/planning/backend/decisions/README.md"
LINK = "../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-001-runtime-language.md"


def package(status="Draft", task="KR-BINC-001-001", decision="KR-BINC-001-001", path=PKG,
            link=LINK, authority=True, omit=None, extra=""):
    body = [f"# Package\n\n## 1. Document Control\n\n| Field | Value |\n|---|---|\n"
            f"| Document | Test |\n| Path | `{path}` |\n| Status | {status} |\n"
            f"| Owner role | Backend Technical Lead |\n| Decision ID | {decision} |\n"
            f"| Task ID | {task} |\n| Increment | B-INC-001 |\n| Revision | 1 |\n"]
    for i, h in enumerate(chk.REQUIRED_HEADINGS[1:], 2):
        if h == omit:
            continue
        text = f"\n## {i}. {h}\n\n"
        if h == "Canonical Decision Record":
            text += f"[record]({link})\n\n" + (chk.AUTHORITY_SENTENCE + "\n" if authority else "")
        else:
            text += "Text.\n"
        body.append(text)
    return "".join(body) + extra


def record(status="Proposed", row="Pending"):
    return (f"# Record\n\n## Document Control\n\n| Field | Value |\n|---|---|\n| Status | {status} |\n\n"
            f"## 9. Approval Record\n\n| Approver role | Decision | Date | Evidence |\n|---|---|---|---|\n"
            f"| Backend Technical Lead | {row} | — | — |\n")


TASKS = "# Tasks\n\n### KR-BINC-001-001 — Decide runtime\n\nBody.\n"


class ApprovalCheckerTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def build(self, pkg=None, rec=None, tasks=TASKS, readme=True, name=PKG):
        for rel, text in ((name, pkg if pkg is not None else package()),
                          (REC, rec if rec is not None else record()),
                          (INC + "/TASKS.md", tasks),
                          (README, "list approvals/APPROVAL-KR-BINC-001-001-runtime-language.md\n" if readme else None)):
            if text is None:
                continue
            p = self.root / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(text)
        return chk.check(self.root)

    def has(self, errors, fragment):
        self.assertTrue(any(fragment in e for e in errors), f"{fragment!r} not in {errors}")

    def test_valid_package(self):
        errors, n = self.build()
        self.assertEqual((errors, n), ([], 1))

    def test_no_packages_is_clean(self):
        self.assertEqual(chk.check(self.root), ([], 0))

    def test_bad_file_name(self):
        errors, _ = self.build(name="docs/planning/backend/decisions/approvals/APPROVAL-bad_name.md")
        self.has(errors, "file name must be")

    def test_missing_section(self):
        errors, _ = self.build(pkg=package(omit="Decision Scope"))
        self.has(errors, "missing section 'Decision Scope'")

    def test_status_must_be_workflow_status(self):
        for bad in ("Approved", "In Review", "Proposed"):
            errors, _ = self.build(pkg=package(status=bad))
            self.has(errors, "package Status")

    def test_valid_statuses(self):
        for good in ("Draft", "Requested", "Closed", "Withdrawn"):
            errors, _ = self.build(pkg=package(status=good))
            self.assertEqual(errors, [])

    def test_broken_decision_link(self):
        errors, _ = self.build(pkg=package(link="../../increments/B-INC-001-SECURE-FOUNDATION/decisions/missing.md"))
        self.has(errors, "does not exist")

    def test_unknown_task_id(self):
        errors, _ = self.build(tasks="# Tasks\n\n### KR-BINC-001-009 — Other\n")
        self.has(errors, "is not defined in")

    def test_decision_id_must_match_name(self):
        errors, _ = self.build(pkg=package(decision="KR-BINC-001-002"))
        self.has(errors, "Decision ID")

    def test_path_must_match(self):
        errors, _ = self.build(pkg=package(path="docs/wrong.md"))
        self.has(errors, "Path")

    def test_authority_sentence_required(self):
        errors, _ = self.build(pkg=package(authority=False))
        self.has(errors, "must state")

    def test_package_must_not_record_disposition(self):
        errors, _ = self.build(pkg=package(extra="\n| Backend Technical Lead | Approved |\n"))
        self.has(errors, "final disposition")

    def test_record_status_vocabulary(self):
        errors, _ = self.build(rec=record(status="In Review"))
        self.has(errors, "not a decision disposition")

    def test_approved_record_cannot_have_pending_row(self):
        errors, _ = self.build(rec=record(status="Approved", row="Pending"))
        self.has(errors, "Pending")

    def test_approved_record_with_approved_row_is_valid(self):
        errors, _ = self.build(rec=record(status="Approved", row="Approved"))
        self.assertEqual(errors, [])

    def test_readme_must_list_package(self):
        errors, _ = self.build(readme=False)
        self.has(errors, "README.md")

    def test_id_in_name_is_not_a_task_definition(self):
        errors, _ = self.build(tasks="# Tasks\n")
        self.has(errors, "is not defined in")

    def test_real_repository_passes(self):
        errors, n = chk.check(ROOT)
        self.assertEqual(errors, [])
        self.assertGreaterEqual(n, 3)


if __name__ == "__main__":
    unittest.main()

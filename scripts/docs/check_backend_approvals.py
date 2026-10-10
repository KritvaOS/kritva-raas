#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : check_backend_approvals.py
# Description : Validates backend decision-approval packages and their canonical decision records
#
# Component   : Infrastructure
# Module      : Backend Approval Package Checker
# Layer       : Development Infrastructure
#
# Requirements: N/A — backend decision approval governance (PB-012)
# API         : Command-line approval package validation
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

"""Structure checks for backend decision-approval packages.

Packages live in docs/planning/backend/decisions/approvals/APPROVAL-<DECISION-ID>-<slug>.md.
For every package, verify that:
1. The file name follows the naming rule and the Decision ID matches it.
2. The Document Control table has the required fields, the Path equals the real
   path, and the Status is a package workflow status (Draft, Requested, Closed,
   Withdrawn), never a decision disposition or a task status.
3. All required section headings are present.
4. The Canonical Decision Record section links exactly one existing decision
   record, and the package states that the decision record is authoritative.
5. A task-backed package names a task that exists in the increment TASKS.md, in
   the increment that holds the linked decision record.
6. The package does not carry a final disposition of its own.
7. The linked decision record uses the disposition vocabulary, and a record
   marked Approved has no Pending approval row.
8. decisions/README.md lists every package.

The checker validates structure and consistency only. It never infers or changes
a decision disposition or a task status, and a passing run is not an approval.
Exit status is 1 if any check fails.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND_REL = "docs/planning/backend"

PACKAGE_STATUSES = {"Draft", "Requested", "Closed", "Withdrawn"}
DISPOSITIONS = {"Proposed", "Approved", "Rejected", "Returned for revision", "Superseded"}
ROW_DECISIONS = {"Pending", "Approved", "Rejected", "Returned for revision"}
CONTROL_FIELDS = ["Document", "Path", "Status", "Owner role", "Decision ID",
                  "Task ID", "Increment", "Revision"]
REQUIRED_HEADINGS = [
    "Document Control",
    "Purpose and Requested Disposition",
    "Canonical Decision Record",
    "Decision Scope",
    "Recommendation Summary",
    "Options and Trade-offs",
    "Required Evidence and Review Questions",
    "Dependencies and Downstream Impact",
    "Required Approvers and Review Record",
    "Approval Instructions",
    "References",
]
AUTHORITY_SENTENCE = "The decision record is authoritative for the final disposition."
NAME_RE = re.compile(r"^APPROVAL-((?:KR-[A-Z]+-\d+-\d{3})|(?:SYS-ADR-\d{3}))-[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
TASK_RE = re.compile(r"^KR-[A-Z]+-\d+-\d{3}$")
LINK_RE = re.compile(r"\]\(([^)\s#]+)(?:#[^)\s]*)?\)")
DISPOSITION_ROW_RE = re.compile(r"^\|.*\|\s*(Approved|Rejected|Returned for revision)\s*\|", re.M)


def control_table(text):
    fields = {}
    m = re.search(r"^##\s+(?:\d+\.\s+)?Document Control\s*\n(.*?)(?=\n##\s|\Z)", text, re.S | re.M)
    if not m:
        return fields
    for line in m.group(1).splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 2 and cells[0] not in ("Field", "---", "") and not set(cells[0]) <= {"-", " "}:
            fields[cells[0]] = cells[1].strip("`")
    return fields


def headings(text):
    return {re.sub(r"^\d+\.\s+", "", h).strip() for h in re.findall(r"^##\s+(.+?)\s*$", text, re.M)}


def section(text, name):
    m = re.search(r"^##\s+(?:\d+\.\s+)?" + re.escape(name) + r"\s*\n(.*?)(?=\n##\s|\Z)", text, re.S | re.M)
    return m.group(1) if m else ""


def check_decision_record(rec, rel, errors):
    text = rec.read_text()
    status = control_table(text).get("Status", "")
    if status not in DISPOSITIONS:
        errors.append(f"{rel}: decision record Status '{status}' is not a decision disposition {sorted(DISPOSITIONS)}")
    approval = section(text, "Approval Record")
    rows = []
    for line in approval.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 2 and line.startswith("|") and cells[0] not in ("Approver role", "") \
                and not set(cells[0]) <= {"-", " "}:
            rows.append(cells[1])
    for value in rows:
        if value not in ROW_DECISIONS:
            errors.append(f"{rel}: Approval Record decision '{value}' is not one of {sorted(ROW_DECISIONS)}")
    if status == "Approved" and (not rows or "Pending" in rows):
        errors.append(f"{rel}: decision record is Approved but its Approval Record has a Pending or missing row")


def check(root=ROOT):
    backend = root / BACKEND_REL
    approvals = backend / "decisions" / "approvals"
    errors = []
    packages = sorted(approvals.glob("APPROVAL-*.md")) if approvals.is_dir() else []
    for pkg in packages:
        rel = pkg.relative_to(root)
        text = pkg.read_text()
        nm = NAME_RE.match(pkg.name)
        if not nm:
            errors.append(f"{rel}: file name must be APPROVAL-<DECISION-ID>-<slug>.md")
        fields = control_table(text)
        for f in CONTROL_FIELDS:
            if f not in fields:
                errors.append(f"{rel}: Document Control is missing '{f}'")
        if fields.get("Path") and fields["Path"] != str(rel):
            errors.append(f"{rel}: Document Control Path '{fields['Path']}' does not match the file path")
        status = fields.get("Status", "")
        if "Status" in fields and status not in PACKAGE_STATUSES:
            errors.append(f"{rel}: package Status '{status}' must be one of {sorted(PACKAGE_STATUSES)}")
        if nm and fields.get("Decision ID") and fields["Decision ID"] != nm.group(1):
            errors.append(f"{rel}: Decision ID '{fields['Decision ID']}' does not match the file name")
        present = headings(text)
        for h in REQUIRED_HEADINGS:
            if h not in present:
                errors.append(f"{rel}: missing section '{h}'")
        if AUTHORITY_SENTENCE not in text:
            errors.append(f"{rel}: must state '{AUTHORITY_SENTENCE}'")
        if DISPOSITION_ROW_RE.search(text):
            errors.append(f"{rel}: package must not record a final disposition; record it in the decision record")
        links = [l for l in LINK_RE.findall(section(text, "Canonical Decision Record"))
                 if not l.startswith(("http:", "https:", "mailto:"))]
        records = []
        for l in links:
            target = (pkg.parent / l).resolve()
            if not target.exists():
                errors.append(f"{rel}: Canonical Decision Record link '{l}' does not exist")
            else:
                records.append(target)
        if len(links) != 1:
            errors.append(f"{rel}: Canonical Decision Record section must link exactly one decision record")
        elif records:
            rec = records[0]
            if rec.parent.name != "decisions" or "increments" not in rec.parts:
                errors.append(f"{rel}: canonical record must be in an increment decisions/ directory")
            check_decision_record(rec, rec.relative_to(root), errors)
            task = fields.get("Task ID", "")
            if TASK_RE.match(task):
                if not rec.name.startswith(task):
                    errors.append(f"{rel}: Task ID {task} does not match the linked decision record {rec.name}")
                inc_dir = rec.parent.parent
                tasks = (inc_dir / "TASKS.md")
                if not tasks.exists() or not re.search(r"^### " + re.escape(task) + r" — ", tasks.read_text(), re.M):
                    errors.append(f"{rel}: Task ID {task} is not defined in {inc_dir.name}/TASKS.md")
                if fields.get("Increment") and not inc_dir.name.startswith(fields["Increment"]):
                    errors.append(f"{rel}: Increment '{fields['Increment']}' does not match {inc_dir.name}")
            elif task and task != "Not applicable":
                errors.append(f"{rel}: Task ID '{task}' must be a task ID or 'Not applicable'")
    readme = backend / "decisions" / "README.md"
    if packages and not readme.exists():
        errors.append(f"{BACKEND_REL}/decisions/README.md is missing")
    elif readme.exists():
        listed = readme.read_text()
        for pkg in packages:
            if f"approvals/{pkg.name}" not in listed:
                errors.append(f"{BACKEND_REL}/decisions/README.md does not list {pkg.name}")
    return errors, len(packages)


def main():
    errors, n = check()
    for e in errors:
        print("ERROR", e)
    print(f"{n} approval packages checked, {len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

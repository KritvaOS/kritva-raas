#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : check_status_consistency.py
# Description : Read-only report of task status differences between increment records and their views
#
# Component   : Infrastructure
# Module      : Status Consistency Report
# Layer       : Development Infrastructure
#
# Requirements: N/A — planning alignment migration, step 6 (PB-052)
# API         : Command-line status consistency report
#
# Author      : KritvaOS
# Created     : 12-10-2026
#==============================================================================

"""Report where a task status shown in a view differs from the canonical record.

Canonical record: the increment TASKS.md (<planning root>/backend/increments/B-INC-nnn-*/TASKS.md).
A task without its own Status line takes the Status of its TASKS.md document control table.
Views: the Task Register tables of docs/*/milestones/*/TASKS.md and docs/milestones/*/TASKS.md, whose
Status column holds a checkbox.

The checker is read-only and never changes a file. It does not decide a status. It never infers
ACCEPTED: a checked box is consistent only with ACCEPTED or COMPLETE, and no other value is promoted.

Spelling is normalized first (case, space, underscore, hyphen). Meaning is then mapped by an explicit
table. A value that is not in the table is reported as UNKNOWN. A legacy value whose meaning is not
settled (REJECTED, DONE) is reported as LEGACY and is not converted.

Findings: MISMATCH (a view differs from its record), UNKNOWN (a status not in any vocabulary),
LEGACY (a value that needs owner reconciliation), DUPLICATE (a task defined twice in one canonical file),
SPANS (a task that several increments list; allowed by the task register, not compared with a view) and
MISSING (a canonical task that no view lists; informational).

Default mode is a report and exits 0. With --strict, MISMATCH, UNKNOWN and DUPLICATE exit 1.
Strict mode is not enabled in CI until the owner has reviewed the findings.
See planning/PLANNING_STATUS_VOCABULARY.md.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from planning_root import PlanningRootError, planning_dir

ROOT = Path(__file__).resolve().parents[2]

# Task vocabulary: docs/tracking/TASK_STATUS.md Section 7, the backend register values and the lifecycle values.
# Value is (progress status, note). PROPOSED reads as NOT STARTED in a progress view and keeps its note.
TASK_MAP = {
    "NOT STARTED": ("NOT STARTED", ""),
    "PROPOSED": ("NOT STARTED", "not approved for execution"),
    "BACKLOG": ("NOT STARTED", ""),
    "READY": ("READY", ""),
    "IN PROGRESS": ("IN PROGRESS", ""),
    "BLOCKED": ("BLOCKED", ""),
    "IN REVIEW": ("IN REVIEW", ""),
    "REVIEW": ("IN REVIEW", ""),
    "CHANGES REQUESTED": ("CHANGES REQUESTED", ""),
    "ACCEPTED": ("ACCEPTED", ""),
    "COMPLETE": ("COMPLETE", ""),
    "DEFERRED": ("DEFERRED", ""),
    "CANCELLED": ("CANCELLED", ""),
}
# Values that are known but whose meaning is not settled. They are never converted.
LEGACY = {"REJECTED": "may mean a proposal was declined or planned work was stopped", "DONE": "may mean implemented, reviewed or accepted"}
DONE_STATUSES = {"ACCEPTED", "COMPLETE"}
_LONGEST_FIRST = sorted(list(TASK_MAP) + list(LEGACY), key=len, reverse=True)

TASK_HEADING = re.compile(r"^### (KR-[A-Z]+-[0-9A-Z]+-\d{3})\b.*$", re.M)
STATUS_LINE = re.compile(r"^- \*\*Status:\*\*\s*(.+)$", re.M)
DOC_STATUS = re.compile(r"^\| Status \| (.+?) \|\s*$", re.M)
VIEW_ROW = re.compile(r"^\| (KR-[A-Z]+-[0-9A-Z]+-\d{3}) \|.*\| (\[[ xX]\]) \|\s*$", re.M)


def normalize(value):
    """Spelling only: upper case, and space, underscore and hyphen are one separator."""
    return re.sub(r"[\s_\-]+", " ", value.strip()).upper()


def read_status(text):
    """Return the leading status value of a free-text status, or None when it starts with no known value."""
    norm = normalize(text.strip("*` "))
    for known in _LONGEST_FIRST:
        if norm.startswith(known) and (len(norm) == len(known) or not norm[len(known)].isalnum()):
            return known
    return None


def parse_canonical(planning):
    """Return {task id: [record, ...]}. A record holds the raw status, its origin and its source file.

    A task that several increments list (a task that spans increments) has one record per file.
    """
    records = {}
    for tasks in sorted((planning / "backend" / "increments").glob("B-INC-*/TASKS.md")):
        text = tasks.read_text()
        doc = DOC_STATUS.search(text)
        default = doc.group(1) if doc else ""
        matches = list(TASK_HEADING.finditer(text))
        for i, m in enumerate(matches):
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            block = re.split(r"^## ", text[m.end():end], maxsplit=1, flags=re.M)[0]
            line = STATUS_LINE.search(block)
            records.setdefault(m.group(1), []).append(
                {"raw": line.group(1).strip() if line else default,
                 "origin": "task" if line else "increment default", "file": tasks})
    return records


def parse_views(root):
    """Return {task id: [(file, box)]} for the Task Register tables of the milestone dossiers."""
    views = {}
    files = sorted((root / "docs").glob("*/milestones/*/TASKS.md")) + sorted((root / "docs/milestones").glob("*/TASKS.md"))
    for f in sorted(set(files)):
        for m in VIEW_ROW.finditer(f.read_text()):
            views.setdefault(m.group(1), []).append((f, m.group(2).lower()))
    return views


def check(root=ROOT):
    """Return a list of findings (kind, message). The repository is only read."""
    findings = []
    planning = planning_dir(root)
    records = parse_canonical(planning)
    views = parse_views(root)
    for tid, recs in sorted(records.items()):
        files = [r["file"] for r in recs]
        if len(set(files)) < len(files):
            findings.append(("DUPLICATE", f"{tid} is defined more than once in {files[0].relative_to(root)}"))
            continue
        if len(recs) > 1:
            shown = "; ".join(f"{r['file'].parent.name}: {r['raw'][:24]}" for r in recs)
            findings.append(("SPANS", f"{tid} is listed by {len(recs)} increments ({shown}); not compared with a view"))
            continue
        rec = recs[0]
        known = read_status(rec["raw"])
        where = rec["file"].relative_to(root)
        if known is None:
            findings.append(("UNKNOWN", f"{tid}: status '{rec['raw'][:40]}' in {where} is not in any vocabulary"))
            continue
        if known in LEGACY:
            findings.append(("LEGACY", f"{tid}: {known} in {where} needs owner reconciliation ({LEGACY[known]}); not converted"))
            continue
        progress = TASK_MAP[known][0]
        listed = views.get(tid, [])
        if not listed:
            findings.append(("MISSING", f"{tid} ({progress}) is not listed in any milestone Task Register"))
        for f, box in listed:
            checked = box == "[x]"
            if checked and progress not in DONE_STATUSES:
                findings.append(("MISMATCH", f"{tid}: {f.relative_to(root)} shows a checked box, the record in {where} is {progress}"))
            elif not checked and progress in DONE_STATUSES:
                findings.append(("MISMATCH", f"{tid}: {f.relative_to(root)} shows an unchecked box, the record in {where} is {progress}"))
    return findings


STRICT_KINDS = {"MISMATCH", "UNKNOWN", "DUPLICATE"}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    strict = "--strict" in argv
    try:
        findings = check(ROOT)
    except PlanningRootError as exc:
        print(f"ERROR {exc}")
        return 1
    order = ["MISMATCH", "UNKNOWN", "DUPLICATE", "LEGACY", "SPANS", "MISSING"]
    for kind in order:
        rows = [m for k, m in findings if k == kind]
        if kind in ("MISSING", "SPANS") and rows:
            print(f"{kind}: {len(rows)} task(s)" + (" are not listed in any milestone Task Register" if kind == "MISSING" else " are listed by more than one increment"))
            if kind == "SPANS":
                for m in rows:
                    print(f"  {m}")
            continue
        for m in rows:
            print(f"{kind}: {m}")
    counts = {k: sum(1 for kk, _ in findings if kk == k) for k in order}
    print("status consistency (" + ("strict" if strict else "report only") + "): "
          + ", ".join(f"{counts[k]} {k.lower()}" for k in order))
    return 1 if strict and any(counts[k] for k in STRICT_KINDS) else 0


if __name__ == "__main__":
    sys.exit(main())

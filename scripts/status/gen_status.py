#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : gen_status.py
# Description : Generate status/status.json (kritva-program schema 2.0) for the RaaS backend tasks
#
# Component   : Infrastructure
# Module      : Program Status Reporting
# Layer       : Development Infrastructure
#
# Requirements: N/A — kritva-program decisions D-009, D-011, D-012, D-026, D-030
# API         : Command-line status report generator
#
# Author      : KritvaOS
# Created     : 17-10-2026
#==============================================================================

"""Generate status/status.json (kritva-program schema 2.0) for kritva-raas.

Scope: every task listed in the TASKS.md of the increments in INCREMENTS below
(B-INC-001 to B-INC-004). Adding an increment is an explicit edit of that list.

Reports FACTS only, derived from this repo's own planning records:
  planning/backend/increments/<increment>/TASKS.md   task headings and `- **Status:**` lines
  git (or .git/refs when git is unavailable)         source commit and sync state
It never reports review or acceptance: those are decided centrally in
kritva-program. The RaaS tasks are not in the approved program baseline, so
this report earns no progress credit by itself; it only makes the repo's own
records machine-readable.

Field semantics (kept deliberately conservative):
  * execution: from the task's own Status line. Accepted -> COMPLETE (the repo
    owner's acceptance, not a program approval); In Review / In Progress ->
    IN_PROGRESS; Blocked -> BLOCKED; Proposed / Ready / Not started -> NOT_STARTED.
    A task with no Status line is NOT_STARTED (nothing is recorded as begun).
    Any other status word (Deferred, Rejected, unknown) is an error, not a guess.
  * git_sync: SYNCED only when git confirms a clean tree whose HEAD equals
    origin/main. Without git, cleanliness is unverified, so COMMITTED is used.
  * readiness: PLANNABLE when no status is recorded, otherwise IMPLEMENTABLE.
    It means only that software work may proceed, subject to central gates.
  * evidence: one entry per increment file that lists the task. It is a
    RECORD REFERENCE, not proof of completion (no commit, CI run or hash).
  * source.commit: the inspected revision (HEAD at run time). The generated
    file is committed later, so it describes its parent state.
  * A task ID listed in two increments (KR-BE-1-044, KR-BE-1-045 slices) is one
    task; both statuses must agree or generation fails.

Usage: python3 scripts/status/gen_status.py [--root .] [--out status/status.json]
       [--updated-at 2026-10-17T00:00:00Z] [--check | --check-facts]
  --check        local: full comparison (also source commit and git_sync)
  --check-facts  CI: compare only the planning-derived facts; ignores source,
                 git_sync and updated_at, which differ in CI's checkout.
Exit: 0 ok | 1 parse/consistency error | 2 check drift
"""

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

WORKSTREAM_ID = "RAAS"
REPO = "KritvaOS/kritva-raas"
INCREMENTS = [
    "B-INC-001-SECURE-FOUNDATION",
    "B-INC-002-IDENTITY-ORGANIZATION",
    "B-INC-003-PROJECTS-PLATFORM-CATALOG",
    "B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY",
]
TASK_HEADING = re.compile(r"^###\s+(KR-(?:BE-1|BINC-\d{3})-\d{3})\s+\S\s+(.+?)\s*$")
STATUS_LINE = re.compile(r"^- \*\*Status:\*\*\s*(.*)$")
STATUS_WORD = re.compile(r"^(Accepted|In Review|In Progress|Blocked|Proposed|Ready|Not started)\b", re.I)
EXECUTION = {"accepted": "COMPLETE", "in review": "IN_PROGRESS", "in progress": "IN_PROGRESS",
             "blocked": "BLOCKED", "proposed": "NOT_STARTED", "ready": "NOT_STARTED",
             "not started": "NOT_STARTED"}
SHA = re.compile(r"^[0-9a-f]{40}$")


def increment_path(inc):
    return f"planning/backend/increments/{inc}/TASKS.md"


def parse_tasks(path):
    """Return [(task_id, title, status_word_or_None)] in file order; fail on duplicates or bad status."""
    out, seen = [], set()
    cur = None
    for line in path.read_text(encoding="utf-8").splitlines():
        m = TASK_HEADING.match(line)
        if m:
            if m.group(1) in seen:
                raise ValueError(f"{path}: duplicate task {m.group(1)}")
            seen.add(m.group(1))
            cur = [m.group(1), m.group(2), None]
            out.append(cur)
            continue
        if line.startswith("## "):
            cur = None
            continue
        s = STATUS_LINE.match(line)
        if s and cur is not None:
            if cur[2] is not None:
                raise ValueError(f"{path}: {cur[0]} has more than one Status line")
            w = STATUS_WORD.match(s.group(1).strip())
            if not w:
                raise ValueError(f"{path}: unrecognised status for {cur[0]}: {s.group(1)[:40]!r}")
            cur[2] = w.group(1).lower()
    if not out:
        raise ValueError(f"{path}: no task headings found")
    return [tuple(t) for t in out]


def execution(word):
    return "NOT_STARTED" if word is None else EXECUTION[word]


def git(root, *args):
    try:
        r = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True)
        return r.stdout.strip() if r.returncode == 0 else None
    except OSError:
        return None


def ref(root, rel):
    p = root / ".git" / rel
    return p.read_text().strip() if p.exists() else None


def source_info(root):
    head = git(root, "rev-parse", "HEAD") or ref(root, "refs/heads/main")
    if not head or not SHA.match(head):
        raise ValueError("cannot determine 40-hex HEAD commit")
    origin = git(root, "rev-parse", "origin/main") or ref(root, "refs/remotes/origin/main")
    dirty = git(root, "status", "--porcelain")
    if origin is None:
        sync = "NOT_SYNCED"
    elif dirty is None:  # git unavailable: cleanliness unverified, so never claim SYNCED
        sync = "COMMITTED"
    elif dirty:
        sync = "NOT_COMMITTED"
    elif head == origin:
        sync = "SYNCED"
    else:
        sync = "NOT_SYNCED"
    return {"branch": "main", "commit": head, "tag": None}, sync, dirty is None


def collect(root):
    """Return {task_id: {"word": status word or None, "files": [paths]}} across all increments."""
    tasks = {}
    for inc in INCREMENTS:
        rel = increment_path(inc)
        p = root / rel
        if not p.is_file():
            raise ValueError(f"missing increment task file: {rel}")
        for tid, _title, word in parse_tasks(p):
            if tid in tasks:
                if tasks[tid]["word"] != word:
                    raise ValueError(f"{tid} is listed in two increments with different statuses")
                tasks[tid]["files"].append(rel)
            else:
                tasks[tid] = {"word": word, "files": [rel]}
    return tasks


def build(root, updated_at):
    source, sync, dirty_unchecked = source_info(root)
    found = collect(root)
    tasks = []
    for tid in sorted(found):
        word = found[tid]["word"]
        shown = word if word else "no status recorded"
        tasks.append({
            "task_id": tid,
            "execution": execution(word),
            "git_sync": sync,
            "readiness": "PLANNABLE" if word is None else "IMPLEMENTABLE",
            "evidence": [{
                "type": "software",
                "uri": rel,
                "description": f"Record reference only (not completion proof); planning status: {shown}",
                "commit": None, "ci_run": None, "report_sha256": None, "result": None,
            } for rel in found[tid]["files"]],
        })
    doc = {"schema_version": "2.0", "workstream_id": WORKSTREAM_ID, "repo": REPO,
           "source": source, "tasks": tasks, "updated_at": updated_at}
    return doc, dirty_unchecked


def facts(d):
    return {**{k: v for k, v in d.items() if k not in ("source", "updated_at")},
            "tasks": [{k: v for k, v in t.items() if k != "git_sync"} for t in d["tasks"]]}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=".")
    ap.add_argument("--out", default="status/status.json")
    ap.add_argument("--updated-at", help="ISO-8601 UTC (default: now)")
    ap.add_argument("--check", action="store_true", help="fail if output file differs from regeneration")
    ap.add_argument("--check-facts", action="store_true",
                    help="fail if planning-derived facts differ (ignores source, git_sync, updated_at)")
    a = ap.parse_args()
    root = Path(a.root)
    ts = a.updated_at or dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        doc, dirty_unchecked = build(root, ts)
    except (ValueError, OSError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    if dirty_unchecked:
        print("WARN: git unavailable; uncommitted changes were not checked", file=sys.stderr)
    out = root / a.out
    if a.check_facts or a.check:
        if not out.exists():
            print(f"ERROR: {out} not found", file=sys.stderr)
            return 2
        old = json.loads(out.read_text())
        if a.check_facts:
            same = facts(old) == facts(doc)
        else:
            old["updated_at"] = doc["updated_at"]
            same = old == doc
        if not same:
            print("status.json differs from planning records; regenerate with scripts/status/gen_status.py", file=sys.stderr)
            return 2
        return 0
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(doc, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Traceability checks for backend increment dossiers.

For every docs/planning/backend/increments/B-INC-nnn-*/ dossier, verify that:
1. ACCEPTANCE_CRITERIA.md traces cite only BAC-, BTS- and SEC-GATE- IDs defined in
   BACKEND_ACCEPTANCE_CRITERIA.md, BACKEND_TEST_STRATEGY.md and BACKEND_SECURITY_GATE.md.
2. Each task in TASKS.md links only existing criteria, and its linked tests and
   security gates equal the union of its linked criteria's traces.
3. GIT_COMMIT_STEP.md has a commit message for every task whose Acceptance, Tests
   and Security-Gates trailers equal TASKS.md, plus a branch, closing commit and tag.
4. Every TEST_PLAN.md matrix row matches its criterion's test and gate traces.

Exit status is 1 if any check fails.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "docs/planning/backend"
ID = r"(?:BTS-\d+|SEC-GATE-\d+|BAC-\d+)"

defined = set()
for name in ("BACKEND_ACCEPTANCE_CRITERIA.md", "BACKEND_TEST_STRATEGY.md", "BACKEND_SECURITY_GATE.md"):
    for line in (BACKEND / name).read_text().splitlines():
        m = re.match(r"^\| (?:\*\*)?(" + ID + r")(?:\*\*)? \|", line)
        if m: defined.add(m.group(1))

def field(body, label):
    m = re.search(r"\*\*" + label + r":\*\* (.*)", body)
    return m.group(1) if m else ""

errors = []
dossiers = sorted(p for p in (BACKEND / "increments").iterdir() if p.is_dir())
for d in dossiers:
    inc = re.match(r"(B-INC-\d{3})", d.name).group(1)
    acs = {}
    for aid, _t, body in re.findall(r"### (" + inc + r"-AC-\d+) — (.+?)\n(.*?)(?=\n### |\n## )", (d / "ACCEPTANCE_CRITERIA.md").read_text(), re.S):
        for x in re.findall(ID, field(body, "Backend acceptance trace") + field(body, "Test trace") + field(body, "Security-gate trace")):
            if x not in defined: errors.append(f"{d.name}: {aid} cites undefined {x}")
        acs[aid] = (set(re.findall(r"BTS-\d+", field(body, "Test trace"))), set(re.findall(r"SEC-GATE-\d+", field(body, "Security-gate trace"))))
    tasks = {}
    for title, body in re.findall(r"### (KR-[A-Z0-9-]+[^\n]*)\n(.*?)(?=\n### |\n## |\Z)", (d / "TASKS.md").read_text(), re.S):
        tid = title.split(" — ")[0].strip()
        linked = re.findall(inc + r"-AC-\d+", field(body, "Linked AC"))
        tests = set(re.findall(r"BTS-\d+", field(body, "Linked tests")))
        gates = set(re.findall(r"SEC-GATE-\d+", field(body, "Linked security gates")))
        for a in linked:
            if a not in acs: errors.append(f"{d.name}: {tid} links undefined {a}")
        et = set().union(*(acs[a][0] for a in linked if a in acs)) if linked else set()
        eg = set().union(*(acs[a][1] for a in linked if a in acs)) if linked else set()
        if tests != et or gates != eg: errors.append(f"{d.name}: {tid} tests/gates are not the union of its criteria")
        tasks[tid] = (set(linked), tests, gates)
    git = (d / "GIT_COMMIT_STEP.md").read_text()
    seen = set()
    for tid, a, t, g in re.findall(r"Tasks: (\S+)[^\n]*\nAcceptance: (.*)\nTests: (.*)\nSecurity-Gates: (.*)\n", git):
        seen.add(tid)
        if tid in tasks and (set(re.findall(inc + r"-AC-\d+", a)), set(re.findall(r"BTS-\d+", t)), set(re.findall(r"SEC-GATE-\d+", g))) != tasks[tid]:
            errors.append(f"{d.name}: commit text for {tid} differs from TASKS.md")
    for tid in tasks:
        if tid not in seen: errors.append(f"{d.name}: no commit text for {tid}")
    for key in ("increment/" + d.name.lower(), d.name.lower() + "-closed", "close " + inc):
        if key not in git: errors.append(f"{d.name}: GIT_COMMIT_STEP.md lacks '{key}'")
    rows = 0
    for line in (d / "TEST_PLAN.md").read_text().splitlines():
        m = re.match(r"\| `?(" + inc + r"-AC-\d+)`?[^|]*\|", line)
        if not m or m.group(1) not in acs: continue
        rows += 1
        if (set(re.findall(r"BTS-\d+", line)), set(re.findall(r"SEC-GATE-\d+", line))) != acs[m.group(1)]:
            errors.append(f"{d.name}: TEST_PLAN row {m.group(1)} differs from its criterion")
    if rows != len(acs): errors.append(f"{d.name}: TEST_PLAN has {rows} matrix rows for {len(acs)} criteria")
    print(f"{d.name}: {len(acs)} criteria, {len(tasks)} tasks, {len(seen & set(tasks))} commit messages, {rows} test-plan rows")

for e in errors: print("ERROR", e)
print(f"{len(dossiers)} dossiers checked, {len(errors)} problems")
sys.exit(1 if errors else 0)

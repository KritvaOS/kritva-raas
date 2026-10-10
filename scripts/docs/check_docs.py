#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : check_docs.py
# Description : Validates documentation structure, canonical phases, milestones and planning invariants
#
# Component   : Infrastructure
# Module      : Documentation Checker
# Layer       : Development Infrastructure
#
# Requirements: N/A — repository documentation governance (RAAS-008)
# API         : Command-line documentation validation
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

"""Documentation consistency checks for docs/.
Structural checks: retired phase/milestone names, canonical milestone folders,
required standard milestone files, broken relative links and backtick doc
references, document-ID/title presence.
Semantic checks (added after external audit RAAS-001..009): canonical
phase-to-milestone mapping tables, milestone primary phases, milestone-name
spelling, phase-label form, P5 EXECUTION / P6 LAB & ROBOT boundary, risk
register phase identifiers, priority notation, and MVP usage.
Exit code 1 on any error. Warnings (legacy phase labels in architecture,
protocol and security documents) are reported but do not fail the run.
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
RETIRED = [r"CORE PLATFORM", r"PRODUCT MVP", r"PRODUCTION LAUNCH", r"SCALE (&|and) OPERATIONS",
           r"SECURITY (&|and) PRODUCTION", r"RESOURCE (&|and) COMMERCIAL", r"Async Execution Foundation",
           r"B-M0\d[^\n]*Backend Foundation", r"B-M0\d[^\n]*Control Plane Foundation", r"F-M0\d[^\n]*Identity (&|and) Workspace",
           r"F-M0\d[^\n]*Platforms (&|and) Development", r"F-M0\d[^\n]*Production Console", r"DB-M0\d[^\n]*Transactional Domain"]
CANON_MILESTONES = {
 "frontend": ["F-M01-STUDIO-FOUNDATION","F-M02-PROJECTS","F-M03-BUILD-ARTIFACT","F-M04-BOOKING","F-M05-EXECUTION","F-M06-LIVE","F-M07-RESULTS"],
 "backend": ["B-M01-CONTROL-PLANE","B-M02-ARTIFACT","B-M03-PLATFORM","B-M04-BOOKING","B-M05-EXECUTION","B-M06-RESULTS","B-M07-PRODUCTION"],
 "cloud": ["C-M01-FOUNDATION","C-M02-DEVELOPMENT","C-M03-STAGING","C-M04-PRODUCTION"],
 "database": ["DB-M01-FOUNDATION","DB-M02-CORE-DATA","DB-M03-BOOKING-DATA","DB-M04-EXECUTION-DATA"],
 ".": ["PHASE-0-FOUNDATION","PHASE-1-STUDIO","PHASE-2-BUILD-ARTIFACT","PHASE-3-CONTROL-PLANE","PHASE-4-BOOKING-COMMERCIAL",
       "PHASE-5-EXECUTION","PHASE-6-LAB-ROBOT","PHASE-7-LIVE-RESULTS","PHASE-8-PRODUCTION"]}
STD = ["MILESTONE.md","TASKS.md","ACCEPTANCE_CRITERIA.md","REVIEW_CHECKLIST.md","CHANGELOG.md","GIT_COMMIT_STEP.md"]
errors = []
def err(m): errors.append(m)
md = sorted(DOCS.rglob("*.md"))
# 1 retired names (PHASES.md may mention them in its retired-names note)
for f in md:
    t = f.read_text()
    for pat in RETIRED:
        if re.search(pat, t) and f.name not in ("PHASES.md",):
            err(f"{f.relative_to(ROOT)}: retired name /{pat}/")
# 2 canonical milestone folders + standard files
for dom, names in CANON_MILESTONES.items():
    base = DOCS / dom / "milestones" if dom != "." else DOCS / "milestones"
    found = sorted(p.name for p in base.iterdir() if p.is_dir()) if base.exists() else []
    if found != sorted(names): err(f"{base.relative_to(ROOT)}: milestone folders {found} != {sorted(names)}")
    for n in names:
        for s in STD:
            if not (base / n / s).exists(): err(f"{(base/n).relative_to(ROOT)}: missing {s}")
# 3 broken relative markdown links
LINK = re.compile(r"\]\((?!https?:|#|mailto:)([^)#\s]+)")
for f in md:
    for m in LINK.finditer(f.read_text()):
        tgt = (f.parent / m.group(1)).resolve()
        if not tgt.exists(): err(f"{f.relative_to(ROOT)}: broken link {m.group(1)}")
# 4 backtick docs/ references that do not exist (skip globs and placeholders)
REF = re.compile(r"`(docs/[A-Za-z0-9_./-]+\.md)`")
for f in md:
    for m in REF.finditer(f.read_text()):
        if not (ROOT / m.group(1)).exists(): err(f"{f.relative_to(ROOT)}: missing referenced doc {m.group(1)}")
# 5 title
for f in md:
    if not f.read_text().lstrip().startswith("#"): err(f"{f.relative_to(ROOT)}: no H1 title")

# ---------------------------------------------------------------- semantic checks
PH = {0:"FOUNDATION",1:"STUDIO",2:"BUILD & ARTIFACT",3:"CONTROL PLANE",4:"BOOKING & COMMERCIAL",
      5:"EXECUTION",6:"LAB & ROBOT",7:"LIVE & RESULTS",8:"PRODUCTION"}
CANON_PH = {f"P{k} {v}" for k, v in PH.items()}
# frozen model: milestone -> (canonical name, phases)
FROZEN = {"F-M01":("STUDIO FOUNDATION",[0,1]),"F-M02":("PROJECTS",[1]),"F-M03":("BUILD & ARTIFACT",[2]),
 "F-M04":("BOOKING",[4]),"F-M05":("EXECUTION",[5]),"F-M06":("LIVE",[7]),"F-M07":("RESULTS",[7]),
 "B-M01":("CONTROL PLANE",[3]),"B-M02":("ARTIFACT",[2,3]),"B-M03":("PLATFORM",[3]),"B-M04":("BOOKING",[4]),
 "B-M05":("EXECUTION",[5]),"B-M06":("RESULTS",[6,7]),"B-M07":("PRODUCTION",[8]),
 "DB-M01":("FOUNDATION",[0,1,2,3]),"DB-M02":("CORE DATA",[3]),"DB-M03":("BOOKING DATA",[4]),"DB-M04":("EXECUTION DATA",[5,6,7]),
 "C-M01":("FOUNDATION",[0]),"C-M02":("DEVELOPMENT",[1,2,3]),"C-M03":("STAGING",[4,5,6,7]),"C-M04":("PRODUCTION",[8])}
MID = r"(?:F-M0[1-7]|B-M0[1-7]|DB-M0[1-4]|C-M0[1-4])"
warnings = []
def warn(m): warnings.append(m)
def rel(f): return f.relative_to(ROOT)
def text(f): return f.read_text()

# 6 canonical phase-to-milestone mapping tables
for name in ("planning/PHASES.md", "planning/IMPLEMENTATION_ROADMAP.md"):
    f = DOCS / name
    seen = {m: set() for m in FROZEN}
    for line in text(f).splitlines():
        m = re.match(r"\| P(\d) ([A-Z& ]+?) \|(.*\|)$", line)
        if not m or "Frontend" in line: continue
        cells = m.group(3).split("|")
        if len(cells) < 5: continue
        for mid in re.findall(MID, m.group(3)):
            seen[mid].add(int(m.group(1)))
    for mid, (_, phases) in FROZEN.items():
        if seen[mid] and seen[mid] != set(phases):
            err(f"{rel(f)}: {mid} mapped to {sorted('P%d'%p for p in seen[mid])}, frozen model is {['P%d'%p for p in phases]}")
        if not seen[mid]:
            err(f"{rel(f)}: {mid} missing from the cross-domain mapping table")

# 7 milestone dossier headers: primary phase must be canonical and match the frozen start phase
for f in DOCS.glob("*/milestones/*/MILESTONE.md"):
    mid = re.match(r"[A-Z]+-M\d\d", f.parent.name).group(0)
    m = re.search(r"\*\*Primary Phase:\*\*\s*(.+?)\s*$", text(f), re.M)
    want = f"P{FROZEN[mid][1][0]} {PH[FROZEN[mid][1][0]]}"
    if not m: err(f"{rel(f)}: missing **Primary Phase:**")
    elif m.group(1) != want: err(f"{rel(f)}: Primary Phase '{m.group(1)}' should be '{want}'")
    if re.search(r"\*\*Priority:\*\*\s*P\d", text(f)): err(f"{rel(f)}: priority uses phase-like notation; use PRI-n")

# 8 milestone-name spelling
LEGACY_NAMES = ["Identity & Project Workspace","Platform Discovery","Build & Artifacts","Local Build & Artifacts",
                "Booking & Credits","Remote Execution","Results & Production UX","UI Foundation","Project Workspace"]
for f in md:
    for line in text(f).splitlines():
        for m in re.finditer(rf"\b({MID}) ((?:[A-Z][A-Z&]+|&)(?: (?:[A-Z][A-Z&]+|&))*)\b", line):
            words = m.group(2)
            if len(words) < 3 or words in ("ID",): continue
            canon = FROZEN[m.group(1)][0]
            if not (words.startswith(canon) or canon.startswith(words)):
                err(f"{rel(f)}: milestone name '{m.group(0)}' should be '{m.group(1)} {canon}'")
        for n in LEGACY_NAMES:
            if re.search(rf"\b{MID} {re.escape(n)}\b", line):
                err(f"{rel(f)}: legacy milestone name '{n}' in: {line.strip()[:80]}")

# 9 phase-label form: "Phase N" must not be used; strict in planning/tracking/milestones
STRICT = [DOCS/"planning", DOCS/"tracking"] + [p for p in DOCS.glob("**/milestones") if p.is_dir()]
for f in md:
    strict = any(s in f.parents for s in STRICT)
    for i, line in enumerate(text(f).splitlines(), 1):
        if re.search(r"\bPhase [0-8]\b(?![–-]\d)", line) and "retired" not in line.lower():
            (err if strict else warn)(f"{rel(f)}:{i}: non-canonical phase label: {line.strip()[:90]}")

# 10 P5 EXECUTION / P6 LAB & ROBOT boundary
P5_DIRS = [DOCS/"frontend/milestones/F-M05-EXECUTION", DOCS/"backend/milestones/B-M05-EXECUTION", DOCS/"milestones/PHASE-5-EXECUTION"]
for d in P5_DIRS:
    for f in d.glob("*.md"):
        t = text(f)
        if re.search(r"(simulated or physical|physical or simulated) (robot|robotic|resource|lab agent)", t, re.I):
            err(f"{rel(f)}: P5 EXECUTION scope must be simulated only (found 'simulated or physical')")
        if f.name == "ACCEPTANCE_CRITERIA.md":
            for line in t.splitlines():
                if line.lstrip().startswith("- [ ]") and re.search(r"physical (robot|lab agent|deployment)|\bHIL\b|hardware", line, re.I) \
                   and not re.search(r"simulat|P6|\bnot\b|\bno\b|never", line, re.I):
                    err(f"{rel(f)}: P5 acceptance item requires physical capability: {line.strip()[:90]}")
for appx in DOCS.glob("*/milestones/*/CHANGELOG.md"):
    t = text(appx)
    m = re.search(r"P5 EXECUTION \|[^\n]*", t)
    if m and re.search(r"physical|HIL", m.group(0)) and "simulat" not in m.group(0).lower():
        err(f"{rel(appx)}: P5 EXECUTION phase-mapping row assigns physical scope")

# 11 risk register phase identifiers and physical-safety ownership
rr = DOCS/"tracking/RISK_REGISTER.md"
for line in text(rr).splitlines():
    m = re.match(r"\| (R-[A-Z]+-\d+) \| ([A-Z]+) \| ([^|]+) \| ([^|]+) \|", line)
    if not m: continue
    phases = [p.strip() for p in m.group(4).split(";")]
    for p in phases:
        if p not in CANON_PH: err(f"{rel(rr)}: {m.group(1)} phase '{p}' is not a canonical identifier")
    physical = re.search(r"physical|emergency|E-stop|unsafe|HIL|hardware|robot operation|motion|safe state", m.group(3), re.I)
    if physical and phases == ["P5 EXECUTION"] and "simulat" not in m.group(3).lower():
        err(f"{rel(rr)}: {m.group(1)} is a physical-safety risk assigned only to P5 EXECUTION; assign P6 LAB & ROBOT or split")

# 12 priority notation must not reuse phase identifiers
for f in md:
    lines = text(f).splitlines()
    for i, line in enumerate(lines):
        if re.match(r"^\| Priority \| P\d \|", line): err(f"{rel(f)}:{i+1}: priority value uses phase-like notation; use PRI-n")
        if re.match(r"^\| Priority \| (Meaning|Definition) \|", line):
            for nxt in lines[i+2:i+9]:
                if re.match(r"^\| `?P\d`? \|", nxt): err(f"{rel(f)}: priority definition '{nxt.strip()[:40]}' uses phase-like notation; use PRI-n")

# 13 MVP is a product-scope concept, never a phase or milestone
for f in (DOCS/"planning").glob("*.md"):
    for i, line in enumerate(text(f).splitlines(), 1):
        if "MVP" in line and "primary product path" not in line.lower() and not re.search(r'"?MVP"? MUST NOT', line):
            err(f"{rel(f)}:{i}: 'MVP' used outside the primary product path definition")


# 14 retired program-stage sequences and canonical phase order in diagrams
for f in md:
    lines = text(f).splitlines()
    for i, line in enumerate(lines, 1):
        if re.match(r"^\s+(Core Platform|Product MVP)\s*$", line, re.I):
            err(f"{rel(f)}:{i}: retired program-stage label in a sequence diagram: '{line.strip()}'; reference PHASES.md / IMPLEMENTATION_ROADMAP.md instead")
    seq = []
    def flush():
        if len(seq) > 1 and seq != sorted(seq):
            err(f"{rel(f)}: phase sequence diagram out of canonical order: {['P%d' % n for n in seq]}")
        seq.clear()
    for line in lines:
        m = re.match(r"^\s+P([0-8]) [A-Z][A-Z &]+\s*$", line)
        if m: seq.append(int(m.group(1)))
        elif re.match(r"^\s*(\||v|->|-->|\+-+.*)?\s*$", line): continue
        else: flush()
    flush()

# 15 priority prose must use PRI-n (strict in planning, tracking, development, deployment and milestones)
PRIO_PROSE = [r"\belevated to P[0-4]\b", r"\bnon-P[0-4]\b", r"\bunresolved P[0-4]\b(?! [A-Z]{3,})", r"\bdefer P[0-4]",
              r"\bP[0-4](/P[0-4])? (?![A-Z]{3,})(issue|issues|defect|defects|blocker|blockers|review target|milestone PR|open|Promotion)\b",
              r"^\| S[0-4] \| P[0-4]"]
STRICT_PRIO = STRICT + [DOCS/"development", DOCS/"cloud/deployment"]
for f in md:
    strict = any(s == f.parent or s in f.parents for s in STRICT_PRIO)
    for i, line in enumerate(text(f).splitlines(), 1):
        if any(re.search(pat, line) for pat in PRIO_PROSE):
            (err if strict else warn)(f"{rel(f)}:{i}: priority uses phase-like notation; use PRI-n: {line.strip()[:80]}")

# 16 MVP must never stand in for a phase, milestone or stage anywhere in docs/
for f in md:
    for i, line in enumerate(text(f).splitlines(), 1):
        if re.search(r"product mvp|\bmvp (phase|milestone|stage)\b|\b(phase|milestone|stage) mvp\b", line, re.I):
            err(f"{rel(f)}:{i}: 'MVP' used as a phase, milestone or stage name: {line.strip()[:80]}")


# 17 coding-agent integration invariants (SYS-ADR-007)
CA_DOC = DOCS/"architecture/CODING_AGENT_INTEGRATION.md"
if not CA_DOC.exists():
    err("docs/architecture/CODING_AGENT_INTEGRATION.md is missing")
if "SYS-ADR-007" not in text(DOCS/"planning/DECISIONS.md"):
    err("docs/planning/DECISIONS.md: SYS-ADR-007 missing from the decision index")
ALLOWED_MCP = {"kritva.project.info","kritva.platform.describe","kritva.build.run","kritva.test.run",
               "kritva.artifact.package","kritva.artifact.validate","kritva.build.logs"}
for f in md:
    for i, line in enumerate(text(f).splitlines(), 1):
        for tool in re.findall(r"`(kritva\.[a-z_]+(?:\.[a-z_]+)+)`", line):
            if tool not in ALLOWED_MCP:
                err(f"{rel(f)}:{i}: undocumented or forbidden Kritva Studio MCP tool `{tool}`")

# 18 task identifiers: KR-CA-* must be unique; other duplicates are reported as one warning
from collections import defaultdict
ids = defaultdict(list)
for f in DOCS.glob("**/TASKS.md"):
    for line in text(f).splitlines():
        m = re.match(r"^\| (KR-[A-Z]+-[0-9A-Z]+-\d{3}) \|", line)
        if m: ids[m.group(1)].append(str(rel(f)))
for tid, where in ids.items():
    if len(where) > 1 and tid.startswith("KR-CA-"):
        err(f"duplicate coding-agent task ID {tid} in {where}")
dups = sorted(t for t, w in ids.items() if len(w) > 1 and not t.startswith("KR-CA-"))
if dups:
    warn(f"task-id: {len(dups)} task IDs are reused across TASKS.md registers (e.g. {', '.join(dups[:3])}); namespace phase-dossier and milestone task IDs")

from collections import Counter
for fname, n in sorted(Counter(w.split(":")[0] for w in warnings if "phase label" in w).items()):
    print(f"WARNING {fname}: {n} bare 'Phase N' label(s); use canonical 'PN NAME' (some sections follow a superseded phase model and need owner review)")
for e in errors: print(e)
for w in warnings:
    if "phase label" not in w: print("WARNING", w)
print(f"{len(md)} docs checked, {len(errors)} problems, {len(warnings)} warnings")
sys.exit(1 if errors else 0)

#!/usr/bin/env python3
"""Documentation consistency checks for docs/.
Checks: retired phase/milestone names, canonical milestone folders, required
standard milestone files, broken relative links and backtick doc references,
document-ID/title presence. Exit code 1 on any failure.
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
for e in errors: print(e)
print(f"{len(md)} docs checked, {len(errors)} problems")
sys.exit(1 if errors else 0)

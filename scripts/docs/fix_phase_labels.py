#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : fix_phase_labels.py
# Description : Normalises milestone dossier phase labels to the frozen canonical model
#
# Component   : Infrastructure
# Module      : Documentation Maintenance
# Layer       : Development Infrastructure
#
# Requirements: N/A — one-off documentation migration (RAAS-005)
# API         : Command-line documentation rewrite
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

"""Normalise phase labels in milestone dossiers to the frozen canonical model."""
import re, pathlib
DOCS = pathlib.Path(__file__).resolve().parents[2] / "docs"
NEW = {0:"FOUNDATION",1:"STUDIO",2:"BUILD & ARTIFACT",3:"CONTROL PLANE",4:"BOOKING & COMMERCIAL",5:"EXECUTION",6:"LAB & ROBOT",7:"LIVE & RESULTS",8:"PRODUCTION"}
OLD = r"(?:FOUNDATION|CORE PLATFORM|PRODUCT MVP|REMOTE EXECUTION|RESOURCE & COMMERCIAL|LAB & ROBOT|SECURITY & PRODUCTION|SCALE & OPERATIONS|PRODUCTION LAUNCH)"
MAP = {  # milestone folder -> (primary, supporting list)
 "F-M01-STUDIO-FOUNDATION":(0,[1]),"F-M02-PROJECTS":(1,[]),"F-M03-BUILD-ARTIFACT":(2,[]),"F-M04-BOOKING":(4,[]),
 "F-M05-EXECUTION":(5,[]),"F-M06-LIVE":(7,[]),"F-M07-RESULTS":(7,[]),
 "B-M01-CONTROL-PLANE":(3,[]),"B-M02-ARTIFACT":(2,[3]),"B-M03-PLATFORM":(3,[]),"B-M04-BOOKING":(4,[]),
 "B-M05-EXECUTION":(5,[]),"B-M06-RESULTS":(6,[7]),"B-M07-PRODUCTION":(8,[]),
 "DB-M01-FOUNDATION":(0,[1,2,3]),"DB-M02-CORE-DATA":(3,[]),"DB-M03-BOOKING-DATA":(4,[]),"DB-M04-EXECUTION-DATA":(5,[6,7]),
 "C-M01-FOUNDATION":(0,[]),"C-M02-DEVELOPMENT":(1,[2,3]),"C-M03-STAGING":(4,[5,6,7]),"C-M04-PRODUCTION":(8,[])}
lab = lambda n: f"P{n} {NEW[n]}"  # canonical form, e.g. "P5 EXECUTION"
changed = 0
for f in DOCS.glob("**/milestones/*/*.md"):
    t = o = f.read_text()
    t = re.sub(rf"Phase (\d) — {OLD}", lambda m: lab(int(m.group(1))), t)
    folder = f.parent.name
    if folder in MAP and f.name == "MILESTONE.md":
        p, s = MAP[folder]
        t = re.sub(r"\*\*Primary Phase:\*\*.*", f"**Primary Phase:** {lab(p)}  ", t, count=1)
        sup = ", ".join(lab(x) for x in s) if s else "None"
        t = re.sub(r"\*\*Supporting Phases:\*\*.*", f"**Supporting Phases:** {sup}  ", t, count=1)
    if t != o: f.write_text(t); changed += 1
print("files changed:", changed)

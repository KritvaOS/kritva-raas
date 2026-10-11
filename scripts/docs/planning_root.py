#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : planning_root.py
# Description : Locates the planning root for the documentation and traceability checkers
#
# Component   : Infrastructure
# Module      : Planning Root Locator
# Layer       : Development Infrastructure
#
# Requirements: N/A — planning alignment migration, step 2 (PB-048)
# API         : Python module used by the documentation checkers
#
# Author      : KritvaOS
# Created     : 11-10-2026
#==============================================================================

"""Single definition of where the planning documents live.

The planning documents were moved from docs/planning/ to a root planning/
directory (planning/PLANNING_MIGRATION_PLAN.md, step 3). The checkers still accept
the legacy location, so the move is easy to revert, and every checker asks this module for the location instead of hard-coding a path.

The planning root is the directory that holds the backend/ planning directory.
Exactly one of the two locations may hold it. If both do, the repository is in
an inconsistent half-moved state and the lookup raises PlanningRootError.
When neither does, the legacy location is returned so that an empty tree behaves
as before.
"""
from pathlib import Path

LEGACY = "docs/planning"
CURRENT = "planning"
MARKER = "backend"


class PlanningRootError(Exception):
    """Both planning locations hold a backend planning directory."""


def planning_rel(root):
    """Return the planning root relative to the repository root, as a POSIX string."""
    root = Path(root)
    at_root = (root / CURRENT / MARKER).is_dir()
    in_docs = (root / LEGACY / MARKER).is_dir()
    if at_root and in_docs:
        raise PlanningRootError(
            f"both {CURRENT}/{MARKER}/ and {LEGACY}/{MARKER}/ exist; "
            "keep one planning root (see planning/PLANNING_MIGRATION_PLAN.md)")
    return CURRENT if at_root else LEGACY


def planning_dir(root):
    """Return the planning root as an absolute path."""
    return Path(root) / planning_rel(root)

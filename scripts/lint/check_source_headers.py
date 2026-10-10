#!/usr/bin/env python3
#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : check_source_headers.py
# Description : Validates standardized KritvaOS source headers for Kritva RaaS
#
# Component   : Infrastructure
# Module      : Source Header Checker
# Layer       : Development Infrastructure
#
# Requirements: HEADER-001
# API         : Command-line source header validation
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

from __future__ import annotations
import argparse
import datetime
import re
import subprocess
from pathlib import Path

REQUIRED_FIELDS = [
    "File", "Description", "Component", "Module", "Layer",
    "Requirements", "API", "Author", "Created"
]

# Ported from kritva-core scripts/lint/check_source_headers.py (HEADER-001).
# RaaS differences: proprietary SPDX identifier, and the RaaS stack's
# TypeScript/JavaScript, Rust and SQL sources are in scope.
LICENSE_ID = "LicenseRef-KritvaOS-Proprietary"
COPYRIGHT = "Copyright (c) 2026 KritvaOS"

SOURCE_EXTENSIONS = {
    ".c", ".cc", ".cpp", ".cxx", ".h", ".hh", ".hpp", ".hxx",
    ".py", ".sh", ".bash", ".v", ".sv", ".svh", ".vh", ".dts", ".dtsi",
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".rs", ".sql"
}

# Controlled vocabularies (docs/development/SOURCE_HEADER_STANDARD.md).
COMPONENTS = {
    "Studio Frontend", "Local Runtime", "Control Plane", "Database",
    "Cloud Infrastructure", "Infrastructure",
}
LAYERS = {
    "Presentation", "Application", "Domain", "API", "Service", "Persistence",
    "Database Schema", "Native Runtime", "Infrastructure",
    "Development Infrastructure",
}

# Leading comment markers accepted in a header block.
COMMENT_PREFIXES = ("#", "//", "--")

EXCLUDED_DIRS = {
    ".git", "build", "out", "third_party", "vendor", "generated", "external",
    "node_modules", "dist", "target", "coverage"
}

EXEMPT_NAMES = {"requirements.txt", "source_header_check.version"}

# Generated or tool-owned file names that cannot carry a header.
EXEMPT_SUFFIXES = (".min.js",)

EXEMPT_DIRS = {
    ".github/agents",
    ".github/instructions",
    "docs/development/templates",
    # Only deliberately malformed fixtures are exempt; the test module itself
    # (tests/source_header_check/test_check_source_headers.py) is checked.
    "tests/source_header_check/fixtures",
}

AUTHOR = "KritvaOS"


def classify(path: Path) -> str:
    s = path.as_posix()

    if any(part in EXCLUDED_DIRS for part in path.parts):
        return "skip"

    if path.name in EXEMPT_NAMES or path.name.endswith(EXEMPT_SUFFIXES):
        return "skip"

    if any(s == d or s.startswith(d + "/") for d in EXEMPT_DIRS):
        return "skip"

    if s == ".githooks/pre-commit":
        return "source"

    if s.startswith(".github/workflows/") and path.suffix in {".yml", ".yaml"}:
        return "source"

    if path.suffix in SOURCE_EXTENSIONS:
        return "source"

    return "skip"


def _header_block(text: str):
    """Return the header lines, which must start on line 1 (or line 2 after a shebang)."""
    lines = text.splitlines()
    index = 1 if lines and lines[0].startswith("#!") else 0

    if index >= len(lines) or not lines[index].lstrip().startswith(COMMENT_PREFIXES):
        return None

    block = []
    while index < len(lines):
        stripped = lines[index].lstrip()
        if not stripped or not stripped.startswith(COMMENT_PREFIXES):
            break
        block.append(stripped)
        index += 1
    return block or None


def _strip_marker(line: str) -> str:
    for prefix in COMMENT_PREFIXES:
        if line.startswith(prefix):
            return line[len(prefix):].strip()
    return line.strip()


def _fields(block: list[str]) -> dict[str, list[str]]:
    """Map each 'Name : value' line in the header to its values (duplicates kept)."""
    found: dict[str, list[str]] = {}
    for raw in block:
        m = re.fullmatch(r"([A-Za-z][A-Za-z-]*)\s*:\s*(.*)", _strip_marker(raw))
        if m:
            found.setdefault(m.group(1), []).append(m.group(2).strip())
    return found


def validate_file(path: Path) -> list[str]:
    if classify(path) != "source":
        return []

    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return [f"{path}: [HEADER-006] malformed/encoding"]

    block = _header_block(text)
    if not block:
        return [f"{path}: [HEADER-008] missing or malformed leading header block"]

    errors = []
    fields = _fields(block)
    contents = [_strip_marker(line) for line in block]

    spdx = fields.get("SPDX-License-Identifier", [])
    if spdx != [LICENSE_ID]:
        errors.append(
            f"{path}: [HEADER-001] SPDX-License-Identifier must appear once with the exact value {LICENSE_ID}"
        )

    copyright_lines = [c for c in contents if c.startswith("Copyright")]
    if copyright_lines != [COPYRIGHT]:
        errors.append(
            f"{path}: [HEADER-003] header must contain exactly one line '{COPYRIGHT}'"
        )

    value = {}
    for field in REQUIRED_FIELDS:
        values = fields.get(field, [])
        if len(values) != 1 or not values[0]:
            reason = "duplicated" if len(values) > 1 else "missing or empty"
            errors.append(f"{path}: [HEADER-004] {reason} required field '{field}'")
            value[field] = ""
        else:
            value[field] = values[0]

    if value["File"] and value["File"] not in (path.name, path.as_posix()):
        errors.append(
            f"{path}: [HEADER-005] File field '{value['File']}' does not match "
            f"the file name or repository-relative path"
        )

    if value["Component"] and value["Component"] not in COMPONENTS:
        errors.append(
            f"{path}: [HEADER-007] Component '{value['Component']}' is not in the approved vocabulary"
        )
    if value["Layer"] and value["Layer"] not in LAYERS:
        errors.append(
            f"{path}: [HEADER-007] Layer '{value['Layer']}' is not in the approved vocabulary"
        )
    if value["Author"] and value["Author"] != AUTHOR:
        errors.append(
            f"{path}: [HEADER-007] Author must be '{AUTHOR}', found '{value['Author']}'"
        )

    created = value["Created"]
    created_ok = bool(re.fullmatch(r"\d{2}-\d{2}-\d{4}", created))
    if created_ok:
        try:
            datetime.datetime.strptime(created, "%d-%m-%Y")
        except ValueError:
            created_ok = False
    if not created_ok:
        errors.append(
            f"{path}: [HEADER-002] missing or invalid 'Created : DD-MM-YYYY'"
        )

    return errors


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files"],
        text=True,
        capture_output=True,
        check=True,
    )
    return [Path(item) for item in result.stdout.splitlines() if item.strip()]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate Kritva RaaS source headers. Without --strict, "
        "violations are reported but the exit status is 0 (report-only); "
        "CI and the pre-commit hook use --strict, which exits 1 on any violation.")
    parser.add_argument("--mode", choices=["tracked", "files"], default="tracked")
    parser.add_argument("--files", nargs="*")
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()

    files = (
        tracked_files()
        if args.mode == "tracked"
        else [Path(item) for item in (args.files or [])]
    )

    checked = 0
    skipped = 0
    errors = []

    for path in files:
        if classify(path) == "source":
            checked += 1
            errors.extend(validate_file(path))
        else:
            skipped += 1

    print(f"[header-check] scanned {len(files)} tracked/file(s)")
    print(f"[header-check] checked {checked} source/config file(s)")
    print(f"[header-check] skipped {skipped} file(s)")

    if errors:
        print("[header-check] FAILED" if args.strict else "[header-check] VIOLATIONS (report-only; use --strict to fail)")
        for error in errors:
            print(f"  {error}")
        return 1 if args.strict else 0

    print("[header-check] PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

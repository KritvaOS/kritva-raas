#!/usr/bin/env python3
"""Split each milestone dossier README.md into the standard milestone file set."""
import re, pathlib, sys
DOCS = pathlib.Path(__file__).resolve().parents[2] / "docs"
SEC = re.compile(r"^#{1,2} (\d{1,2})\.? +[A-Za-z]")
def split(path):
    lines = path.read_text().split("\n")
    idx = []  # (section number, line index)
    expect = 1
    for i, l in enumerate(lines):
        m = SEC.match(l)
        if m and int(m.group(1)) == expect:
            idx.append((expect, i)); expect += 1
    if [n for n, _ in idx] != list(range(1, 12)):
        raise SystemExit(f"{path}: found sections {[n for n,_ in idx]}")
    pre = "\n".join(lines[:idx[0][1]]).rstrip() + "\n"
    sec = {}
    for k, (n, i) in enumerate(idx):
        end = idx[k + 1][1] if k + 1 < len(idx) else len(lines)
        sec[n] = "\n".join(lines[i:end]).rstrip() + "\n"
    return pre, sec
def title_of(pre):
    return pre.split("\n")[0].lstrip("# ").strip()
def main():
    n = 0
    for readme in sorted(DOCS.glob("**/milestones/*/README.md")):
        d = readme.parent; pre, sec = split(readme); title = title_of(pre)
        mid = d.name
        domain = d.parent.parent.name if d.parent.parent != DOCS else "product"
        files = {
          "MILESTONE.md": pre + "\n" + "\n".join(sec[k] for k in (1,2,3,4,9,10)),
          "TASKS.md": f"# {mid} — Tasks\n\nMilestone: {title}\nSource of scope: [MILESTONE.md](MILESTONE.md)\n\n" + sec[5],
          "ACCEPTANCE_CRITERIA.md": f"# {mid} — Acceptance Criteria\n\nMilestone: {title}\n\n" + sec[6],
          "REVIEW_CHECKLIST.md": f"# {mid} — Review Checklist\n\nMilestone: {title}\n\n"
              "## Review Gate\n\nThe milestone may be closed only when every item below is checked by the reviewer, "
              "the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit "
              "criteria in [MILESTONE.md](MILESTONE.md) are satisfied.\n\n"
              "- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).\n"
              "- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).\n"
              "- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.\n"
              "- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).\n"
              "- [ ] Documentation affected by this milestone is updated and the tracking files are current.\n"
              "- [ ] CHANGELOG.md is updated.\n"
              "- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.\n\n"
              + sec[7] + "\n" + sec[8],
          "CHANGELOG.md": f"# {mid} — Changelog\n\nMilestone: {title}\n\n" + sec[11],
          "GIT_COMMIT_STEP.md": f"# {mid} — Git Commit Step\n\nMilestone: {title}\n\n"
              "Performed only after the review gate in [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) is fully signed off.\n\n"
              "## Branch\n\n    milestone/" + mid.lower() + "\n\n"
              "## Commit Message\n\n    milestone(" + mid.lower() + "): close " + title.replace(chr(10), " ") + "\n\n"
              "    - tasks accepted: <list task IDs from TASKS.md>\n"
              "    - acceptance: ACCEPTANCE_CRITERIA.md all met\n"
              "    - review: REVIEW_CHECKLIST.md signed off by <reviewer>\n"
              "    - docs/tracking updated\n\n"
              "## Tag\n\n    git tag -a " + mid.lower() + "-closed -m \"" + mid + " closed\"\n\n"
              "## Steps\n\n1. Confirm the working tree is clean and CI is green.\n"
              "2. Confirm tracking files (MILESTONE_STATUS.md, TASK_STATUS.md, STATUS.md) show this milestone ACCEPTED.\n"
              "3. Commit with the message above.\n4. Create the tag.\n5. Record the commit hash and tag in CHANGELOG.md and tracking/CHANGE_TRACKING.md.\n",
        }
        for name, body in files.items():
            (d / name).write_text(body)
        readme.unlink(); n += 1
    print("split", n, "milestones")
main()

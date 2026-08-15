---
name: planet-git-commit-policy
description: Apply this repository's Git commit policy. Use when Codex is asked to prepare, review, write, amend, or validate commit messages; split or stage changes for commits; summarize staged changes; or decide whether a local diff is commit-ready.
---

# Git Commit Policy

Use this skill to keep commits small, reviewable, and traceable. Prefer the existing repository conventions when they are discoverable; otherwise apply the policy below.

## Commit Readiness

Before writing or approving a commit message:

1. Inspect `git status --short --branch`.
2. Inspect the staged diff with `git diff --cached --stat` and `git diff --cached`.
3. If nothing is staged, inspect `git diff --stat` and ask before staging unless the user explicitly requested staging.
4. Do not include unrelated user changes. If the working tree contains unrelated modifications, mention them and leave them out.
5. Run the narrowest useful validation for the touched area when feasible. If validation is skipped, state why.

## Commit Scope

Create one commit per coherent change:

- Keep formatting-only changes separate from behavior changes unless the formatter touched only edited lines.
- Keep generated assets, dependency lockfile changes, and source edits in the same commit only when they are causally linked.
- Split unrelated fixes even if they were discovered during the same task.
- Do not commit secrets, local machine paths, debug artifacts, logs, screenshots, or temporary files unless explicitly intended.

## Message Format

Use Conventional Commit style unless the repository has a different visible convention:

```text
type(scope): imperative summary

Optional body explaining why, notable tradeoffs, and validation.
```

Allowed `type` values:

- `feat`: user-visible feature or capability
- `fix`: bug fix
- `docs`: documentation-only change
- `style`: formatting or cosmetic change without behavior change
- `refactor`: code restructuring without intended behavior change
- `perf`: performance improvement
- `test`: tests only or test infrastructure
- `build`: build system, dependency, or packaging change
- `ci`: CI configuration or automation
- `chore`: maintenance that does not fit the above
- `revert`: revert a previous commit

Use a short lowercase `scope` when it clarifies the affected area, such as `ui`, `runtime`, `assets`, `docs`, `tests`, `deps`, or a package/module name. Omit scope when it would be vague.

## Summary Rules

- Write the summary in imperative mood: `fix orbit controls`, not `fixed orbit controls`.
- Keep the summary under 72 characters when practical.
- Do not end the summary with a period.
- Describe the actual change, not the task process.
- Avoid generic summaries like `update files`, `misc fixes`, or `work in progress`.

## Body Rules

Add a body when the reason, risk, migration path, or validation matters. Keep it concise:

```text
Why:
- Explain the user-facing or maintenance reason.

Validation:
- npm test
- Manual check: opened the scene and verified planet labels render
```

Use `BREAKING CHANGE:` in the body or footer when behavior or API compatibility is intentionally broken.

## Final Response

When reporting a prepared commit message to the user, include:

- the exact commit message
- the files or change areas it covers
- validation run or explicitly skipped
- any unstaged or unrelated changes left out

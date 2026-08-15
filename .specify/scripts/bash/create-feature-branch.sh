#!/usr/bin/env bash
# create-feature-branch.sh
#
# Creates the git branch for a new feature, enforcing:
#   New feature branches MUST be created from the single main branch
#   (auto-detected as "main" or "master"). Branching directly from another
#   "###-feature-name" branch is only permitted when the new feature is
#   explicitly declared as related to that feature (--related-feature).
#
# This is invoked by the speckit-branch-create hook (before_specify) and
# delegates branch-name/number computation to create-new-feature.sh so the
# naming rules stay in one place.

set -e

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

JSON_MODE=false
RELATED_FEATURE=""
PASSTHROUGH_ARGS=()

i=1
while [ $i -le $# ]; do
    arg="${!i}"
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --related-feature)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --related-feature requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            RELATED_FEATURE="${!i}"
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--related-feature <feature-id>] [--short-name <name>] [--number N] [--timestamp] <feature_description>"
            echo ""
            echo "Creates a git branch for a new feature. Refuses to branch from another"
            echo "###-feature-name branch unless --related-feature matches the branch"
            echo "currently checked out, in which case the new feature is treated as a"
            echo "follow-up of that spec and is branched from it instead of the main branch."
            echo ""
            echo "The main branch is auto-detected (origin/HEAD, else local 'main', else"
            echo "local 'master'). Override with SPECIFY_BASE_BRANCH=<name>."
            exit 0
            ;;
        *)
            PASSTHROUGH_ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

REPO_ROOT=$(get_repo_root) || exit 1
cd "$REPO_ROOT"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || {
    echo "Error: not inside a git repository, or the repository has no commits yet." >&2
    exit 1
}

# Single main branch, auto-detected in this priority order:
#   1. SPECIFY_BASE_BRANCH env var (explicit override)
#   2. origin/HEAD's target (the remote's default branch)
#   3. local "main"
#   4. local "master"
detect_main_branch() {
    if [ -n "${SPECIFY_BASE_BRANCH:-}" ]; then
        printf '%s' "$SPECIFY_BASE_BRANCH"
        return 0
    fi
    local remote_head
    if remote_head=$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null); then
        printf '%s' "${remote_head#origin/}"
        return 0
    fi
    if git show-ref --verify --quiet refs/heads/main; then
        printf 'main'
        return 0
    fi
    if git show-ref --verify --quiet refs/heads/master; then
        printf 'master'
        return 0
    fi
    return 1
}

MAIN_BRANCH=$(detect_main_branch) || {
    echo "Error: could not auto-detect the main branch (no origin/HEAD, no local 'main' or 'master')." >&2
    echo "Set SPECIFY_BASE_BRANCH=<name> to specify it explicitly." >&2
    exit 1
}

related_matches_current() {
    local related="$1" current="$2"
    [ -z "$related" ] && return 1
    [ "$current" = "$related" ] && return 0
    case "$current" in
        "$related"-*) return 0 ;;
    esac
    return 1
}

BASE_BRANCH=""

if [ "$CURRENT_BRANCH" = "$MAIN_BRANCH" ]; then
    BASE_BRANCH="$CURRENT_BRANCH"
elif related_matches_current "$RELATED_FEATURE" "$CURRENT_BRANCH"; then
    # Explicit exception: the new feature is declared related to the spec
    # whose branch is currently checked out.
    BASE_BRANCH="$CURRENT_BRANCH"
else
    {
        echo "Error: refusing to create a new feature branch from '$CURRENT_BRANCH'."
        echo "New feature branches must be created from the main branch ('$MAIN_BRANCH')."
        if [ -n "$RELATED_FEATURE" ]; then
            echo "The provided --related-feature '$RELATED_FEATURE' does not match the current branch."
        else
            echo "If this feature is a follow-up directly related to the '$CURRENT_BRANCH' spec, rerun with:"
            echo "  --related-feature $CURRENT_BRANCH"
        fi
        echo "Otherwise switch to the main branch first, e.g.: git checkout $MAIN_BRANCH"
    } >&2
    exit 1
fi

# Keep the base branch up to date when a remote tracking branch exists (best
# effort — never fail branch creation just because we are offline or there is
# no upstream configured).
if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
    git pull --ff-only || echo "Warning: could not fast-forward '$BASE_BRANCH'; continuing with local state." >&2
fi

# Reuse create-new-feature.sh (dry-run) to compute the branch name/number
# without creating the specs/ directory — /speckit-specify creates that itself.
FEATURE_INFO=$("$SCRIPT_DIR/create-new-feature.sh" --json --dry-run "${PASSTHROUGH_ARGS[@]}")

BRANCH_NAME=$(printf '%s' "$FEATURE_INFO" | sed -E 's/.*"BRANCH_NAME":"([^"]*)".*/\1/')
FEATURE_NUM=$(printf '%s' "$FEATURE_INFO" | sed -E 's/.*"FEATURE_NUM":"([^"]*)".*/\1/')

if [ -z "$BRANCH_NAME" ]; then
    echo "Error: could not determine branch name from create-new-feature.sh output." >&2
    exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo "Error: branch '$BRANCH_NAME' already exists." >&2
    exit 1
fi

git checkout -b "$BRANCH_NAME" "$BASE_BRANCH"

if $JSON_MODE; then
    printf '{"BRANCH_NAME":"%s","FEATURE_NUM":"%s","BASE_BRANCH":"%s"}\n' "$BRANCH_NAME" "$FEATURE_NUM" "$BASE_BRANCH"
else
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "FEATURE_NUM: $FEATURE_NUM"
    echo "BASE_BRANCH: $BASE_BRANCH"
fi

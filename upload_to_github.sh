#!/usr/bin/env zsh
set -euo pipefail

# upload_to_github.sh
# Safely upload the current project to GitHub, optionally creating the repo.
# Prefer `gh` if available (safer, avoids embedding tokens). Falls back to
# GitHub API using $GITHUB_TOKEN when `gh` is not installed.
#
# Usage:
#   ./upload_to_github.sh [repo-name] [--private] [-y]
# Examples:
#   ./upload_to_github.sh
#   ./upload_to_github.sh MyRepo --private -y
#
# WARNING: This script will force-push your local tree to the remote `main` branch
# and will overwrite remote contents. Back up the remote repository first.

DEFAULT_REPO="MRCREAMS-ModernRelationshipConflictResolutionEmotionAnalysisManagementSystem"
# Parse optional owner/repo or --owner OWNER
OWNER=""
if [[ "${1-}" == --owner ]]; then
  OWNER="$2"
  shift 2 || true
fi
if [[ "${1-}" == */* ]]; then
  OWNER="${1%%/*}"
  REPO_NAME="${1##*/}"
  shift || true
else
  REPO_NAME="${1:-$DEFAULT_REPO}"
  shift 1 || true
fi
IS_PRIVATE=false
ASSUME_YES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --private) IS_PRIVATE=true; shift ;;
    -y|--yes) ASSUME_YES=true; shift ;;
    --owner)
      OWNER="$2"
      shift 2 || true
      ;;
    --) shift; break ;;
    *)
      # Any unknown positional argument will be treated as 'skip confirmation'
      ASSUME_YES=true
      shift
      ;;
  esac
done

if [ -n "$OWNER" ]; then
  echo "Target repo: $OWNER/$REPO_NAME"
else
  echo "Target repo: $REPO_NAME"
fi

confirm() {
  if [ "$ASSUME_YES" = true ]; then
    return 0
  fi
  echo "THIS WILL FORCE-REPLACE the contents of the remote repository '"$REPO_NAME"' (remote main branch)."
  read -r "-p?Proceed and overwrite remote contents? (type 'yes' to continue): " RESP
  if [ "$RESP" != "yes" ]; then
    echo "Aborted by user." >&2
    exit 1
  fi
}

ensure_git_repo() {
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Initializing a new git repository."
    git init
  fi
  git add -A
  if git diff --cached --quiet && git rev-parse --verify --quiet HEAD >/dev/null 2>&1; then
    echo "No changes to commit."
  else
    git commit -m "Upload project snapshot" || true
  fi
  # ensure main branch
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "HEAD")
  if [ "$BRANCH" = "HEAD" ]; then
    git checkout -B main
  fi
}

use_gh_cli() {
  if ! command -v gh >/dev/null 2>&1; then
    return 1
  fi
  # Verify gh auth
  if ! gh auth status >/dev/null 2>&1; then
    return 1
  fi
  return 0
}

confirm
ensure_git_repo

if use_gh_cli; then
  echo "Using GitHub CLI (gh) to create/update repo."
    USERNAME=$(gh api user --jq .login 2>/dev/null)
    echo "Authenticated as: $USERNAME"

    # Try to create repo under the authenticated account (omit explicit owner).
    CREATE_FLAGS=("--source=." "--remote=origin" "--push")
    if [ -n "$OWNER" ]; then
      TARGET="$OWNER/$REPO_NAME"
    else
      TARGET="$REPO_NAME"
    fi

    # Some gh versions deprecate --confirm. To answer the interactive prompt non-interactively
    # pipe a 'y' into gh. This avoids passing an extra positional arg which gh rejects.
      if printf 'y\n' | gh repo create "$TARGET" "${CREATE_FLAGS[@]}" 2>/dev/null; then
      echo "Repository created and pushed via gh (under user: $USERNAME)."
    else
      echo "Repository may already exist or gh returned non-zero. Setting remote and force-pushing."
      git remote remove origin 2>/dev/null || true
      if [ -n "$OWNER" ]; then
        REMOTE_URL="https://github.com/$OWNER/$REPO_NAME.git"
      else
        REMOTE_URL="https://github.com/$USERNAME/$REPO_NAME.git"
      fi
      git remote add origin "$REMOTE_URL" 2>/dev/null || git remote set-url origin "$REMOTE_URL"
      echo "Force-pushing to $REMOTE_URL (main)"
      if ! git push --force origin HEAD:main; then
        echo "Failed to push to $REMOTE_URL. Possible causes:"
        echo "- You are authenticated as '$USERNAME' but the repository exists under a different account (e.g. 'CappieX')." >&2
        echo "- You don't have permission to push to that repository." >&2
        echo "Run 'gh auth status' and 'gh api user --jq .login' to confirm your active account." >&2
        echo "If you intend to push to a different account (like 'CappieX'), re-authenticate with 'gh auth login' as that user, or supply a token fallback." >&2
        exit 1
      fi
    fi

  echo "Done. Verify at: https://github.com/$USERNAME/$REPO_NAME"
  exit 0
fi

echo "gh CLI not available or not authenticated. Falling back to GitHub API with GITHUB_TOKEN."
if [ -z "${GITHUB_TOKEN-}" ]; then
  echo "Error: GITHUB_TOKEN environment variable is required when 'gh' is not available." >&2
  echo "Create a token with 'repo' scope and export it: export GITHUB_TOKEN=ghp_xxx" >&2
  exit 1
fi

# Get username from token
USER_JSON=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user)
USERNAME=$(python3 - <<'PY'
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('login',''))
except Exception:
    print('')
PY
<<EOF
$USER_JSON
EOF
)

if [ -z "$USERNAME" ]; then
  echo "Failed to resolve username from token. Aborting." >&2
  exit 1
fi
echo "Token authenticated as: $USERNAME"

# Create repo
CREATE_PAYLOAD=$(jq -n --arg name "$REPO_NAME" --argjson priv $IS_PRIVATE '{name:$name,private:$priv}')
# Choose create URL: user repos or org repos if OWNER set (and different from token user)
if [ -n "$OWNER" ] && [ "$OWNER" != "$USERNAME" ]; then
  CREATE_URL="https://api.github.com/orgs/$OWNER/repos"
else
  CREATE_URL="https://api.github.com/user/repos"
fi
HTTP_STATUS=$(curl -s -o /tmp/gh_create_resp.json -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD" \
  "$CREATE_URL")

# Handle responses
if [ "$HTTP_STATUS" = "201" ]; then
  echo "Repository created on GitHub."
elif [ "$HTTP_STATUS" = "422" ]; then
  echo "Repository already exists; will replace contents by force-pushing."
elif [ "$HTTP_STATUS" = "403" ]; then
  echo "Permission denied creating repo (HTTP 403). Check token scopes and whether you can create repos under '$OWNER' or organization settings." >&2
  cat /tmp/gh_create_resp.json >&2
  exit 1
else
  echo "Unexpected response creating repo (HTTP $HTTP_STATUS). See /tmp/gh_create_resp.json" >&2
  cat /tmp/gh_create_resp.json >&2
  exit 1
fi

# Force-push using token URL (non-interactive). We remove token from config afterwards.
if [ -n "$OWNER" ]; then
  PUSH_OWNER="$OWNER"
else
  PUSH_OWNER="$USERNAME"
fi
REMOTE_URL="https://$GITHUB_TOKEN@github.com/$PUSH_OWNER/$REPO_NAME.git"
echo "Force-pushing to $PUSH_OWNER/$REPO_NAME (main) using token-based remote..."
git push --force "$REMOTE_URL" HEAD:main

echo "Cleaning up remote to avoid leaving token in git config."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$PUSH_OWNER/$REPO_NAME.git" || git remote set-url origin "https://github.com/$PUSH_OWNER/$REPO_NAME.git"

echo "Upload complete. Verify at: https://github.com/$PUSH_OWNER/$REPO_NAME"

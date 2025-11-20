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
REPO_NAME="${1:-$DEFAULT_REPO}"
shift 1 || true
IS_PRIVATE=false
ASSUME_YES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --private) IS_PRIVATE=true; shift ;;
    -y|--yes) ASSUME_YES=true; shift ;;
    --) shift; break ;;
    *)
      # Any unknown positional argument will be treated as 'skip confirmation'
      ASSUME_YES=true
      shift
      ;;
  esac
done

echo "Target repo: $REPO_NAME"

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

  # Try to create repo; if it exists, create will fail, so continue to push
  # Newer gh versions may deprecate `--confirm`. Passing a dummy positional
  # argument (e.g. 'y') skips the interactive prompt; keep flags for source/remote/push.
  CREATE_FLAGS=("--source=." "--remote=origin" "--push")
  if [ "$IS_PRIVATE" = true ]; then
    CREATE_FLAGS+=("--private")
  else
    CREATE_FLAGS+=("--public")
  fi

  # Attempt to create the repo non-interactively. If it fails (e.g. already exists)
  # gh will return non-zero; we then set the remote and force-push.
  if gh repo create "$USERNAME/$REPO_NAME" "${CREATE_FLAGS[@]}" y; then
    echo "Repository created and pushed via gh."
  else
    echo "Repository may already exist (or gh returned non-zero). Setting remote and force-pushing."
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git" 2>/dev/null || git remote set-url origin "https://github.com/$USERNAME/$REPO_NAME.git"
    echo "Force-pushing to https://github.com/$USERNAME/$REPO_NAME.git (main)"
    git push --force origin HEAD:main
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
HTTP_STATUS=$(curl -s -o /tmp/gh_create_resp.json -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD" \
  "https://api.github.com/user/repos")

if [ "$HTTP_STATUS" = "201" ]; then
  echo "Repository created on GitHub."
elif [ "$HTTP_STATUS" = "422" ]; then
  echo "Repository already exists; will replace contents by force-pushing."
else
  echo "Unexpected response creating repo (HTTP $HTTP_STATUS). See /tmp/gh_create_resp.json" >&2
  cat /tmp/gh_create_resp.json >&2
  exit 1
fi

# Force-push using token URL (non-interactive). We remove token from config afterwards.
REMOTE_URL="https://$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git"
echo "Force-pushing to $USERNAME/$REPO_NAME (main) using token-based remote..."
git push --force "$REMOTE_URL" HEAD:main

echo "Cleaning up remote to avoid leaving token in git config."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git" || git remote set-url origin "https://github.com/$USERNAME/$REPO_NAME.git"

echo "Upload complete. Verify at: https://github.com/$USERNAME/$REPO_NAME"

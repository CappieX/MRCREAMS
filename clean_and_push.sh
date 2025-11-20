#!/usr/bin/env zsh
set -euo pipefail

# clean_and_push.sh
# Safely clean large files (node_modules, blobs >100MB) from git history and
# push the cleaned history to the remote repository as a mirror.
#
# Usage:
#   ./clean_and_push.sh [remote-url]
# If remote-url is omitted the script will try to read `remote.origin.url`
# from the current working repo.
#
# WARNING: This rewrites history and force-pushes. Make a backup before running.

REPO_ROOT=$(pwd)
REMOTE_ARG=${1-}

echo "Repository root: $REPO_ROOT"

if [ -n "$REMOTE_ARG" ]; then
  REMOTE_URL="$REMOTE_ARG"
else
  # try to read existing origin from current repo
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    REMOTE_URL=$(git config --get remote.origin.url || true)
  fi
fi

if [ -z "$REMOTE_URL" ]; then
  echo "No remote URL provided and no origin remote found. Pass remote as first arg." >&2
  echo "Example: ./clean_and_push.sh https://github.com/CappieX/MRCREAMS.git" >&2
  exit 1
fi

echo "Target remote URL: $REMOTE_URL"

read -r "-p?This will rewrite history and force-push to the remote. Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted by user." >&2
  exit 1
fi

# Backup working copy
BACKUP_DIR="${REPO_ROOT}-backup-$(date +%Y%m%d%H%M%S)"
echo "Creating local backup at: $BACKUP_DIR"
cp -a "$REPO_ROOT" "$BACKUP_DIR"

echo "Checking for git-filter-repo..."
if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo is required but not installed." >&2
  echo "Install with Homebrew: brew install git-filter-repo" >&2
  echo "Or via pip: python3 -m pip install --user git-filter-repo" >&2
  exit 1
fi

# Create a bare mirror clone to operate safely
MIRROR_DIR="${REPO_ROOT}-mirror.git"
echo "Creating mirror clone at: $MIRROR_DIR"
git clone --mirror "$REPO_ROOT" "$MIRROR_DIR"
cd "$MIRROR_DIR"

echo "Removing frontend/node_modules and stripping blobs >100MB..."
# Run filter-repo once to remove path and strip big blobs
git filter-repo --invert-paths --path frontend/node_modules --strip-blobs-bigger-than 100M || true

echo "Verifying large blobs removed (top objects)"
if ls objects/pack/*.idx >/dev/null 2>&1; then
  git verify-pack -v objects/pack/*.idx | sort -k3 -n -r | head -n 20 || true
fi

echo "Setting remote to target and pushing mirror (force)..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"
git push --force --mirror origin

echo "Mirror push complete. Cleaning local mirror clone..."
cd "$REPO_ROOT"
rm -rf "$MIRROR_DIR"

echo "Now reset your working copy to match remote. In your working repo run:" 
echo "  git fetch origin" 
echo "  git reset --hard origin/main || git reset --hard origin/master" 
echo "  git reflog expire --expire=now --all && git gc --prune=now --aggressive"

echo "Done. Verify the remote repository on GitHub: $REMOTE_URL"

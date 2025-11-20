UPLOAD_VERIFICATION.md

Purpose
- Quick verification and troubleshooting guide for `upload_to_github.sh` and the `gh`/token upload flows.

Quick checks before running
- Confirm your working directory is the project root (where `upload_to_github.sh` is).
- Ensure `git` is installed and available.
- Recommended: install and authenticate `gh` (GitHub CLI): `gh auth login`.
- If not using `gh`, export a token with `repo` scope: `export GITHUB_TOKEN="ghp_..."`.
- Ensure `jq` and `python3` are installed (script uses `jq` to build JSON and `python3` to parse user info).
  - macOS install: `brew install gh jq python`.

Common run commands
- Use `gh` (recommended):
```bash
chmod +x ./upload_to_github.sh
# optional: pass owner/repo or --owner OWNER
./upload_to_github.sh CappieX/MRCREAMS-ModernRelationshipConflictResolutionEmotionAnalysisManagementSystem -y
# or
./upload_to_github.sh --owner CappieX -y
```
- Use token fallback:
```bash
export GITHUB_TOKEN="ghp_...token-for-CappieX..."
./upload_to_github.sh CappieX/MRCREAMS-ModernRelationshipConflictResolutionEmotionAnalysisManagementSystem -y
```

Common errors and fixes
- "Flag --confirm has been deprecated":
  - Newer `gh` versions accept a confirmation via stdin; the script pipes a `y` into `gh` to skip interactive confirmation.

- "GraphQL: Name already exists on this account (createRepository)":
  - The repository already exists under the account you tried to create it in. Use `--owner OWNER` or `owner/repo` form to target the correct owner, or re-authenticate `gh` as the intended user.
  - Example: `./upload_to_github.sh CappieX/MRCREAMS-ModernRelationshipConflictResolutionEmotionAnalysisManagementSystem -y`.

- "remote: Repository not found" or "fatal: repository 'https://github.com/USERNAME/REPO.git/' not found":
  - Usually caused by a mismatch between the `gh` authenticated user (or token owner) and the repository owner.
  - Verify active account: `gh auth status` and `gh api user --jq .login`.
  - If the repository lives under `CappieX`, ensure `gh` is authenticated as `CappieX` or export a `GITHUB_TOKEN` for `CappieX`.

- "accepts at most 1 arg(s), received 2":
  - Occurs if an extra positional argument was incorrectly passed to `gh repo create`. The script avoids this now by piping `y` into `gh` instead of passing a second arg.

- Permission errors creating a repo under an organization:
  - Creating a repo under an org requires appropriate permissions. If you see HTTP 403 when creating under `orgs/ORG/repos`, ensure your token/user has the `admin:org` or repo creation rights.

Verification commands after running
- Confirm remote and latest commit:
```bash
git remote -v
git log -1 --pretty=oneline
```
- Confirm remote on GitHub web:
  - Visit `https://github.com/OWNER/REPO` in your browser (replace `OWNER` and `REPO`).

Security notes
- Avoid embedding tokens in shell history. Prefer `gh` auth or export `GITHUB_TOKEN` for the session only.
- The script temporarily uses a token-embedded remote for non-interactive pushing when using token fallback; it removes the token-containing remote and replaces it with a token-free `https://github.com/OWNER/REPO.git` remote after the push.
- Back up the remote repository (or any important branches) before force-pushing since this operation is destructive.

If you still see an error, copy the exact terminal output and I'll suggest the next corrective step.

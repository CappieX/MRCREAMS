Final push & Vercel deployment instructions

This file describes the exact commands and verification steps to:
- Clean and force-push a cleaned mirror of this repository to GitHub (removing large blobs).
- Link the repository to Vercel and set required environment variables.

Important: I cannot push to your remote or link Vercel on your behalf. Run the commands below locally in your shell.

1) Verify you have the cleanup script and `git-filter-repo` available

- The repo includes `clean_and_push.sh` at the project root. Read it before running.
- On macOS you can install `git-filter-repo` via Homebrew: `brew install git-filter-repo`.

2) Run the cleanup + mirror push (example)

Replace `<REMOTE>` with your remote (SSH or HTTPS), e.g. `git@github.com:CappieX/MRCREAMS.git` or `https://github.com/CappieX/MRCREAMS.git`.

```bash
# Make the script executable (if not already)
chmod +x ./clean_and_push.sh

# Run the script (this rewrites local history and force-pushes). Confirm the script output.
./clean_and_push.sh <REMOTE>
```

Notes:
- This script rewrites history (force push). Verify you have a backup if needed.
- If `git-filter-repo` is not available, the script will prompt how to install it.

3) Verify the remote push succeeded

```bash
# Clone the freshly pushed mirror into a temporary folder to confirm size and presence
git clone --mirror <REMOTE> /tmp/mrcreams-mirror
# Or a normal clone for a quick sanity check
git clone <REMOTE> /tmp/mrcreams-clone
cd /tmp/mrcreams-clone
# Confirm no large files exist in node_modules/.cache or .git/objects
find . -type f -size +50M
# Confirm frontend build file sizes (optional, in your repo's frontend folder)
ls -lh frontend/build/static/js
```

Also check on GitHub web UI: the repo should appear and pushes should not be rejected.

4) Vercel: connect and configure

- Log in to Vercel.com and create a new Project -> Import Git Repository.
- When Vercel asks, choose the cleaned GitHub repo (the one you just pushed).
- For a CRA frontend inside a monorepo, set the following build settings (Vercel UI):
  - Framework Preset: `Create React App` (or leave autodetect)
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `frontend/build` (Vercel may detect `build` automatically)

5) Environment Variables

If your frontend fetches the backend via `process.env.REACT_APP_API_BASE` (recommended), set this env var in Vercel:

- Key: `REACT_APP_API_BASE`
- Value: the public base URL of your backend API (for example `https://api.yourdomain.com` or `https://<your-backend-host>`)
- Set this variable for both `Preview` and `Production` (or as appropriate).

6) Trigger a deploy

- After linking the repo and setting env vars, Vercel will build automatically on push. You can also trigger a manual deployment from the Vercel dashboard.
- If using the Vercel CLI, you can run:

```bash
# from repo root or frontend folder when ready
vercel --prod
```

7) Quick local checks (optional)

- You already built the frontend locally. To preview it with a simple static server:

```bash
cd frontend
npm install -g serve   # one-time install
serve -s build -l 3000  # serve locally at http://localhost:3000
```

8) Troubleshooting notes

- If GitHub still rejects the push, re-run `./clean_and_push.sh` and inspect the script output for any pack files mentioned. Consider using `git-filter-repo` manually to remove specific paths.
- If Jest tests fail locally due to ESM packages (like `axios`), we refactored `Dashboard` to use a runtime import and accept an injectable `fetcher` for tests; tests should pass with `CI=true npm test -- --watchAll=false`.

9) What I can do next (if you want)

- Walk you through running `./clean_and_push.sh` interactively on your machine.
- Help configure the Vercel project in your Vercel account (I'll provide exact UI clicks and required values).
- Add a small GitHub Actions workflow to run tests and build on push.

---
If you want, tell me the `<REMOTE>` URL and I will validate the exact `clean_and_push.sh` command and any repo-specific adjustments to the script content before you run it locally.
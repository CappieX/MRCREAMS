#!/usr/bin/env zsh
set -euo pipefail

# deploy_to_vercel.sh
# Helper to deploy the frontend to Vercel using the Vercel CLI and an access token.
# Usage:
#   VERCEL_TOKEN=xxxx ./deploy_to_vercel.sh [--prod]

CMD="vercel"
if [ "${1-}" = "--prod" ]; then
  CMD="vercel --prod --confirm"
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install it with: npm i -g vercel" >&2
  exit 1
fi

if [ -z "${VERCEL_TOKEN-}" ]; then
  echo "Please set VERCEL_TOKEN environment variable with a Vercel Personal Token." >&2
  echo "Example: export VERCEL_TOKEN=\"<token>\"" >&2
  exit 1
fi

echo "Deploying frontend to Vercel (root: frontend)"
pushd frontend >/dev/null
echo "Running: $CMD"
VERCEL_TOKEN="$VERCEL_TOKEN" $CMD
popd >/dev/null

echo "Deployment command finished. Check Vercel dashboard for status."

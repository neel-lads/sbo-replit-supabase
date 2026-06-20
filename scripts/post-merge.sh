#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Push to GitHub automatically on every merge
if [ -n "$GITHUB_TOKEN" ]; then
  GITHUB_REMOTE="https://neel-lads:${GITHUB_TOKEN}@github.com/neel-lads/sbo-replit-supabase.git"
  if git remote get-url github >/dev/null 2>&1; then
    git remote set-url github "$GITHUB_REMOTE"
  else
    git remote add github "$GITHUB_REMOTE"
  fi
  git push github HEAD:main --force-with-lease || git push github HEAD:main
else
  echo "WARNING: GITHUB_TOKEN is not set — skipping GitHub push"
fi

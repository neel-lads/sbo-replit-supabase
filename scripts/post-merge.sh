#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Push to GitHub automatically on every merge
if [ -n "$GITHUB_TOKEN" ]; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Skipping GitHub push: current branch is '$CURRENT_BRANCH', not 'main'"
  else
    GITHUB_REMOTE="https://neel-lads:${GITHUB_TOKEN}@github.com/neel-lads/sbo-replit-supabase.git"
    if git remote get-url github >/dev/null 2>&1; then
      git remote set-url github "$GITHUB_REMOTE"
    else
      git remote add github "$GITHUB_REMOTE"
    fi

    # Pull remote changes first so we don't get rejected on non-fast-forward
    git pull --rebase github main || echo "WARNING: git pull --rebase failed, skipping push"

    echo "Pushing to GitHub (neel-lads/sbo-replit-supabase)..."
    if ! git push github HEAD:main --force-with-lease 2>&1; then
      echo ""
      echo "============================================================"
      echo "ERROR: GitHub sync FAILED — this merge was NOT pushed to GitHub."
      echo "Cause: git push to neel-lads/sbo-replit-supabase returned non-zero."
      echo "Common causes: expired token, branch protection, network error."
      echo "Fix: check GITHUB_TOKEN and retry the merge, or push manually:"
      echo "  git push https://neel-lads:<token>@github.com/neel-lads/sbo-replit-supabase.git main"
      echo "============================================================"
      echo ""
      exit 1
    fi

    echo "GitHub sync succeeded."
  fi
else
  echo "WARNING: GITHUB_TOKEN is not set — skipping GitHub push"
fi

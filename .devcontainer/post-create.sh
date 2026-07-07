#!/usr/bin/env bash
set -euo pipefail

echo "==> Trusting workspace for git (bind-mounted volumes can be owned by a different uid)"
git config --global --add safe.directory "${containerWorkspaceFolder:-$(pwd)}"

echo "==> Installing npm dependencies (npm ci)"
npm ci

echo "==> Installing Playwright browser (chromium, with OS dependencies)"
npx playwright install --with-deps chromium

echo "==> Installing Chrome for Testing (used by the Playwright MCP server)"
npx @playwright/mcp install-browser chrome-for-testing

echo "==> Installing Claude Code CLI"
npm install -g @anthropic-ai/claude-code

if [ ! -f .env ] && [ -f .env.example ]; then
	echo "==> Seeding .env from .env.example (fill in secrets before running npm run publish:standard)"
	cp .env.example .env
fi

echo "==> Checking GitHub CLI auth status"
gh auth status || echo "    Not logged in yet — run 'gh auth login' to enable 'gh' commands."

echo "==> Done. Run 'npm start' to launch the dev server on http://localhost:8080"

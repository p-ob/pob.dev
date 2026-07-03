# CLAUDE.md

pob.dev is a statically generated personal blog: Eleventy (templates/content) + Lit (SSR web components) + PageFind (client-side search), deployed to Cloudflare Workers. Node.js 22+ required. Exact dependency versions live in `package.json` — do not trust version numbers written in prose anywhere.

## Rules

1. Read a file before editing it. Follow the patterns already in the file you are changing.
2. Indent with tabs (width 2). Always use braces, even for single-line `if` statements. Prettier enforces formatting — run `npm run format` after editing and `npm run lint` before committing.
3. Never edit anything in `public/` — it is generated build output and git-ignored.
4. Pushing to `main` deploys to production via GitHub Actions, so verify changes before committing.
5. Use commit prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
6. When you change or add a custom plugin in `11ty/`, update or add its unit test in `tests/unit/`.
7. Do not add bundlers, frameworks, or new runtime dependencies without being asked. This site deliberately uses plain web platform features (ES modules, import maps, CSS layers).

## Commands

```bash
npm start              # Dev server, hot reload, drafts visible (localhost:8080)
npm run build          # Production build: Eleventy then PageFind index → public/
npm run build:11ty     # Eleventy only (faster; skips search index)
npm run build:index    # PageFind search index only (requires prior build:11ty)
npm run test:unit      # Node test runner unit tests (tests/unit/)
npm test               # Playwright e2e tests (tests/e2e/; starts dev server itself)
npm run lint           # Prettier check
npm run format         # Prettier write
npm run clean          # Delete build artifacts (keeps .env)
npm run dev            # Serve public/ via local Cloudflare Workers (localhost:8787; run build first)
npm run deploy         # Manual deploy to Cloudflare (CI normally does this)
```

## Verify your changes

- Minimum for any code change: `npm run lint` and `npm run test:unit`.
- For template/content/CSS changes, also view the result with `npm start`.
- Before claiming a change complete: `npm run build` succeeds, and `npm test` passes if page structure or behavior changed. If content changed, confirm search works after a full `npm run build`.
- Check both light and dark mode (dark mode follows `prefers-color-scheme`; there is no toggle) and mobile/desktop widths.
- When using Playwright MCP to drive the site manually, save any screenshots into `.playwright-mcp/` (already git-ignored) rather than the repo root.

## Where things live

| Path | Contents |
|------|----------|
| `src/blog/YYYY/MM/*.md` | Blog posts |
| `src/_includes/` | Nunjucks layouts and partials |
| `src/_data/` | Global data (author, metadata) |
| `src/assets/css/` | Stylesheets (`global.css` + `partials/` + `components/`) |
| `src/assets/js/components/` | Lit components: `app.js`, `demo.js`, `note.js`, `tile.js` |
| `11ty/` | Custom Eleventy plugins (drafts, feeds, TOC, syntax highlighting, externals) |
| `tests/unit/`, `tests/e2e/` | Node unit tests for plugins; Playwright browser tests |
| `eleventy.config.js` | Main Eleventy configuration |
| `feeds.json` | External RSS feeds for the Reading page |
| `.github/workflows/ci.yml` | CI/CD: build + unit tests + e2e tests, then deploy on `main` |
| `docs/` | Detailed documentation (see below) |

## Conventions

**Blog posts** — file at `src/blog/YYYY/MM/post-name.md`. Frontmatter requires `title`, `description`, `date`. Optional: `tags` (list), `draft: true` (visible in dev only, excluded from production and feeds), `updatedDate` (add when significantly revising a published post). TOC is auto-generated from headings; external links auto-open in new tabs.

**Markdown extras** — note boxes via `> [!note]` / `[!info]` / `[!success]` / `[!warning]` / `[!error]` (rendered as `<pob-note>`); footnotes; ` ```html live ` makes an HTML code block runnable in a sandboxed iframe.

**CSS** — layer order is `reset, config, base, utility, interactions, layout` (see `src/assets/css/global.css`). Design tokens are `@property` custom properties in `partials/_vars.css`; dark mode overrides them under `@media (prefers-color-scheme: dark)`. BEM-like class names. Mobile-first with modern range syntax: `@media (width >= 768px)` (tablet), `@media (width >= 1024px)` (desktop).

**Web components** — Lit, server-side rendered at build time by `@lit-labs/eleventy-plugin-lit`; keep them progressive-enhancement only. Add new components in `src/assets/js/components/` and follow `note.js` as the template.

## When things break

| Symptom | Fix |
|---------|-----|
| Build failing | `npm run clean` then `npm run build` |
| Search empty/broken | Full `npm run build` (index requires built HTML) |
| Drafts not showing | Drafts only appear under `npm start`, never in builds |
| CSS not applying | Check layer order and that the file is imported in `global.css` |
| Hot reload broken | Free port 8080, restart `npm start` |

## Detailed docs

Read these only when the task needs them:

- [docs/architecture.md](docs/architecture.md) — how SSR, search, feeds, service worker, and import maps work
- [docs/development.md](docs/development.md) — setup, content authoring, markdown features, styling
- [docs/deployment.md](docs/deployment.md) — CI/CD pipeline, Cloudflare setup, rollback
- [docs/maintenance.md](docs/maintenance.md) — dependency updates, troubleshooting

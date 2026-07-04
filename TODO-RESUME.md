# Résumé — work in progress

Handoff notes for the `/resume/` page. Delete this file once the work lands.

## Where it lives

| File | Purpose |
|------|---------|
| `src/_data/resume.yaml` | All résumé content (data-first). Validated by the schema below. |
| `schemas/resume.schema.json` | JSON Schema for `resume.yaml`; attached via a `# yaml-language-server` modeline at the top of the YAML (fixes VS Code's wrong auto-match to the public "JSON Resume" schema). |
| `src/resume.njk` | Template that renders the data. `permalink: /resume/`, `noSidebar`, `excludeFromSearch`. |
| `src/assets/css/resume.css` | Screen styles (light/dark via global tokens). Also hides the anti-spam honeypot + drops it from print. |
| `src/assets/css/resume-document.css` | Desktop-only "paper sheet" look. Loaded via `<link media="screen and (width >= 1024px)">`. |
| `src/assets/css/resume-print.css` | Print-only styles. Loaded via `<link media="print">`. |
| `src/assets/js/components/print-button.js` | Reusable `<pob-print-button>` (Lit, SSR). `floating` attr = FAB. |

Supporting wiring:

- `eleventy.config.js` — YAML data extension (`js-yaml`), `mdInline` filter (inline markdown for prose), `dateRange` filter (formats `{start,end}`), `print-button` added to `LIT_COMPONENTS`.
- `src/_includes/layouts/partials/_head.njk` — renders a page's `styles:` frontmatter array into `<head>` (the "portal" for per-page stylesheets). NOTE: this file also has unrelated in-flight edits by the user (`standardSite.documents`) — leave them.
- `src/_includes/layouts/base.njk` — imports `print-button.js` for hydration.
- `package.json` — `js-yaml` added as a dev dependency.
- `src/assets/js/components/app.js` — `@media print` block hides the site chrome (header/footer/nav). This file also has the user's own in-flight edits — include them in the commit.

## Done

- [x] Page scaffolding, data-first YAML + schema, reusable print FAB.
- [x] Light/dark on screen; desktop "document" sheet; print-ready.
- [x] Real content: masthead, summary, contact (incl. Bluesky), current role, full Zywave history (2015–present), education.
- [x] `dates` refactored to `{ start, end }` — `end: null` → "Present", `start == end` → single year.
- [x] Anti-spam honeypot (hidden, `aria-hidden`, excluded from print) in `resume.njk`.
- [x] Print bug fixed: `break-inside: avoid` moved off `.resume__section` (was pushing the whole Experience block to page 2, leaving page 1 half-empty) onto `.resume__entry`.
- [x] Page-break guide line on the desktop sheet was REMOVED (a pure-CSS gap isn't possible — background can't reflow text off the boundary).

## Open decisions (waiting on Patrick)

1. **Skills** — still the initial placeholders; they omit .NET. Proposed set to confirm/edit:
   - Languages: `C#, TypeScript, JavaScript, HTML, CSS`
   - Platform: `.NET (Framework 4.8 – .NET 10), ASP.NET, Web Components, Node.js`
   - Security: `OAuth 2.0 / 2.1, OIDC, MCP`
   - Leadership: `Architecture, Team leadership, Mentorship, Cross-team enablement`
2. **Zywave grouping** — all 7 roles are one company. Decide: nest roles under a single "Zywave, Inc." header (shows intern → Director progression; needs schema + template + CSS work) vs. keep the current flat list (company repeats per role).
3. **Education phrasing** — currently "Coursework toward B.S. in Computer Science" (honest; degree not earned). Alternatives: "B.S. in Computer Science (incomplete)", or add an optional `note` field to the schema.
4. **Current-role bullets** — mixed noun-led ("Core maintainer of…") and verb-led ("Championed…"). Make parallel once content settles. Also: only 4 bullets — add more if desired.
5. **Print headers/footers** — currently real `@page { margin: 0.6in }` so multi-page prints stay inset; trade-off is the browser's header/footer toggle is the user's to control. Alternative (single-page only): `@page { margin: 0 }` to suppress them.

## Remaining tasks

- [ ] Finalize skills (open decision #1).
- [ ] Resolve grouping (#2); implement if "grouped".
- [ ] Confirm education phrasing (#3).
- [ ] Tighten bullet parallelism (#4).
- [ ] Consider adding `/resume/` to site nav (`NAV_ITEMS` in `app.js`) — not yet linked anywhere.
- [ ] Remove placeholder/leftover TODO comments in `resume.yaml`.
- [ ] **Commit**: not yet committed. Bundle with the in-flight `app.js` (and `_head.njk`) edits. Per project rules: branch + PR, never push `main`. Suggested: `feat: add print-ready resume page`.
- [ ] Delete this file.

## Verify before committing

```bash
npm run lint          # currently clean
npm run test:unit     # currently 54 passing (no 11ty/ plugin changed, so none added)
npm run build         # full build incl. Pagefind
npm test              # e2e — run if page structure/nav changed
```

Manual: view `/resume/` at desktop + mobile, light + dark, and a real `Ctrl+P` print preview (browser tooling here can't emulate true print pagination — verified via a generated PDF instead).

## Notes / gotchas

- YAML data files need the `addDataExtension("yaml", …)` in `eleventy.config.js`; `js-yaml` v5 has **named** exports only (`import { load as loadYaml }`), no default.
- `.yaml` is not in the Prettier lint glob, so the YAML isn't auto-formatted/checked.
- Numeric-only YAML values parse as numbers — the schema allows `number|string` for `dates.start/end`; a bare year like `dates: 2015` (string context) must be quoted or use the object form.

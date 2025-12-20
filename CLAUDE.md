# Claude Code Instructions

This file contains instructions to help Claude Code work more efficiently with the pob.dev codebase.

## Project Overview

pob.dev is a statically-generated personal website and blog built with:
- **Eleventy 3.1.2** (static site generator)
- **Lit 3.3.1** (web components with SSR)
- **PageFind 1.3.0** (client-side search)
- **Cloudflare Workers** (hosting platform)

## Essential Documentation

Before making changes or answering questions about the project, refer to these docs:

- [docs/architecture.md](docs/architecture.md) - Technical architecture, tech stack, data flow, and key features
- [docs/development.md](docs/development.md) - Development setup, available scripts, project structure, and content creation
- [docs/deployment.md](docs/deployment.md) - CI/CD pipeline, deployment methods, and troubleshooting
- [docs/maintenance.md](docs/maintenance.md) - Maintenance tasks, dependency management, and common issues

## Quick Reference

### Key Directories

- `src/` - All source content and templates
  - `src/blog/YYYY/MM/` - Blog posts organized by date
  - `src/_includes/` - Layouts and components
  - `src/assets/` - CSS, JS, fonts
  - `src/_data/` - Global data files
- `11ty/` - Custom Eleventy plugins
- `public/` - Build output (git-ignored)
- `docs/` - Project documentation

### Common Commands

```bash
npm start              # Development server with hot reload (localhost:8080)
npm run build          # Full production build (Eleventy + PageFind)
npm run build:11ty     # Build static site only (faster for testing)
npm run build:index    # Generate PageFind search index only
npm run lint           # Check code formatting
npm run format         # Auto-format all source files
npm run clean          # Remove build artifacts
npm run dev            # Local Cloudflare Workers environment (localhost:8787)
npm run deploy         # Deploy to Cloudflare Workers
```

### Project Conventions

**Blog Posts:**
- Location: `src/blog/YYYY/MM/post-name.md`
- Requires frontmatter: `title`, `description`, `date`
- Optional: `tags`, `draft: true`, `updatedDate`
- Drafts visible in dev, hidden in production
- Use `updatedDate` when updating a post (displays as "(Updated ...)")

**CSS:**
- Layer order: `reset, config, base, utility, layout`
- Use CSS custom properties in `src/assets/css/partials/_vars.css`
- Dark mode via `prefers-color-scheme`
- BEM-like naming for components
- Breakpoints (mobile-first):
  - `768px` - tablet (2 columns, 18px font)
  - `1024px` - desktop (3 columns)
- Use modern media query syntax: `@media (width >= 768px)`

**Web Components:**
- Located in `src/assets/js/components/`
- Built with Lit
- Server-side rendered at build time
- Examples: `<pob-app>`, `<pob-note>`

**External Feeds:**
- Configure in `feeds.json`
- Date filtering uses ISO 8601 durations (e.g., `P90D` for 90 days)
- Automatically watched in development mode

### Code Style

- **Indentation:** Tabs (size 2)
- **Line width:** 120 characters (200 for Markdown/SCSS)
- **Braces:** Always required, even for single-line statements
- **Formatting:** Enforced via Prettier
- Always run `npm run lint` before committing

```javascript
// ✅ Good - always use braces
if (condition) {
	return null;
}

// ❌ Bad - no braces
if (condition) return null;
```

## Working with Claude Code

### Before Making Changes

1. **Read relevant files first** - Always use the Read tool before suggesting modifications
2. **Check documentation** - Refer to docs/ folder for context
3. **Understand existing patterns** - Follow established conventions in the codebase

### When Troubleshooting

1. Check [docs/development.md](docs/development.md) debugging section
2. Check [docs/maintenance.md](docs/maintenance.md) troubleshooting section
3. Verify Node.js version: 22+
4. Try `npm run clean` before rebuilding

### Common Tasks

**Adding a blog post:**
1. Create `src/blog/YYYY/MM/post-name.md`
2. Add required frontmatter (title, description, date)
3. Optional: Set `draft: true` to hide from production
4. Build and test with `npm start`

**Modifying styles:**
1. Check existing patterns in `src/assets/css/`
2. Use CSS layers appropriately
3. Test in both light and dark modes
4. Ensure responsive design

**Updating dependencies:**
1. Read [docs/maintenance.md](docs/maintenance.md) dependency management section
2. Check release notes for breaking changes
3. Test locally before deploying
4. Monitor first deployment

**Creating/modifying web components:**
1. Follow Lit patterns in `src/assets/js/components/`
2. Remember components are SSR at build time
3. Import in `app.js` or create new component file

### Git Workflow

- **Main branch:** Production (auto-deploys to Cloudflare)
- **Commit prefixes:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- **Before committing:** Run `npm run lint` and `npm run format`

### Testing Checklist

Before suggesting changes are complete:

- [ ] Test locally with `npm start`
- [ ] Run production build: `npm run build`
- [ ] Test production build: `npm run dev`
- [ ] Run `npm run lint`
- [ ] Verify search works (if content changed)
- [ ] Check both light and dark modes
- [ ] Test responsive design

## Build Pipeline

### Development
- Incremental builds with hot reload
- Drafts visible
- Serves on `http://localhost:8080`

### Production
1. Eleventy processes templates → static HTML
2. Lit components server-side rendered
3. CSS minified via clean-css
4. Images optimized
5. PageFind generates search index
6. Outputs to `public/`
7. Deployed to Cloudflare Workers

### Deployment
- **Automatic:** Push to `main` branch
- **Hourly:** Cron job refreshes external RSS feeds
- **Manual:** GitHub Actions workflow dispatch
- **Duration:** Typically 2-3 minutes

## Performance Considerations

- Static generation for instant loads
- Minimal JavaScript (web components only)
- CSS minification automatic
- Images optimized via `@11ty/eleventy-img`
- Client-side search (no backend)
- Edge deployment via Cloudflare Workers

## Project Philosophy

1. **Performance** - Static generation, minimal JavaScript
2. **Simplicity** - No complex frameworks or build tools
3. **Standards** - Modern web platform features
4. **Maintainability** - Clear structure, minimal dependencies
5. **Accessibility** - Semantic HTML, keyboard navigation
6. **Developer Experience** - Fast builds, hot reload, clear code

## Important Notes

- Node.js version: **22+** required
- Build artifacts in `public/` are git-ignored
- Search requires full build: `npm run build`
- External links automatically open in new tabs
- Feeds available at `/feed.rss`, `/feed.atom`, `/feed.json`
- Dark mode uses system preference (no toggle)
- TOC auto-generated from headings in post layout

## When Things Break

1. **Build failing:** Run `npm run clean`, then `npm run build`
2. **Search not working:** Run `npm run build:index`
3. **CSS not applying:** Check layer order, clear browser cache
4. **Drafts not showing:** Only visible in dev mode (`npm start`)
5. **Hot reload broken:** Ensure port 8080 is free, restart dev server

## Additional Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Lit Documentation](https://lit.dev/docs/)
- [PageFind Documentation](https://pagefind.app/docs/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

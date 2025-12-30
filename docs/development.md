# Development Guide

This guide will help you set up and develop on pob.dev locally.

## Prerequisites

- **Node.js** - Version 22 or higher (24 recommended for CI parity)
- **npm** - Comes with Node.js
- **Git** - For version control

## Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/p-ob/pob.dev.git
cd pob.dev
```

2. **Install dependencies**

```bash
npm ci
```

This installs exact versions from `package-lock.json`.

3. **Start the development server**

```bash
npm start
```

The site will be available at `http://localhost:8080` with hot reload enabled.

## Available Scripts

### Development

```bash
npm start
```
- Starts Eleventy in watch mode with live reload
- Incremental builds for faster development
- Draft posts are visible
- Serves on `http://localhost:8080`

### Building

```bash
npm run build
```
- Full production build (Eleventy + PageFind search index)
- Minifies CSS
- Optimizes images
- Generates search index
- Outputs to `public/` directory

```bash
npm run build:11ty
```
- Builds static site only (no search index)
- Faster for testing build output

```bash
npm run build:index
```
- Generates PageFind search index only
- Run after `build:11ty` to update search

### Code Quality

```bash
npm run lint
```
- Checks code formatting with Prettier
- Validates JavaScript, Markdown, CSS, JSON, HTML

```bash
npm run format
```
- Auto-formats all source files
- Applies Prettier configuration

### Deployment (Local Testing)

```bash
npm run dev
```
- Starts local Cloudflare Workers environment
- Simulates production deployment locally
- Requires prior `npm run build`

```bash
npm run deploy
```
- Deploys to Cloudflare Workers
- Requires Cloudflare credentials
- Typically done via CI/CD

### Cleanup

```bash
npm run clean
```
- Removes build artifacts (`public/` directory)
- Preserves `.env` file if present
- Uses `git clean` to ensure complete cleanup

## Project Structure

### Source Files (`src/`)

All source content lives here:

```
src/
├── _data/              # Global data files (author.js, metadata.js)
├── _includes/          # Layouts and reusable components
├── assets/             # Static assets (CSS, JS)
├── blog/               # Blog posts (organized by year/month)
├── index.njk           # Homepage
├── blog.njk            # Blog listing
├── reading.njk         # RSS feed reader
├── search.njk          # Search page
├── feed.njk            # Feed listing page
└── about.md            # About page
```

### Custom Plugins (`11ty/`)

Eleventy plugins that extend functionality:

- `draft.js` - Hides draft posts in production
- `externals.js` - Manages external dependencies with import maps
- `feeds.js` - Generates RSS/Atom/JSON feeds
- `feed-aggregator.js` - Aggregates external RSS feeds
- `json-html.js` - Sanitizes JSON for HTML output
- `table-of-contents.js` - Generates article TOC
- `syntax-highlight.js` - Per-page syntax highlighting with language detection

### Configuration Files

- `eleventy.config.js` - Main Eleventy configuration
- `wrangler.jsonc` - Cloudflare Workers configuration
- `feeds.json` - External RSS feed sources
- `.editorconfig` - Editor settings
- `.prettierrc` - Code formatting rules

## Creating Content

### Writing a Blog Post

1. **Create a new markdown file**

```bash
# Follow the date-based structure
src/blog/YYYY/MM/your-post-title.md
```

Example: `src/blog/2024/11/new-feature.md`

2. **Add frontmatter**

```yaml
---
title: Your Post Title
description: A brief description of your post
date: 2024-11-30
tags:
  - tag1
  - tag2
---

Your content here...
```

3. **Required frontmatter fields**
   - `title` - Post title
   - `description` - Brief description (used in lists and feeds)
   - `date` - Publication date (YYYY-MM-DD)

4. **Optional frontmatter fields**
   - `tags` - Array of tags for categorization
   - `draft` - Set to `true` to mark as draft (visible in dev only)
   - `updatedDate` - Last modification date (displays alongside publish date)

### Updated Posts

When you update a post significantly, add the `updatedDate` field:

```yaml
---
title: My Post
description: A post that was updated
date: 2024-11-30
updatedDate: 2025-01-15
---
```

This will:
- Display as "November 30, 2024 (Updated January 15, 2025)" on the post
- Add `dateModified` to Schema.org structured data for SEO
- Keep the original `date` for sorting and feeds

### Draft Posts

To work on a post without publishing:

```yaml
---
title: Work in Progress
description: Still writing this
date: 2024-11-30
draft: true
---
```

Drafts are:
- ✅ Visible in development (`npm start`)
- ❌ Hidden in production builds (`npm run build`)
- ❌ Excluded from feeds and collections

### Markdown Features

Standard markdown plus:

- **Footnotes** - Via markdown-it-footnote
- **Code blocks** - With automatic syntax highlighting (see below)
- **External links** - Automatically open in new tab
- **Images** - Automatically optimized by Eleventy

#### Code Blocks with Syntax Highlighting

Code blocks automatically get syntax highlighting using the `<syntax-highlight>` element. The system intelligently loads only the languages you use.

**Basic usage:**

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

**Supported languages:**

The site supports all [Prism languages](https://prismjs.com/#supported-languages). Common ones include:

- `javascript`, `js` - JavaScript
- `typescript`, `ts` - TypeScript  
- `python`, `py` - Python
- `csharp`, `cs` - C#
- `bash`, `sh`, `shell` - Shell scripts
- `html`, `xml` - Markup
- `css`, `scss` - Stylesheets
- `json` - JSON
- `markdown`, `md` - Markdown

#### Note Boxes

Use GitLab-style alert syntax to create styled note boxes. Five types are supported:

**Note** - General information or reminders:
```markdown
> [!note]
> This is important information readers should know.
```

**Info** - Helpful tips or additional context:
```markdown
> [!info]
> This provides helpful context or tips.
```

**Success** - Positive outcomes or achievements:
```markdown
> [!success]
> The operation completed successfully!
```

**Warning** - Important cautions or considerations:
```markdown
> [!warning]
> Be careful when doing this operation.
```

**Error** - Critical errors or failures:
```markdown
> [!error]
> An error occurred during processing.
```

**Multi-line notes:**
```markdown
> [!warning]
> This warning spans multiple lines.
> Each line should start with `> ` to be included.
> The note will display all lines together.
```

Notes are rendered as `<pob-note>` web components with appropriate styling for each type.

**Language aliases:**

Many languages have aliases that map to the same grammar:
- `js` → `javascript`
- `py` → `python`
- `cs` → `csharp`
- `sh`, `shell` → `bash`

**Multiple languages in one post:**

````markdown
```javascript
// JavaScript example
const x = 42;
```

```python
# Python example
x = 42
```

```csharp
// C# example
int x = 42;
```
````

When you use multiple languages, only those specific languages are loaded from the CDN. Pages without code blocks don't load the syntax highlighting library at all, improving performance.

**How it works:**
1. The build process detects which languages are used in your post
2. The page loads only those specific languages (plus base languages: markup, css, javascript)
3. Syntax highlighting happens at runtime using the CSS Custom Highlight API
4. No `<span>` elements clutter your HTML – just clean, semantic markup

**Styling:**

Code blocks automatically match your site's theme (light/dark mode) using CSS custom properties. The highlighting styles are defined in `src/assets/css/partials/_code.css`.

### Using Web Components

#### Note Boxes

```html
<pob-note type="note">
This is an informational note.
</pob-note>

<pob-note type="warning">
This is a warning.
</pob-note>

<pob-note type="error">
This is an error or critical information.
</pob-note>
```

### Table of Contents

TOC is automatically generated from heading elements (`h2`, `h3`, etc.) when using the post layout.

No action needed - it just works!

## Styling

### CSS Architecture

CSS is organized using CSS layers:

```css
@layer reset, config, base, utility, interactions, layout;
```

**Adding styles:**

1. **Global utilities** → `src/assets/css/partials/_base.css`
2. **Component styles** → `src/assets/css/components/component-name.css`
3. **Theme variables** → `src/assets/css/partials/_vars.css`
4. **Interaction styles** → `src/assets/css/partials/_interactions.css`

### CSS Custom Properties

Theme variables are defined in `_vars.css`:

```css
@property --font-color {
	syntax: "<color>";
	inherits: true;
	initial-value: hsl(0, 0%, 20%);
}

@property --page-background-color {
	syntax: "<color>";
	inherits: true;
	initial-value: hsl(0, 0%, 96%);
}
```

Dark mode variants use `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
	:root {
		--font-color: hsl(0, 0%, 91%);
		--page-background-color: hsl(220, 4%, 14%);
	}
}
```

### Component Naming

Use BEM-like naming:

```css
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

## Working with Web Components

### Location

Web components live in `src/assets/js/components/`:

- `app.js` - Main application shell
- `note.js` - Note component
- `tile.js` - Card/tile component

### Creating a Component

```javascript
import { LitElement, html, css } from "lit";

export class MyComponent extends LitElement {
	static styles = css`
		:host {
			display: block;
		}
	`;

	render() {
		return html`<div>Hello, World!</div>`;
	}
}

customElements.define("my-component", MyComponent);
```

### Using a Component

1. Import in `app.js` or create new component file
2. Use in templates:

```html
<my-component></my-component>
```

Components are server-side rendered at build time via `@lit-labs/eleventy-plugin-lit`.

## Adding External Feeds

To add RSS feeds to the "Reading" page:

1. **Edit `feeds.json`**

```json
{
	"feeds": [
		{
			"name": "Example Blog",
			"url": "https://example.com/feed.xml",
			"siteUrl": "https://example.com"
		}
	]
}
```

2. **Configure date filtering (optional)**

In `eleventy.config.js`, you can limit how far back to aggregate posts using [ISO 8601 duration strings](https://en.wikipedia.org/wiki/ISO_8601#Durations):

```javascript
eleventyConfig.addPlugin(FeedAggregatorPlugin, {
	configFile: "feeds.json",
	durationLimit: "P90D", // Last 90 days
});
```

**Common duration examples:**
- `P90D` - 90 days
- `P1Y` - 1 year
- `P1Y6M` - 1 year and 6 months
- `P2W` - 2 weeks
- `P6M` - 6 months

Omit `durationLimit` to include all posts from the feeds.

3. **Development mode auto-reload**

The feed configuration file is automatically watched in development mode. Changes to `feeds.json` will trigger a rebuild when running `npm start`.

4. **Rebuild the site**

```bash
npm run build
```

Feeds are fetched at build time and cached in the static output.

## Debugging

### Common Issues

**Hot reload not working**
- Check that you're running `npm start` (not `npm run build`)
- Ensure no other process is using port 8080

**Draft posts not showing**
- Drafts only show in development mode (`npm start`)
- Check frontmatter has `draft: true`

**Search not working**
- Run full build: `npm run build`
- Ensure `build:index` completed successfully
- Check `public/pagefind/` directory exists

**CSS not applying**
- Check CSS layer order
- Ensure import in `global.css`
- Clear browser cache

**Build failing**
- Run `npm run clean` to clear build artifacts
- Delete `node_modules/` and run `npm ci`
- Check Node.js version: `node --version` (should be 22+, 24 recommended)

### Verbose Output

For detailed build information:

```bash
DEBUG=Eleventy* npm start
```

## Code Style

### Formatting Rules

- **Indentation** - Tabs (size 2)
- **Line width** - 120 characters (200 for Markdown/SCSS)
- **Quotes** - Consistent use of template literals
- **Semicolons** - Required
- **Braces** - Always required, even for single-line statements

```javascript
// ✅ Good - always use braces
if (condition) {
	return null;
}

// ❌ Bad - no braces
if (condition) return null;
```

### Enforcing Style

```bash
# Check formatting
npm run lint

# Fix formatting
npm run format
```

All code should pass `npm run lint` before committing.

## Git Workflow

### Branch Strategy

- `main` - Production branch (auto-deploys)
- Feature branches for development

### Commit Messages

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: correct search index generation"
git commit -m "docs: update development guide"
```

Prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style/formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance tasks

## Testing

### Manual Testing

Before submitting changes:

1. **Local development** - Test with `npm start`
2. **Production build** - Test with `npm run build && npm run dev`
3. **Multiple browsers** - Test in Chrome, Firefox, Safari
4. **Responsive design** - Test on mobile and desktop viewports
5. **Dark mode** - Test with system dark mode enabled
6. **Search functionality** - Verify search works after rebuild

### Automated Testing

This project does not currently have automated tests. Changes are validated through:
- Manual testing
- Linting (`npm run lint`)
- Production build success

## Performance Considerations

### Build Time

- Use `--incremental` flag in development (automatic with `npm start`)
- Only rebuild search index when content changes
- Clear cache with `npm run clean` if builds seem stale

### Output Size

- CSS is automatically minified via clean-css
- Images are optimized via `@11ty/eleventy-img`
- Minimal JavaScript (only web components)

### Runtime Performance

- Static HTML loads instantly
- No JavaScript required for core functionality
- Web components enhance progressively
- Search runs entirely client-side

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Lit Documentation](https://lit.dev/docs/)
- [PageFind Documentation](https://pagefind.app/docs/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference

## Getting Help

- Check existing documentation in `/docs/`
- Review the [architecture documentation](architecture.md)
- Check the [deployment guide](deployment.md)
- Open an issue on GitHub

# Architecture

This document describes the technical architecture of pob.dev.

## Overview

pob.dev is a statically-generated personal website and blog built with modern web standards. The site is generated at build time using Eleventy, enhanced with Lit web components for interactivity, and deployed to Cloudflare Workers.

## Technology Stack

### Core Technologies

- **[Eleventy (11ty) 3.1.2](https://www.11ty.dev/)** - Static site generator that processes templates and content
- **[Lit 3.3.1](https://lit.dev/)** - Web Components library with server-side rendering support
- **[PageFind 1.3.0](https://pagefind.app/)** - Static search index generation for client-side search
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge computing platform for hosting

### Supporting Libraries

- **markdown-it-footnote** - Enhanced markdown footnote support
- **clean-css** - CSS minification and optimization
- **rss-parser** - RSS feed aggregation from external sources
- **temporal-polyfill** - Temporal API polyfill for date/duration handling
- **@11ty/eleventy-img** - Image optimization pipeline
- **@11ty/eleventy-navigation** - Navigation structure helpers
- **@11ty/eleventy-plugin-rss** - RSS/Atom/JSON feed generation
- **linkedom** - Lightweight DOM implementation for SSR
- **slugify** - URL-friendly slug generation

## Project Structure

```
pob.dev/
├── src/                          # Source files
│   ├── _data/                    # Global data files
│   │   ├── author.json           # Author information
│   │   └── metadata.json         # Site metadata
│   ├── _includes/
│   │   ├── layouts/              # Page layouts
│   │   │   ├── base.njk          # Base HTML template
│   │   │   └── post.njk          # Blog post layout
│   │   └── components/           # Reusable components
│   │       └── post-list.njk     # Post listing component
│   ├── assets/
│   │   ├── css/                  # Stylesheets
│   │   │   ├── global.css        # Main stylesheet
│   │   │   ├── partials/         # CSS partials (reset, config, base)
│   │   │   └── components/       # Component styles (note, toc, search)
│   │   ├── fonts/                # Web fonts (Libre Baskerville)
│   │   └── js/components/        # Lit web components
│   │       ├── app.js            # Main app shell
│   │       └── note.js           # Note component
│   ├── blog/                     # Blog posts
│   │   ├── blog.11tydata.js      # Blog collection configuration
│   │   └── YYYY/MM/              # Date-based organization
│   │       └── post-name.md      # Individual posts
│   ├── index.njk                 # Homepage
│   ├── blog.njk                  # Blog listing page
│   ├── reading.njk               # RSS feed reader page
│   ├── search.njk                # Search page
│   ├── about.md                  # About page
│   ├── favicon.ico
│   └── robots.txt
├── 11ty/                         # Custom Eleventy plugins
│   ├── draft.js                  # Draft post handling
│   ├── feeds.js                  # RSS/Atom/JSON feed generation
│   ├── feed-aggregator.js        # External feed aggregation
│   ├── json-html.js              # JSON sanitization filter
│   └── table-of-contents.js      # Auto-generated table of contents
├── .github/workflows/
│   └── deploy.yml                # CI/CD pipeline
├── public/                       # Build output (git-ignored)
├── eleventy.config.js            # Main Eleventy configuration
├── feeds.json                    # External feed sources
├── wrangler.jsonc                # Cloudflare Workers config
└── package.json                  # Dependencies and scripts
```

## Key Features

### Content Management

**Blog Posts**
- Written in Markdown with YAML frontmatter
- Organized by date (`YYYY/MM/post-name.md`)
- Support for tags, descriptions, and custom metadata
- Automatic permalink generation

**Draft System**
- Posts with `draft: true` in frontmatter are visible in development
- Drafts are automatically excluded from production builds
- See [11ty/draft.js](../11ty/draft.js)

**Tags & Collections**
- Automatic tag pages generated for all post tags
- Posts grouped into collections (blog, all)
- Tag-based navigation

**RSS Feed Aggregation**
- "Reading" page aggregates external RSS feeds
- Configured via [feeds.json](../feeds.json)
- Optional date filtering using Temporal duration strings (e.g., `P90D` for 90 days, `P1Y6M` for 1.5 years)
- Automatically watches feed configuration file for changes in development mode
- Refreshed hourly via automated builds
- See [11ty/feed-aggregator.js](../11ty/feed-aggregator.js)

### User Experience

**Search**
- Full-text search powered by PageFind
- Static search index generated at build time
- Client-side search with no backend required
- Search UI at [/search/](https://pob.dev/search/)

**Dark Mode**
- Automatic dark mode based on system preference
- Uses `prefers-color-scheme` media query
- CSS custom properties for theme values
- No JavaScript toggle required

**Table of Contents**
- Auto-generated from article headings
- Sidebar navigation on wider screens
- Shows article structure at a glance
- See [11ty/table-of-contents.js](../11ty/table-of-contents.js)

**Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Typography scales for readability
- Touch-friendly navigation

### Web Components

**`<pob-app>`** - Main application shell
- Handles header, footer, and navigation
- Manages page layout structure
- Server-side rendered with Lit
- Source: [src/assets/js/components/app.js](../src/assets/js/components/app.js)

**`<pob-note>`** - Styled note boxes
- Multiple types: note, warning, error
- Semantic HTML with custom styling
- Slotted content support
- Source: [src/assets/js/components/note.js](../src/assets/js/components/note.js)

### Feed System

Multiple feed formats available:
- RSS 2.0: `/feed.rss`
- Atom: `/feed.atom`
- JSON Feed: `/feed.json`

Features:
- Latest 10 posts included
- Full content in feeds
- Proper metadata and author information
- See [11ty/feeds.js](../11ty/feeds.js)

## Build Pipeline

### Development Build

```bash
npm run start
```

1. Eleventy watches for file changes
2. Incremental builds for modified files
3. Local dev server with hot reload
4. Draft posts are visible
5. Serves on `http://localhost:8080`

### Production Build

```bash
npm run build
```

1. **Eleventy Processing** (`npm run build:11ty`)
   - Processes all templates (Nunjucks, Markdown, JavaScript)
   - Renders Lit components server-side
   - Minifies CSS via clean-css
   - Optimizes images
   - Generates static HTML files
   - Outputs to `public/` directory

2. **Search Index Generation** (`npm run build:index`)
   - PageFind crawls generated HTML
   - Creates searchable index
   - Adds search UI assets
   - Outputs to `public/pagefind/`

### CSS Architecture

CSS is organized using CSS layers for explicit cascade control:

```css
@layer reset, config, base, utility, layout;
```

**Layers:**
- `reset` - Normalize browser defaults
- `config` - CSS custom properties and design tokens
- `base` - Base element styles
- `utility` - Utility classes
- `layout` - Component and layout styles

**Features:**
- CSS custom properties with `@property` for type-safe values
- Dark mode via `prefers-color-scheme`
- Mobile-first responsive design
- BEM-like component naming

See [src/assets/css/global.css](../src/assets/css/global.css)

## Modern Web Standards

This site demonstrates modern web platform capabilities:

- **ES Modules** - Native JavaScript modules throughout
- **Import Maps** - Dependency resolution without bundlers
- **Web Components** - Custom elements with shadow DOM
- **CSS Custom Properties** - Dynamic theming
- **CSS Layers** - Explicit cascade control
- **CSS `@property`** - Type-safe custom properties
- **Server-Side Rendering** - Lit components rendered at build time

## Performance Optimizations

- Static generation for instant page loads
- Minimal JavaScript (only web components)
- CSS minification
- Image optimization pipeline
- Efficient search index
- Edge deployment via Cloudflare Workers
- Incremental development builds

## External Link Handling

External links in markdown are automatically enhanced:
- `target="_blank"` added
- Opens in new tab/window
- Configured in [eleventy.config.js](../eleventy.config.js)

## Data Flow

1. **Content** (Markdown files) + **Data** (JSON files) → Eleventy
2. Eleventy processes templates with Nunjucks/Liquid
3. Lit components are server-side rendered
4. Static HTML + CSS + minimal JS generated
5. PageFind indexes the generated HTML
6. Output deployed to Cloudflare Workers
7. Users receive pre-rendered, static HTML

## Configuration Files

- [eleventy.config.js](../eleventy.config.js) - Main Eleventy configuration
- [wrangler.jsonc](../wrangler.jsonc) - Cloudflare Workers deployment settings
- [feeds.json](../feeds.json) - External RSS feed sources
- [.editorconfig](../.editorconfig) - Editor formatting rules
- [.prettierrc](../.prettierrc) - Code formatting configuration
- [package.json](../package.json) - Dependencies and scripts

## Philosophy

This site prioritizes:

1. **Performance** - Static generation, minimal JavaScript
2. **Simplicity** - No complex frameworks or build tools
3. **Standards** - Modern web platform features
4. **Maintainability** - Clear structure, minimal dependencies
5. **Accessibility** - Semantic HTML, keyboard navigation
6. **Developer Experience** - Fast builds, hot reload, clear code

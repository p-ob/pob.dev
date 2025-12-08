# Site Improvement Tasks

Recommendations for pob.dev based on codebase analysis (December 2025).

## High Priority

### [ ] Complete Tag Filtering Feature
- **Location:** `src/assets/css/partials/blog.css`
- **Description:** The blog page has a TODO comment for tag filters that was never implemented
- **Options:**
  - Add client-side JavaScript filtering
  - Generate static tag archive pages at build time
  - Leverage PageFind's filtering capabilities
- **Effort:** Medium

### [ ] Add Cache Headers for Static Assets
- **Location:** `src/_headers`
- **Description:** Fonts and versioned assets should use immutable cache headers
- **Implementation:**
  ```
  /assets/fonts/*
    Cache-Control: public, max-age=31536000, immutable
  /assets/external/*
    Cache-Control: public, max-age=31536000, immutable
  ```
- **Effort:** Low

### [ ] Systematic Image Lazy Loading
- **Description:** Add `loading="lazy"` and `decoding="async"` to images
- **Location:** `eleventy.config.js` (eleventyImageTransformPlugin config)
- **Also:** Ensure all images have explicit `width`/`height` to prevent CLS
- **Effort:** Low

---

## Medium Priority

### [ ] Add Service Worker for Offline Reading
- **Description:** Enable offline reading for blog posts
- **Implementation:**
  - Use Workbox with stale-while-revalidate strategy
  - Cache article HTML, CSS, fonts
  - Cache PageFind index for offline search
- **Effort:** Medium

### [ ] Improve Mobile Navigation UX
- **Location:** `src/assets/js/components/app.js` (lines 396-428)
- **Improvements:**
  - Add slide-in animation for drawer
  - Add backdrop blur effect
  - Consider swipe-to-close gesture
- **Effort:** Medium

### [x] Add RSS Feed Autodiscovery
- **Location:** `src/_includes/layouts/partials/_head.njk`
- **Implementation:**
  ```html
  <link rel="alternate" type="application/rss+xml" title="pob.dev RSS Feed" href="/feed.rss">
  <link rel="alternate" type="application/atom+xml" title="pob.dev Atom Feed" href="/feed.atom">
  <link rel="alternate" type="application/feed+json" title="pob.dev JSON Feed" href="/feed.json">
  ```
- **Effort:** Low

### [x] Enhance PageFind Search
- **Description:** Improve search experience
- **Improvements:**
  - ~~Add custom ranking weights (title > body)~~ Already configured via `data-pagefind-weight="10"` on titles
  - ~~Better result excerpts/highlighting~~ Increased excerptLength, styled mark elements
  - ~~Keyboard navigation (arrow keys) in results~~ Arrow keys navigate, Escape returns to input
- **Location:** `src/search.njk`
- **Effort:** Medium

---

## Nice to Have

### [ ] Add Dark Mode Toggle
- **Description:** Allow manual dark/light mode control instead of system-only
- **Implementation:**
  - Add toggle button to header
  - Store preference in `localStorage`
  - Fall back to `prefers-color-scheme` if no preference
- **Location:** `src/assets/js/components/app.js`
- **Effort:** Medium

### [ ] Add Reading Time Estimates
- **Description:** Show estimated reading time on blog posts
- **Implementation:** Add Eleventy filter:
  ```javascript
  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  });
  ```
- **Location:** `eleventy.config.js`, `src/_includes/layouts/post.njk`
- **Effort:** Low

### [ ] Add Related Posts Section
- **Description:** Show related posts based on shared tags
- **Implementation:** Compute at build time using tag intersection
- **Location:** `src/_includes/layouts/post.njk`
- **Effort:** Medium

### [ ] Full Content in RSS Feeds
- **Description:** Currently feeds use description/excerpt only
- **Implementation:** Add full post content to feed items
- **Location:** `src/feed.njk`
- **Effort:** Low

### [ ] Add Structured Data (JSON-LD)
- **Description:** Add BlogPosting schema for better SEO
- **Implementation:** Add JSON-LD script to post layout
- **Location:** `src/_includes/layouts/post.njk`
- **Example:**
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{{ title }}",
    "datePublished": "{{ date | machineDate }}",
    "author": { "@type": "Person", "name": "{{ author.name }}" }
  }
  </script>
  ```
- **Effort:** Low

---

## Technical Debt

### [x] CSS Anchor Positioning for Popovers
- **Location:** `src/assets/js/components/app.js`
- **Description:** ~~Manual popover positioning should use CSS Anchor when available~~ Implemented!
- **Browser Support:** Now supported in all major browsers
- **Effort:** Low

### [ ] Error Boundaries for Web Components
- **Description:** Add error handling for failed Lit hydration
- **Implementation:** Wrap hydration in try/catch, show fallback content
- **Effort:** Low

---

## Quick Reference

| Task | Effort | Impact | Priority |
|------|--------|--------|----------|
| Cache headers for fonts | Low | Medium | High |
| Image lazy loading | Low | Medium | High |
| RSS autodiscovery | Low | Medium | Medium |
| Reading time filter | Low | Low | Nice to have |
| JSON-LD structured data | Low | Medium | Nice to have |
| Tag filtering | Medium | Medium | High |
| Service worker | Medium | High | Medium |
| Dark mode toggle | Medium | Medium | Nice to have |
| Related posts | Medium | Low | Nice to have |
| Mobile nav improvements | Medium | Medium | Medium |
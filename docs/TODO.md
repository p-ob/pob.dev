# Site Improvement Tasks

Recommendations for pob.dev based on codebase analysis (December 2025).

## Summary

The site is in excellent shape. Most originally planned features have been implemented:

**Completed:**
- Tag filtering with archive pages
- Cache headers for static assets
- Image lazy loading (AVIF/WebP)
- Service worker with intelligent caching
- RSS feed autodiscovery
- Enhanced PageFind search with keyboard navigation
- CSS anchor positioning for popovers
- Mobile navigation with slide-in animation

**Remaining items are all "nice to have" polish features.**

---

## Nice to Have

### [ ] Add Dark Mode Toggle
- **Description:** Allow manual dark/light mode control instead of system-only
- **Implementation:**
  - Add toggle button to header
  - Store preference in `localStorage`
  - Fall back to `prefers-color-scheme` if no preference
- **Location:** `src/assets/js/components/app.js`, `src/assets/css/partials/config.css`
- **Effort:** Medium
- **Impact:** Medium - some users prefer manual control

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
- **Impact:** Low - nice polish feature

### [ ] Add Related Posts Section
- **Description:** Show related posts based on shared tags
- **Implementation:** Compute at build time using tag intersection
- **Location:** `src/_includes/layouts/post.njk`
- **Effort:** Medium
- **Impact:** Low - increases engagement, but needs more posts to be useful

### [x] Add Structured Data (JSON-LD)
- **Description:** Add BlogPosting schema for better SEO
- **Implementation:** Add JSON-LD script to post layout
- **Location:** `src/_includes/layouts/post.njk`
- **Effort:** Low
- **Impact:** Medium - improves rich snippets in search results

### [ ] Mobile Nav Backdrop Blur
- **Description:** Add blur effect to mobile nav backdrop for polish
- **Implementation:** Add `backdrop-filter: blur(4px)` to `#mobile-nav-dialog::backdrop`
- **Location:** `src/assets/js/components/app.js`
- **Effort:** Low
- **Impact:** Low - purely aesthetic polish

### [ ] Swipe-to-Close Mobile Nav
- **Description:** Add touch gesture to close mobile navigation
- **Implementation:** Add touch event listeners for swipe-left gesture
- **Location:** `src/assets/js/components/app.js`
- **Effort:** Medium
- **Impact:** Low - nice UX polish for mobile users

---

## Technical Debt

### [ ] Error Boundaries for Web Components
- **Description:** Add error handling for failed Lit hydration
- **Implementation:** Wrap hydration in try/catch, show fallback content
- **Location:** `src/assets/js/components/`
- **Effort:** Low
- **Impact:** Low - defensive coding, unlikely to occur

---

## Completed

- [x] Complete Tag Filtering Feature
- [x] Add Cache Headers for Static Assets
- [x] Systematic Image Lazy Loading
- [x] Add Service Worker for Offline Reading
- [x] Add RSS Feed Autodiscovery
- [x] Enhance PageFind Search
- [x] CSS Anchor Positioning for Popovers
- [x] Mobile Navigation with Animations

---

## Quick Reference

| Task | Effort | Impact |
|------|--------|--------|
| Dark mode toggle | Medium | Medium |
| Reading time filter | Low | Low |
| ~~JSON-LD structured data~~ | ~~Low~~ | ~~Medium~~ |
| Related posts | Medium | Low |
| Mobile nav backdrop blur | Low | Low |
| Swipe-to-close gesture | Medium | Low |
| Error boundaries | Low | Low |

---

## Notes

- The RSS feeds already include full post content via `@11ty/eleventy-plugin-rss`
- Mobile navigation already has slide-in animation using modern CSS (`@starting-style`)
- All high and medium priority items from the original list have been completed
- Consider adding more blog posts before implementing "related posts" feature
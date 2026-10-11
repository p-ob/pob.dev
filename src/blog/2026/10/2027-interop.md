---
date: 2026-10-11 17:00:00 -05:00
title: 2027 Interop - My Rankings
tags: [web]
description: Firefox has a survey for developers to rank interop issues. Here is my top 15, in order.
---

Since 2022 [^1], the main browser vendors have been actively engaged in the "Interop" program, where they work to improve the ecosystem and align browser on stable standards and reduce interoperability issues between browsers. Starting last year, Mozilla began surveying the community to help rank interop items to help in prioritization conversations. For this years, see [Firefox Interop 2027 Survey](https://interop-rank.fxdx.dev/).

The below are my ordered selections.

> [!info] Disclaimer
> I help build and maintain a web component-based design system, so you might notice a theme

## 1. CSS `:host(:has(…))`

> Selects a shadow host based on its light DOM descendants.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1395>

---

## 2. CSS `:has-slotted` pseudo-class

> Matches `<slot>` elements that have slotted content, rather than showing fallback content.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1356>

---

## 3. CSS anchor positioning across shadow roots

> Allows elements in shadow trees to reference anchor names defined in "higher" trees.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1351>

---

## 4. JavaScript `Temporal`

> A modern and extensive date/time API to replace `Date`.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1381>

---

## 5. JavaScript CSS module imports

> `import … with { type: "css" }` to load CSS resources as constructable stylesheets.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1466>

---

## 6. Shadow DOM `referenceTarget`

> Forwards IDrefs (such as `for` and `aria-labelledby`) to an element inside a shadow root.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1333>

---

## 7. Customizable/stylable `<select>`

> Customize the button, selected option, picker, and options with CSS.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1393>

---

## 8. CSS anchored container queries

> `@container anchored(fallback: …)` applies styles based on which position fallback an anchor-positioned element is using.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1363>

---

## 9. CSS `if()` function

> An inline conditional value that returns a value based on a set of conditions.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1343>

---

## 10. CSS `@function`

> Defines custom functions that take arguments and return a CSS value.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1357>

---

## 11. CSS anchor positioning with transforms and animations

> Anchor-positioned elements track transforms on their anchors, and changes to the calculated `anchor()` triggers transitions.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1457>

---

## 12. Promises from programmatic scroll methods

> `scroll()`, `scrollTo()`, `scrollBy()`, and `scrollIntoView()` return promises that resolve when scrolling completes.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1435>

---

## 13. Interest invokers

> The `interestfor` attribute triggers actions on a target element when the user shows interest, such as via hover, focus, or long-press.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1358>

---

## 14. HTML `<input type="week">`

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1405>

---

## 15. Sanitizer API, via `document.parseHTML()` and `element.setHTML()`

> Customizes the sanitization of HTML inserted into the DOM, to prevent cross-site scripting attacks.

* **Proposal:** <https://github.com/web-platform-tests/interop/issues/1336>

[^1]: <https://web.dev/blog/interop-2022>

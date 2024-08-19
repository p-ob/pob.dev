---
date: 2024-07-29 17:00:00 +05:00
title: Learn the Platform
tags:
  - web
description: My advice for growing as a developer? Learn the medium your software runs on.
draft: true
---

Over the years, I've worked with a lot of engineers. And in that time, many have asked for recommendations on how to grow as a developer, on how to grow their knowledge. What should they learn to be perceived as an expert? What should they learn to improve their resume and job prospects? What should they learn that could scratch that itch of curiosity?

There's no shortage of resources on the internet; articles, videos, social media influencers... so many sources that are pushing some new hotness of the month. And while there is some merit to learning that new hotness (it's gotta be hot for a reason, right?), I'd argue that there something else that developers of today should focus on: **Learn the Platform**.

## What do I mean by "Learn the Platform"?

### A 2016 call to arms: Use the Platform

Years ago, developers at Google (notably, on the Polymer team) coined the term, "Use the Platform".^[Google's Polymer Project unvails the hashtag **#UseThePlatform** at Google I/O 2016. <https://www.polymer-project.org/blog/2016-05-26-IO-2016-Recap>] To quote the Polymer team in 2016:

> Our project was founded on the premise that—as we complete the transition to a resource-constrained, mobile-first web—we need to lean more heavily on the web platform to give users and developers the experiences they deserve.
>
> In calling you to #UseThePlatform, we’re asking you to join us in rethinking some development patterns we’ve been using for years—patterns that involve working extensively above and around the web platform.

The idea of "Use the Platform" at that time was that web development could be greatly simplified by taking solutions to problems discovered in user-land, and producing viable primitives in that web platform.

Web development in 2016 was pretty brutal if you were trying to "be modern":

- Internet Explorer 11 was still very much a thing.
- React was a relative newcomer to the world, only 3 years old in the mainstream. AngularJS was relatively popular (unfortunately).^[StackOverflow framework trends. <https://trends.stackoverflow.co/?tags=reactjs,vue.js,angular,svelte,angularjs,vuejs3>]
- "Modern" JavaScript browser support (ES6) was abysmal, requiring cumbersome and oft-breaking build tools.
- The modern web APIs we know and love today were either not usable, due to browser support, or difficult to use, requiring sometimes brittle polyfills.
  - `fetch`? No, `XMLHttpRequest`.
  - `Promise` and asynchronous code? No, `jQuery.Deferred`, or [Hadouken-level](https://www.reddit.com/r/ProgrammerHumor/comments/27yykv/indent_hadouken/) chained `.then` statements, or callbacks.
  - JavaScript modules? Which type: [UMD](https://github.com/umdjs/umd), [AMD](https://github.com/amdjs/amdjs-api), [CommonJS](https://wiki.commonjs.org/wiki/CommonJS), or the less supported, but official, [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)? Needless to say, being a web developer in this era was extremely frustrating.


Polymer as a web framework ultimately wasn't successful &mdash; although 

While Polymer may not have ultimately won out in the framework/library-wars of the 2010s, the platform improvements it strived to see have become a reality. Is the platform perfect? No, but it's continually improving. It _is_ much more simple today to build "modern web apps" with the native platform features now available today. To name just a notable subset of the enhancements to the platform since 2016:
- HTML has a native component composition model via [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), [dialogs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog), [popovers](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- CSS supports [nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting), [runtime-calculated variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), [same-document (SPA) and same-origin (MPA) view transitions](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition)
- JavaScript has an [out-of-the-box module ecosystem](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [asynchronous functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [robust classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

Also, to give credit to Polymer as a web framework: it's spiritual successor, [lit](https://lit.dev), is doing great.

### A new rallying call: Learn the Platform

To build on the new world we live in, to "Use the Platform", I encourage developers looking to become stronger to now _Learn_ the Platform. This means don't just choose a framework, or a language, and go all in; learn also about the medium in which your software runs.

## Why should you "Learn the Platform"?

Before I dive into what I would recommend learning, I think it's worth explaining why I think learning these more primitive components is worthwhile.

### Diversify your skillset

### Improve your ability to troubleshoot

### Produce better software

## What technologies, capabilities, and APIs should you learn?

### HTTP

Yes, HTTP.

### HTML

### Storage

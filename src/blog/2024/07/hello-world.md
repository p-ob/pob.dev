---
date: 2024-07-26 17:00:00 +05:00
title: Hello, World!
tags: [meta]
description: A brief (re)introduction to my personal website, and what to expect from it.
---

Back in 2020 (just prior to the lockdown), I had sat down and started hacking together my own personal website. At the time, I was hoping to use [Eleventy](https://11ty.dev), Google's [material web components](https://github.com/material-components/material-web), and [Netlify](https://www.netlify.com), among a few other fun tools. My attempts then fizzled during the pandemic, and I let my site sit.

Well, finally this year, I've started the whole process over again.

## Why?

First and foremost, this site is for me. I find writing articles about my work and interests to be cathartic, as well as a great way for me to revisit my thoughts and document my learnings. Many of my posts today are written in an ecosystem owned by my employer, and I'd like to own my own work where I can.

But I do hope that whoever finds this site finds value as well. My favorite part of working in technology isn't just building cool things -- it's teaching others how to build cool things in new and exciting ways.

If you're curious what more to expect from me, check out my [about page](/about).

## How it's built

For those curious about how this site is built at the time of this post, here's a quick rundown:

### Eleventy

I'm using [Eleventy](https://11ty.dev) as my static site generator. I've long used Eleventy, mostly with my work, and I've come to not only value the tool, but the community and core maintainer, [Zach Leatherman](https://zachleat.com). It values the simplicity of the native web platform, and that's something I very much value as well.

### Lit

I've long used [Lit](https://lit.dev), even briefly [Polymer](https://www.polymer-project.org/) before it. Web components are a great suite of web capabilities that I find myself reaching for time and time again, and Lit simplifies the authoring process greatly.

This site _probably_ doesn't warrant Lit, but I have an interest in SSR capabilities of web components generally, so this is my excuse to keep up to date with the ecosystem.

### PageFind

I'm using [PageFind](https://pagefind.app) to generate my site's search index. To be honest, I haven't used it much yet, but the installation was easy, it's not a cloud-based solution but rather generated with and served from my own site, and it kind of just works.

Stumbled on this one in the wild and thought I'd give it a shot.

### Cloudflare Pages

I've never used Cloudflare before, for anything. But, their blog posts have been extremely informative and if a company can put that much value behind engineering excellence, how bad can they be? I'm using [Cloudflare Pages](https://pages.cloudflare.com) to host this site, and so far, it works as advertised.

### The repo

This site is entirely open source, and always will be. If you'd rather just look at code yourself (or steal anything you find useful), you can find the repo at [https://github.com/pob/pob.dev](https://github.com/p-ob/pob.dev).

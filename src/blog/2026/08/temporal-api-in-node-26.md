---
date: 2026-08-24 10:00:00 -05:00
title: "Temporal API is now on by default in Node.js 26"
tags: [javascript, nodejs]
description: Node.js 26 ships with the Temporal API enabled by default, giving us a modern, ergonomic replacement for the long-troubled Date object.
---

Node.js 26 [landed in May 2026](https://nodejs.org/en/blog/release/v26.0.0), and among its headline features is something JavaScript developers have been waiting a long time for: the [Temporal API](https://tc39.es/proposal-temporal/docs/) is now **enabled by default**.

## Why does this matter?

`Date` has been one of JavaScript's most notorious pain points since the language's early days. Its API was [famously modeled after `java.util.Date`](https://maggiepint.com/2017/04/09/fixing-javascript-date-part-1/), which Java itself later deprecated. Common grievances include:

- Months are **zero-indexed** (`0` = January) but days are **one-indexed**.
- `Date` is **mutable** — methods like `setMonth()` modify the object in place, making defensive programming tedious.
- **Time zone support** is essentially non-existent. You get UTC and the local system time zone, and nothing else.
- Parsing is **implementation-defined**, meaning `new Date('2024-08-01')` can behave differently across environments.
- There is no way to represent a **date without a time**, a **time without a date**, or a **duration** without resorting to arithmetic on raw milliseconds.

The TC39 [Temporal proposal](https://github.com/tc39/proposal-temporal) has been in development for years, reaching Stage 3 (candidate) and now shipping in Node.js 26 (V8 14.6) without a flag.

## A quick look at the API

Temporal lives under the global `Temporal` namespace. The key types are:

- **`Temporal.PlainDate`** — a calendar date with no time or time zone (`2026-08-24`).
- **`Temporal.PlainTime`** — a wall-clock time with no date or time zone (`10:00:00`).
- **`Temporal.PlainDateTime`** — date + time, no time zone.
- **`Temporal.ZonedDateTime`** — a fully time-zone-aware instant. Prefer this when you care about DST, offsets, or display to users.
- **`Temporal.Instant`** — a specific point on the timeline (like `Date` but immutable and explicit).
- **`Temporal.Duration`** — a structured duration (`P1Y2M3DT4H5M6S`) with correct calendar arithmetic.

### Getting the current date and time

```js
const now = Temporal.Now.zonedDateTimeISO("America/Chicago");
console.log(now.toString());
// 2026-08-24T10:00:00-05:00[America/Chicago]

const today = Temporal.Now.plainDateISO();
console.log(today.toString());
// 2026-08-24
```

### Date arithmetic without the footguns

Adding a month to a date with `Date` is notoriously broken — add one month to January 31 and you end up in March. Temporal handles this correctly:

```js
const jan31 = Temporal.PlainDate.from("2026-01-31");
const nextMonth = jan31.add({ months: 1 });
console.log(nextMonth.toString()); // 2026-02-28
```

### Comparing and sorting

All Temporal objects support `.compare()`, making sorting straightforward:

```js
const dates = [Temporal.PlainDate.from("2026-03-15"), Temporal.PlainDate.from("2026-01-01"), Temporal.PlainDate.from("2026-07-04")];

dates.sort(Temporal.PlainDate.compare);
// [2026-01-01, 2026-03-15, 2026-07-04]
```

### Time zones done right

`ZonedDateTime` knows about DST transitions. When you add one day across a DST boundary, you get the correct wall-clock result — not "24 hours later" but "1 calendar day later":

```js
// Clocks spring forward at 2026-03-08T02:00 in America/Chicago
const beforeDst = Temporal.ZonedDateTime.from("2026-03-07T10:00:00[America/Chicago]");
const afterDst = beforeDst.add({ days: 1 });
console.log(afterDst.toString());
// 2026-03-08T10:00:00-05:00[America/Chicago]  ← still 10 AM, not 11 AM
```

## What about the browser?

Node.js shipping Temporal is a big signal, but browser support is still rolling out. At the time of writing, Temporal is behind a flag in some browsers and shipping in others. Check [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) for the current compatibility table before relying on it in client-side code. For Node.js 26 server-side code, you're good to go.

## Migrating away from `Date`

You don't need to rewrite everything at once. Temporal and `Date` can coexist, and you can convert between them:

```js
// Date → Temporal
const legacyDate = new Date();
const instant = Temporal.Instant.fromEpochMilliseconds(legacyDate.getTime());
const zdt = instant.toZonedDateTimeISO("America/Chicago");

// Temporal → Date
const backToDate = new Date(zdt.epochMilliseconds);
```

A reasonable migration strategy is to use Temporal for new code and any logic that handles user-facing dates or time zones, while leaving existing `Date` usage alone until you have reason to touch it.

## Wrapping up

The Temporal API solves real, longstanding problems with JavaScript's date and time story. With Node.js 26 shipping it enabled by default — and LTS status coming in October 2026 — this is a great time to start getting familiar with it. The [official Temporal cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html) is an excellent next step if you want to see more examples.

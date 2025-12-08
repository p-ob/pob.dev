// Service Worker for offline reading support
const CACHE_NAME = "pob-dev-v1";

// Assets to precache on install
const PRECACHE_ASSETS = ["/", "/blog", "/assets/css/global.css"];

// Install event - precache critical assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_ASSETS))
			.then(() => self.skipWaiting()),
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
		}),
	);
	return self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Only handle same-origin requests
	if (url.origin !== location.origin) {
		return;
	}

	// Skip non-GET requests
	if (request.method !== "GET") {
		return;
	}

	// Fonts - cache first (immutable)
	if (url.pathname.startsWith("/assets/fonts/")) {
		event.respondWith(cacheFirst(request));
		return;
	}

	// External libraries (Lit, etc.) - cache first (immutable)
	if (url.pathname.startsWith("/assets/external/")) {
		event.respondWith(cacheFirst(request));
		return;
	}

	// PageFind index files - stale-while-revalidate
	if (url.pathname.startsWith("/pagefind/")) {
		event.respondWith(staleWhileRevalidate(request));
		return;
	}

	// CSS/JS - stale-while-revalidate
	if (url.pathname.startsWith("/assets/")) {
		event.respondWith(staleWhileRevalidate(request));
		return;
	}

	// HTML pages (blog posts, etc.) - network first with cache fallback
	if (request.headers.get("accept")?.includes("text/html")) {
		event.respondWith(networkFirst(request));
		return;
	}

	// Default - network only
	event.respondWith(fetch(request));
});

// Cache-first strategy (for immutable assets like fonts)
async function cacheFirst(request) {
	const cached = await caches.match(request);
	if (cached) {
		return cached;
	}

	const response = await fetch(request);
	if (response.ok) {
		const cache = await caches.open(CACHE_NAME);
		cache.put(request, response.clone());
	}
	return response;
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
	const cache = await caches.open(CACHE_NAME);
	const cached = await cache.match(request);

	const fetchPromise = fetch(request).then((response) => {
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	});

	return cached || fetchPromise;
}

// Network-first strategy (for HTML pages)
async function networkFirst(request) {
	const cache = await caches.open(CACHE_NAME);

	try {
		const response = await fetch(request);
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		const cached = await cache.match(request);
		if (cached) {
			return cached;
		}
		// Return offline fallback if available
		return cache.match("/");
	}
}

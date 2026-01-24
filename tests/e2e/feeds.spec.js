import { test, expect } from "@playwright/test";

test.describe("RSS Feeds", () => {
	test.describe("RSS Feed", () => {
		test("should serve RSS feed at /feed.rss", async ({ request }) => {
			const response = await request.get("/feed.rss");
			expect(response.ok()).toBe(true);
		});

		test("should return valid XML for RSS feed", async ({ request }) => {
			const response = await request.get("/feed.rss");
			const content = await response.text();

			// Basic XML structure checks
			expect(content).toContain("<?xml");
			expect(content).toContain("<rss");
			expect(content).toContain("<channel>");
		});

		test("should contain feed metadata", async ({ request }) => {
			const response = await request.get("/feed.rss");
			const content = await response.text();

			expect(content).toContain("<title>");
			expect(content).toContain("<link>");
			expect(content).toContain("<description>");
		});

		test("should contain blog post items", async ({ request }) => {
			const response = await request.get("/feed.rss");
			const content = await response.text();

			// Should have at least one item
			expect(content).toContain("<item>");
			expect(content).toContain("</item>");
		});
	});

	test.describe("Atom Feed", () => {
		test("should serve Atom feed at /feed.atom", async ({ request }) => {
			const response = await request.get("/feed.atom");
			expect(response.ok()).toBe(true);
		});

		test("should return valid XML for Atom feed", async ({ request }) => {
			const response = await request.get("/feed.atom");
			const content = await response.text();

			// Basic Atom structure checks
			expect(content).toContain("<?xml");
			expect(content).toContain("<feed");
			expect(content).toContain('xmlns="http://www.w3.org/2005/Atom"');
		});

		test("should contain feed metadata", async ({ request }) => {
			const response = await request.get("/feed.atom");
			const content = await response.text();

			expect(content).toContain("<title>");
			expect(content).toContain("<id>");
			expect(content).toContain("<updated>");
		});

		test("should contain blog post entries", async ({ request }) => {
			const response = await request.get("/feed.atom");
			const content = await response.text();

			// Should have at least one entry
			expect(content).toContain("<entry>");
			expect(content).toContain("</entry>");
		});
	});

	test.describe("JSON Feed", () => {
		test("should serve JSON feed at /feed.json", async ({ request }) => {
			const response = await request.get("/feed.json");
			expect(response.ok()).toBe(true);
		});

		test("should return valid JSON", async ({ request }) => {
			const response = await request.get("/feed.json");
			const content = await response.text();

			// Should be parseable as JSON
			expect(() => JSON.parse(content)).not.toThrow();
		});

		test("should contain JSON Feed structure", async ({ request }) => {
			const response = await request.get("/feed.json");
			const feed = await response.json();

			expect(feed).toHaveProperty("version");
			expect(feed.version).toContain("jsonfeed.org");
			expect(feed).toHaveProperty("title");
			expect(feed).toHaveProperty("items");
		});

		test("should contain blog post items", async ({ request }) => {
			const response = await request.get("/feed.json");
			const feed = await response.json();

			expect(Array.isArray(feed.items)).toBe(true);
			expect(feed.items.length).toBeGreaterThan(0);
		});

		test("should have proper item structure", async ({ request }) => {
			const response = await request.get("/feed.json");
			const feed = await response.json();

			const firstItem = feed.items[0];
			expect(firstItem).toHaveProperty("id");
			expect(firstItem).toHaveProperty("url");
			expect(firstItem).toHaveProperty("title");
		});
	});

	test.describe("Feed Page", () => {
		test("should have feed page at /feed/", async ({ page }) => {
			await page.goto("/feed/");
			// Feed page has a description and feed cards, not an h1
			const feedPage = page.locator(".feed-page");
			await expect(feedPage).toBeVisible();
		});

		test("should display links to all feed formats", async ({ page }) => {
			await page.goto("/feed/");

			// Check for feed links (they're in .feed-card elements)
			const rssLink = page.locator('a[href="/feed.rss"]');
			const atomLink = page.locator('a[href="/feed.atom"]');
			const jsonLink = page.locator('a[href="/feed.json"]');

			await expect(rssLink).toBeVisible();
			await expect(atomLink).toBeVisible();
			await expect(jsonLink).toBeVisible();
		});
	});
});

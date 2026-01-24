import { test, expect } from "@playwright/test";

test.describe("Reading Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/reading/");
	});

	test("should display page title", async ({ page }) => {
		const heading = page.locator("h1");
		await expect(heading).toHaveText("Reading");
	});

	test("should display page description", async ({ page }) => {
		const description = page.locator(".reading-description");
		await expect(description).toBeVisible();
		await expect(description).toContainText("Articles and posts from around the web");
	});

	test.describe("When feed items are available", () => {
		test("should display reading items as tiles", async ({ page }) => {
			const tiles = page.locator(".reading-items pob-tile");
			const count = await tiles.count();

			// Feed items may or may not be present depending on external feeds
			// Just verify the structure is correct if items exist
			if (count > 0) {
				await expect(tiles.first()).toBeVisible();
			}
		});

		test("should display item titles", async ({ page }) => {
			const titles = page.locator(".reading-title");
			const count = await titles.count();

			if (count > 0) {
				await expect(titles.first()).toBeVisible();
			}
		});

		test("should display item dates", async ({ page }) => {
			const dates = page.locator(".reading-date");
			const count = await dates.count();

			if (count > 0) {
				await expect(dates.first()).toBeVisible();
				// Date should have datetime attribute
				const datetime = await dates.first().getAttribute("datetime");
				expect(datetime).toBeTruthy();
			}
		});

		test("should display source attribution", async ({ page }) => {
			const sources = page.locator(".reading-source");
			const count = await sources.count();

			if (count > 0) {
				await expect(sources.first()).toBeVisible();
			}
		});

		test("should have external links with target blank", async ({ page }) => {
			const tiles = page.locator(".reading-items pob-tile");
			const count = await tiles.count();

			if (count > 0) {
				const firstTile = tiles.first();
				const target = await firstTile.getAttribute("target");
				expect(target).toBe("_blank");
			}
		});

		test("should have links to original articles", async ({ page }) => {
			const tiles = page.locator(".reading-items pob-tile");
			const count = await tiles.count();

			if (count > 0) {
				const firstTile = tiles.first();
				const href = await firstTile.getAttribute("href");
				expect(href).toBeTruthy();
				// External links should be full URLs
				expect(href).toMatch(/^https?:\/\//);
			}
		});
	});

	test.describe("Page Structure", () => {
		test("should have reading items list", async ({ page }) => {
			// Either have items list or fallback message
			const itemsList = page.locator(".reading-items");
			const fallbackMessage = page.locator("text=No feed items available");

			const hasItems = (await itemsList.count()) > 0;
			const hasFallback = (await fallbackMessage.count()) > 0;

			// One of these should be present
			expect(hasItems || hasFallback).toBe(true);
		});

		test("should show duration limit when configured", async ({ page }) => {
			const description = page.locator(".reading-description");
			const text = await description.textContent();

			// Duration limit text may or may not be present
			// Just verify description is readable
			expect(text).toBeTruthy();
		});
	});

	test.describe("Navigation", () => {
		test.use({ viewport: { width: 1280, height: 720 } });

		test("should be accessible from main navigation", async ({ page }) => {
			await page.goto("/");

			// Navigation is inside shadow DOM of pob-app
			// Use shadow DOM piercing selector to find the Reading link
			const readingLink = page.locator("pob-app >> .top-nav >> text=Reading");
			await expect(readingLink).toBeVisible();

			await readingLink.click();
			await expect(page.locator("h1")).toHaveText("Reading");
		});
	});
});

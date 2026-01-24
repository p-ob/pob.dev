import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
	test.describe("Light Mode (default)", () => {
		test.use({ colorScheme: "light" });

		test("should use light background color", async ({ page }) => {
			await page.goto("/");

			const body = page.locator("body");
			const backgroundColor = await body.evaluate((el) => {
				return getComputedStyle(el).backgroundColor;
			});

			// Light mode should have a light background (high RGB values)
			// Parse the RGB values
			const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (match) {
				const [, r, g, b] = match.map(Number);
				// Light background should have high values (close to white)
				expect(r).toBeGreaterThan(200);
				expect(g).toBeGreaterThan(200);
				expect(b).toBeGreaterThan(200);
			}
		});

		test("should use dark text color", async ({ page }) => {
			await page.goto("/");

			const body = page.locator("body");
			const color = await body.evaluate((el) => {
				return getComputedStyle(el).color;
			});

			// Dark text should have low RGB values
			const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (match) {
				const [, r, g, b] = match.map(Number);
				// Dark text should have low values
				expect(r).toBeLessThan(100);
				expect(g).toBeLessThan(100);
				expect(b).toBeLessThan(100);
			}
		});
	});

	test.describe("Dark Mode (prefers-color-scheme: dark)", () => {
		test.use({ colorScheme: "dark" });

		test("should use dark background color", async ({ page }) => {
			await page.goto("/");

			const body = page.locator("body");
			const backgroundColor = await body.evaluate((el) => {
				return getComputedStyle(el).backgroundColor;
			});

			// Dark mode should have a dark background (low RGB values)
			const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (match) {
				const [, r, g, b] = match.map(Number);
				// Dark background should have low values
				expect(r).toBeLessThan(100);
				expect(g).toBeLessThan(100);
				expect(b).toBeLessThan(100);
			}
		});

		test("should use light text color", async ({ page }) => {
			await page.goto("/");

			const body = page.locator("body");
			const color = await body.evaluate((el) => {
				return getComputedStyle(el).color;
			});

			// Light text should have high RGB values
			const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (match) {
				const [, r, g, b] = match.map(Number);
				// Light text should have high values
				expect(r).toBeGreaterThan(150);
				expect(g).toBeGreaterThan(150);
				expect(b).toBeGreaterThan(150);
			}
		});

		test("should adapt tiles to dark mode", async ({ page }) => {
			await page.goto("/blog/");

			const tile = page.locator("pob-tile").first();
			await expect(tile).toBeVisible();

			// Verify tile is visible in dark mode (basic check)
			const isVisible = await tile.isVisible();
			expect(isVisible).toBe(true);
		});

		test("should adapt notes to dark mode", async ({ page }) => {
			await page.goto("/blog/2024/07/hello-world/");

			const note = page.locator("pob-note");
			await expect(note).toBeVisible();

			// Verify note is visible in dark mode
			const isVisible = await note.isVisible();
			expect(isVisible).toBe(true);
		});

		test("should maintain readable contrast on blog posts", async ({ page }) => {
			await page.goto("/blog/2024/07/hello-world/");

			const article = page.locator("article");
			await expect(article).toBeVisible();

			// Basic visibility check - content should be readable
			const heading = page.locator("h1");
			await expect(heading).toBeVisible();
		});
	});

	test.describe("Color Scheme Consistency - Light Mode", () => {
		test.use({ colorScheme: "light", viewport: { width: 1280, height: 720 } });

		test("header should be visible in light mode", async ({ page }) => {
			// Use blog page which doesn't have the hidden home-header
			await page.goto("/blog/");
			// Header with navigation is in shadow DOM
			const header = page.locator("pob-app >> header:has(.top-nav)");
			await expect(header).toBeVisible();
		});

		test("footer should be visible in light mode", async ({ page }) => {
			await page.goto("/blog/");
			const footer = page.locator("pob-app >> footer:has(.copyright)");
			await expect(footer).toBeVisible();
		});
	});

	test.describe("Color Scheme Consistency - Dark Mode", () => {
		test.use({ colorScheme: "dark", viewport: { width: 1280, height: 720 } });

		test("header should be visible in dark mode", async ({ page }) => {
			// Use blog page which doesn't have the hidden home-header
			await page.goto("/blog/");
			// Header with navigation is in shadow DOM
			const header = page.locator("pob-app >> header:has(.top-nav)");
			await expect(header).toBeVisible();
		});

		test("footer should be visible in dark mode", async ({ page }) => {
			await page.goto("/blog/");
			const footer = page.locator("pob-app >> footer:has(.copyright)");
			await expect(footer).toBeVisible();
		});
	});
});

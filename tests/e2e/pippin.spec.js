import { test, expect } from "@playwright/test";

test.describe("Pippin easter egg", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/search/");
	});

	test("should appear when searching for Pippin", async ({ page }) => {
		await page.fill("pagefind-input input", "Pippin");

		const pippin = page.locator("pob-pippin");
		await expect(pippin).toHaveAttribute("data-state", "shown");
	});

	test("should not appear for unrelated searches", async ({ page }) => {
		await page.fill("pagefind-input input", "blog");
		await page.waitForTimeout(300);

		await expect(page.locator("pob-pippin")).toHaveCount(0);
	});

	test("should be a link to the hidden Pippin page", async ({ page }) => {
		await page.fill("pagefind-input input", "Pippin");

		const link = page.locator("pob-pippin a");
		await expect(link).toHaveAttribute("href", "/pippin/");
	});

	test("should navigate to the hidden Pippin page when clicked", async ({ page }) => {
		await page.fill("pagefind-input input", "Pippin");
		await expect(page.locator("pob-pippin")).toHaveAttribute("data-state", "shown");

		// Click via the DOM directly rather than Playwright's pointer-driven
		// click: the sprite bobs continuously and flies off-screen again after
		// its auto-dismiss timer, both of which make a real pointer click flaky
		// under parallel test load.
		await page.evaluate(() => document.querySelector("pob-pippin").shadowRoot.querySelector("a").click());
		await expect(page).toHaveURL(/\/pippin\/$/);
	});

	test("should not surface the hidden page in search results", async ({ page }) => {
		await page.fill("pagefind-input input", "secret dog");
		await page.waitForTimeout(300);

		const results = page.locator("pagefind-results");
		await expect(results).not.toContainText("Pippin");
	});
});

test.describe("Pippin page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/pippin/");
	});

	test("should not be indexed by search engines", async ({ page }) => {
		const robots = page.locator('meta[name="robots"]');
		await expect(robots).toHaveAttribute("content", /noindex/);
	});

	test("should show Pippin's photo with alt text and a caption", async ({ page }) => {
		const photo = page.locator("figure.pippin-photo img");
		await expect(photo).toBeVisible();
		await expect(photo).toHaveAttribute("alt", "A Bernese Mountain Dog puppy wearing a pinwheel beanie cap");

		const caption = page.locator("figure.pippin-photo figcaption");
		await expect(caption).toHaveText("Pippin in 2022");
	});
});

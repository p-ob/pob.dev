import { test, expect } from "@playwright/test";

test.describe("Search Page", () => {
	test("should autofocus the search input", async ({ page }) => {
		await page.goto("/search/");

		const input = page.locator("pagefind-input input");
		await expect(input).toBeFocused();
	});

	test("should populate and focus the input from a deep link (?q=)", async ({ page }) => {
		await page.goto("/search/?q=blog");

		const input = page.locator("pagefind-input input");
		await expect(input).toHaveValue("blog");
		await expect(input).toBeFocused();
	});

	test("should not surface the resume page in search results", async ({ page }) => {
		await page.goto("/search/");
		await page.fill("pagefind-input input", "Zywave");
		await page.waitForTimeout(300);

		await expect(page.locator("pagefind-results")).not.toContainText("Zywave");
	});
});

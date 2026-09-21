import { test, expect } from "@playwright/test";

test.describe("Resume page", () => {
	test("should not be indexed by search engines", async ({ page }) => {
		await page.goto("/resume/");

		await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
	});
});

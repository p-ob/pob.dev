import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("/");

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Patrick O'Brien/);
});

test("does not show the resume link", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("link", { name: "View my résumé" })).toHaveCount(0);
});

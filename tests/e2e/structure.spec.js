import { test, expect } from "@playwright/test";

test.describe("Site Structure", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("Desktop", () => {
        test.use({ viewport: { width: 1280, height: 720 } });

        test("should show header and footer", async ({ page }) => {
            const header = page.locator("pob-app >> header:has(.top-nav)");
            const footer = page.locator("pob-app >> footer:has(.copyright)");

            await expect(header).toBeVisible();
            await expect(footer).toBeVisible();
        });

        test("should show top navigation", async ({ page }) => {
            const nav = page.locator("pob-app >> .top-nav");
            await expect(nav).toBeVisible();

            // Check for specific nav items
            await expect(nav.getByText("Blog")).toBeVisible();
            await expect(nav.getByText("Reading")).toBeVisible();
            await expect(nav.getByText("About")).toBeVisible();
        });

        test("should hide hamburger menu", async ({ page }) => {
            const hamburger = page.locator("pob-app >> .hamburger-menu");
            await expect(hamburger).not.toBeVisible();
        });
    });

    test.describe("Mobile", () => {
        test.use({ viewport: { width: 375, height: 667 } });

        test("should show hamburger menu and hide top nav", async ({ page }) => {
            const hamburger = page.locator("pob-app >> .hamburger-menu");
            const topNav = page.locator("pob-app >> .top-nav");

            await expect(hamburger).toBeVisible();
            await expect(topNav).not.toBeVisible();
        });

        test("should open mobile navigation", async ({ page }) => {
            const hamburger = page.locator("pob-app >> .hamburger-menu");
            const dialog = page.locator("pob-app >> #mobile-nav-dialog");

            await expect(dialog).not.toHaveAttribute("open");

            await hamburger.click();

            await expect(dialog).toHaveAttribute("open");

            // Check for nav items in mobile menu
            const mobileNav = page.locator("pob-app >> .mobile-nav");
            await expect(mobileNav.getByText("Blog")).toBeVisible();
        });
    });
});

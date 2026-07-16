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
		await page.fill("pagefind-input input", "Pippin in 2022");
		await page.waitForTimeout(300);

		const results = page.locator("pagefind-results");
		await expect(results).not.toContainText("Pippin");
	});

	test("should appear from a deep link (?q=Pippin) without typing", async ({ page }) => {
		await page.goto("/search/?q=Pippin");

		await expect(page.locator("pob-pippin")).toHaveAttribute("data-state", "shown");
	});

	test("should stay above a simulated on-screen keyboard", async ({ page }) => {
		// position: fixed anchors to the layout viewport, which most mobile
		// browsers don't shrink when the keyboard opens -- only the visual
		// viewport does. Stub visualViewport so we can simulate that shrink
		// without a real device, since Playwright can't open an actual IME.
		await page.addInitScript(() => {
			class FakeViewport extends EventTarget {
				constructor() {
					super();
					this.height = window.innerHeight;
					this.width = window.innerWidth;
					this.offsetTop = 0;
				}
			}
			window.__fakeViewport = new FakeViewport();
			Object.defineProperty(window, "visualViewport", {
				configurable: true,
				get: () => window.__fakeViewport,
			});
		});
		await page.goto("/search/");
		await page.fill("pagefind-input input", "Pippin");
		await expect(page.locator("pob-pippin")).toHaveAttribute("data-state", "shown");
		// let the entrance animation settle into its resting position before
		// measuring, or the fly-in transform makes the box position transient
		await page.waitForTimeout(1000);

		const keyboardHeight = 300;
		await page.evaluate((h) => {
			window.__fakeViewport.height = window.innerHeight - h;
			window.__fakeViewport.dispatchEvent(new Event("resize"));
		}, keyboardHeight);
		await page.waitForTimeout(100);

		const [box, viewportHeight] = await Promise.all([
			page.locator("pob-pippin").boundingBox(),
			page.evaluate(() => window.innerHeight),
		]);
		expect(box.y + box.height).toBeLessThanOrEqual(viewportHeight - keyboardHeight + 1);
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

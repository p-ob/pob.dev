import { test, describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";
import { DraftPlugin } from "../../11ty/draft.js";

describe("DraftPlugin", () => {
	let originalBuildDrafts;

	beforeEach(() => {
		// Save original BUILD_DRAFTS value
		originalBuildDrafts = process.env.BUILD_DRAFTS;
		// Clear it for tests
		delete process.env.BUILD_DRAFTS;
	});

	afterEach(() => {
		// Restore original BUILD_DRAFTS value
		if (originalBuildDrafts !== undefined) {
			process.env.BUILD_DRAFTS = originalBuildDrafts;
		} else {
			delete process.env.BUILD_DRAFTS;
		}
	});

	describe("plugin registration", () => {
		it("should register eleventyComputed.permalink global data", () => {
			const mockEleventy = new EleventyMock();

			DraftPlugin(mockEleventy);

			assert.ok(mockEleventy.globalData.has("eleventyComputed.permalink"));
		});

		it("should register eleventyComputed.eleventyExcludeFromCollections global data", () => {
			const mockEleventy = new EleventyMock();

			DraftPlugin(mockEleventy);

			assert.ok(mockEleventy.globalData.has("eleventyComputed.eleventyExcludeFromCollections"));
		});

		it("should register eleventy.before event listener", () => {
			const mockEleventy = new EleventyMock();

			DraftPlugin(mockEleventy);

			assert.ok(mockEleventy.eventListeners.has("eleventy.before"));
			assert.strictEqual(mockEleventy.eventListeners.get("eleventy.before").length, 1);
		});
	});

	describe("eleventyComputed.permalink", () => {
		it("should return false for draft posts when BUILD_DRAFTS is not set", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const permalinkFactory = mockEleventy.globalData.get("eleventyComputed.permalink");
			const permalinkFn = permalinkFactory();

			const result = permalinkFn({ draft: true, permalink: "/blog/my-post/" });

			assert.strictEqual(result, false);
		});

		it("should return original permalink for draft posts when BUILD_DRAFTS is set", () => {
			process.env.BUILD_DRAFTS = "true";
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const permalinkFactory = mockEleventy.globalData.get("eleventyComputed.permalink");
			const permalinkFn = permalinkFactory();

			const result = permalinkFn({ draft: true, permalink: "/blog/my-post/" });

			assert.strictEqual(result, "/blog/my-post/");
		});

		it("should return original permalink for non-draft posts when BUILD_DRAFTS is not set", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const permalinkFactory = mockEleventy.globalData.get("eleventyComputed.permalink");
			const permalinkFn = permalinkFactory();

			const result = permalinkFn({ draft: false, permalink: "/blog/my-post/" });

			assert.strictEqual(result, "/blog/my-post/");
		});

		it("should return original permalink for posts without draft flag", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const permalinkFactory = mockEleventy.globalData.get("eleventyComputed.permalink");
			const permalinkFn = permalinkFactory();

			const result = permalinkFn({ permalink: "/blog/my-post/" });

			assert.strictEqual(result, "/blog/my-post/");
		});
	});

	describe("eleventyComputed.eleventyExcludeFromCollections", () => {
		it("should return true for draft posts when BUILD_DRAFTS is not set", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const excludeFactory = mockEleventy.globalData.get("eleventyComputed.eleventyExcludeFromCollections");
			const excludeFn = excludeFactory();

			const result = excludeFn({ draft: true, eleventyExcludeFromCollections: false });

			assert.strictEqual(result, true);
		});

		it("should return original value for draft posts when BUILD_DRAFTS is set", () => {
			process.env.BUILD_DRAFTS = "true";
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const excludeFactory = mockEleventy.globalData.get("eleventyComputed.eleventyExcludeFromCollections");
			const excludeFn = excludeFactory();

			const result = excludeFn({ draft: true, eleventyExcludeFromCollections: false });

			assert.strictEqual(result, false);
		});

		it("should return original value for non-draft posts", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const excludeFactory = mockEleventy.globalData.get("eleventyComputed.eleventyExcludeFromCollections");
			const excludeFn = excludeFactory();

			const result = excludeFn({ draft: false, eleventyExcludeFromCollections: true });

			assert.strictEqual(result, true);
		});

		it("should return undefined for posts without eleventyExcludeFromCollections", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			const excludeFactory = mockEleventy.globalData.get("eleventyComputed.eleventyExcludeFromCollections");
			const excludeFn = excludeFactory();

			const result = excludeFn({ draft: false });

			assert.strictEqual(result, undefined);
		});
	});

	describe("eleventy.before event", () => {
		it("should set BUILD_DRAFTS=true when runMode is serve", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			mockEleventy.emit("eleventy.before", { runMode: "serve" });

			assert.strictEqual(process.env.BUILD_DRAFTS, "true");
		});

		it("should set BUILD_DRAFTS=true when runMode is watch", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			mockEleventy.emit("eleventy.before", { runMode: "watch" });

			assert.strictEqual(process.env.BUILD_DRAFTS, "true");
		});

		it("should not set BUILD_DRAFTS when runMode is build", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			mockEleventy.emit("eleventy.before", { runMode: "build" });

			assert.strictEqual(process.env.BUILD_DRAFTS, undefined);
		});

		it("should not set BUILD_DRAFTS when runMode is undefined", () => {
			const mockEleventy = new EleventyMock();
			DraftPlugin(mockEleventy);

			mockEleventy.emit("eleventy.before", {});

			assert.strictEqual(process.env.BUILD_DRAFTS, undefined);
		});
	});
});

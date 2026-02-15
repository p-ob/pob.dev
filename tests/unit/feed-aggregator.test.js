import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";

// Mutable mock state
let mockShouldThrow = false;
// Use dynamic date to avoid timezone/date based CI failures
const today = new Date().toISOString();
const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days in the future
let mockFeedItems = [
	{ title: "Post 1", link: "https://example.com/1", isoDate: today },
	{ title: "Old Post", link: "https://example.com/2", isoDate: "2020-01-01T12:00:00Z" },
	{ title: "Future Post", link: "https://example.com/3", isoDate: futureDate },
];
let mockFsContent = {
	feeds: [{ name: "Test Blog", url: "https://example.com/rss", siteUrl: "https://example.com" }],
};

// Mock fs/promises
mock.module("fs/promises", {
	namedExports: {
		readFile: async () => JSON.stringify(mockFsContent),
	},
});

class MockParser {
	async parseURL() {
		if (mockShouldThrow) {
			throw new Error("Network error");
		}
		return {
			items: mockFeedItems,
			title: "Test Feed",
		};
	}
}

mock.module("rss-parser", {
	defaultExport: MockParser,
});

import { FeedAggregatorPlugin } from "../../11ty/feed-aggregator.js";

describe("FeedAggregatorPlugin", () => {
	it("should aggregate feeds and filter by duration", async () => {
		mockShouldThrow = false;
		const mockEleventy = new EleventyMock();

		FeedAggregatorPlugin(mockEleventy, {
			durationLimit: "P1Y", // 1 Year
		});

		// Get the global data function
		const dataFn = mockEleventy.globalData.get("aggregatedFeeds");
		assert.ok(dataFn);

		// Execute the function
		const results = await dataFn();

		assert.strictEqual(results.length, 1, "Should filter out old and future posts");
		assert.strictEqual(results[0].title, "Post 1");
	});

	it("should filter out future-dated posts", async () => {
		mockShouldThrow = false;
		const mockEleventy = new EleventyMock();

		FeedAggregatorPlugin(mockEleventy, {});

		// Emit event to clear cache
		mockEleventy.emit("eleventy.beforeWatch", ["feeds.json"]);

		// Get the global data function
		const dataFn = mockEleventy.globalData.get("aggregatedFeeds");
		assert.ok(dataFn);

		// Execute the function
		const results = await dataFn();

		// Should include today's post but exclude the future post
		assert.strictEqual(results.length, 1, "Should filter out future posts");
		assert.strictEqual(results[0].title, "Post 1", "Should only include current post");
		assert.ok(!results.some((item) => item.title === "Future Post"), "Should not include future posts");
	});

	it("should handle fetch errors gracefully", async () => {
		mockShouldThrow = true;
		const mockEleventy = new EleventyMock();
		FeedAggregatorPlugin(mockEleventy, {});

		// Emit event to clear cache (since the plugin caches the result in module scope)
		mockEleventy.emit("eleventy.beforeWatch", ["feeds.json"]);

		const dataFn = mockEleventy.globalData.get("aggregatedFeeds");
		const results = await dataFn();

		// Should return empty array on failure
		assert.deepStrictEqual(results, []);
	});
});

import { test, describe, it, mock } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";

// Mock the RSS plugin before importing FeedsPlugin
const mockFeedPlugin = mock.fn();
mock.module("@11ty/eleventy-plugin-rss", {
	namedExports: {
		feedPlugin: mockFeedPlugin,
	},
});

// Import after mocking
const { FeedsPlugin } = await import("../../11ty/feeds.js");

describe("FeedsPlugin", () => {
	it("should register three plugins (rss, json, atom)", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		FeedsPlugin(mockEleventy, {
			outputPath: "feed",
			base: "https://example.com/",
			author: { name: "Test Author", email: "test@example.com" },
			collection: { name: "post", limit: 10 },
			metadata: { language: "en", title: "Test Site", subtitle: "Test Description" },
		});

		// Should have registered 3 plugins (rss, json, atom)
		assert.strictEqual(mockEleventy.plugins.length, 3);
	});

	it("should pass correct output paths for each feed type", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		FeedsPlugin(mockEleventy, {
			outputPath: "feed",
			base: "https://example.com/",
			author: { name: "Test Author", email: "test@example.com" },
			collection: { name: "post", limit: 10 },
			metadata: { language: "en", title: "Test Site", subtitle: "Test Description" },
		});

		const outputPaths = mockEleventy.plugins.map((p) => p.options.outputPath);
		assert.deepStrictEqual(outputPaths.sort(), ["feed.atom", "feed.json", "feed.rss"]);
	});

	it("should pass correct feed types", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		FeedsPlugin(mockEleventy, {
			outputPath: "feed",
			base: "https://example.com/",
			author: { name: "Test Author", email: "test@example.com" },
			collection: { name: "post", limit: 10 },
			metadata: { language: "en", title: "Test Site", subtitle: "Test Description" },
		});

		const types = mockEleventy.plugins.map((p) => p.options.type);
		assert.deepStrictEqual(types.sort(), ["atom", "json", "rss"]);
	});

	it("should forward collection options correctly", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		const collection = { name: "blog", limit: 5 };

		FeedsPlugin(mockEleventy, {
			outputPath: "blog-feed",
			base: "https://example.com/",
			author: { name: "Test Author", email: "test@example.com" },
			collection,
			metadata: { language: "en", title: "Test Site", subtitle: "Test Description" },
		});

		// All plugins should receive the same collection
		for (const plugin of mockEleventy.plugins) {
			assert.deepStrictEqual(plugin.options.collection, collection);
		}
	});

	it("should include author and base in metadata", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		const author = { name: "Test Author", email: "test@example.com" };
		const base = "https://mysite.com/";

		FeedsPlugin(mockEleventy, {
			outputPath: "feed",
			base,
			author,
			collection: { name: "post", limit: 10 },
			metadata: { language: "en", title: "My Site", subtitle: "Site Description" },
		});

		for (const plugin of mockEleventy.plugins) {
			assert.strictEqual(plugin.options.metadata.author, author);
			assert.strictEqual(plugin.options.metadata.base, base);
		}
	});

	it("should merge custom metadata with author and base", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		FeedsPlugin(mockEleventy, {
			outputPath: "feed",
			base: "https://example.com/",
			author: { name: "Test" },
			collection: { name: "post", limit: 10 },
			metadata: { language: "fr", title: "French Site", subtitle: "Bonjour", customField: "custom" },
		});

		for (const plugin of mockEleventy.plugins) {
			assert.strictEqual(plugin.options.metadata.language, "fr");
			assert.strictEqual(plugin.options.metadata.title, "French Site");
			assert.strictEqual(plugin.options.metadata.subtitle, "Bonjour");
			assert.strictEqual(plugin.options.metadata.customField, "custom");
		}
	});

	it("should use feedPlugin from @11ty/eleventy-plugin-rss", () => {
		const mockEleventy = new EleventyMock();
		mockFeedPlugin.mock.resetCalls();

		FeedsPlugin(mockEleventy, {
			outputPath: "feed",
			base: "https://example.com/",
			author: { name: "Test" },
			collection: { name: "post", limit: 10 },
			metadata: { language: "en", title: "Test" },
		});

		// Verify feedPlugin was registered for each type
		for (const plugin of mockEleventy.plugins) {
			assert.strictEqual(plugin.plugin, mockFeedPlugin);
		}
	});
});

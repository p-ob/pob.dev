import { test, describe, it } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";
import { sanitize, JsonHtmlPlugin } from "../../11ty/json-html.js";

describe("sanitize function", () => {
	it("should return null for null input", () => {
		assert.strictEqual(sanitize(null), null);
	});

	it("should return null for undefined input", () => {
		assert.strictEqual(sanitize(undefined), null);
	});

	it("should return null for empty string", () => {
		assert.strictEqual(sanitize(""), null);
	});

	it("should return null for zero", () => {
		assert.strictEqual(sanitize(0), null);
	});

	it("should return null for false", () => {
		assert.strictEqual(sanitize(false), null);
	});

	it("should pass through strings with single quotes", () => {
		// Note: The template literal escape sequences in the source don't actually escape
		// In template literals, \' is just ' - so the replace is effectively a no-op
		assert.strictEqual(sanitize("it's a test"), "it's a test");
	});

	it("should pass through strings with double quotes", () => {
		assert.strictEqual(sanitize('say "hello"'), 'say "hello"');
	});

	it("should pass through strings with both quote types", () => {
		assert.strictEqual(sanitize(`it's "quoted"`), `it's "quoted"`);
	});

	it("should return string unchanged if no quotes", () => {
		assert.strictEqual(sanitize("hello world"), "hello world");
	});

	it("should JSON.stringify objects", () => {
		const obj = { key: "value" };
		const result = sanitize(obj);
		assert.strictEqual(result, '{"key":"value"}');
	});

	it("should JSON.stringify arrays", () => {
		const arr = ["a", "b"];
		const result = sanitize(arr);
		assert.strictEqual(result, '["a","b"]');
	});

	it("should JSON.stringify numbers (truthy)", () => {
		const result = sanitize(42);
		assert.strictEqual(result, "42");
	});

	it("should JSON.stringify boolean true", () => {
		const result = sanitize(true);
		assert.strictEqual(result, "true");
	});

	it("should handle objects with nested quotes in values", () => {
		const obj = { message: 'it\'s a "test"' };
		const result = sanitize(obj);
		// JSON.stringify escapes the inner double quotes
		assert.strictEqual(result, '{"message":"it\'s a \\"test\\""}');
	});

	it("should handle deeply nested objects", () => {
		const obj = { outer: { inner: "value" } };
		const result = sanitize(obj);
		assert.strictEqual(result, '{"outer":{"inner":"value"}}');
	});
});

describe("JsonHtmlPlugin", () => {
	it("should register filter with default name json_html", () => {
		const mockEleventy = new EleventyMock();

		JsonHtmlPlugin(mockEleventy);

		assert.ok(mockEleventy.filters.has("json_html"));
		assert.strictEqual(mockEleventy.filters.get("json_html"), sanitize);
	});

	it("should register filter with custom name when provided", () => {
		const mockEleventy = new EleventyMock();

		JsonHtmlPlugin(mockEleventy, { filterName: "custom_filter" });

		assert.ok(mockEleventy.filters.has("custom_filter"));
		assert.strictEqual(mockEleventy.filters.get("custom_filter"), sanitize);
	});

	it("should use default name when options is empty object", () => {
		const mockEleventy = new EleventyMock();

		JsonHtmlPlugin(mockEleventy, {});

		assert.ok(mockEleventy.filters.has("json_html"));
	});

	it("should use default name when filterName is undefined", () => {
		const mockEleventy = new EleventyMock();

		JsonHtmlPlugin(mockEleventy, { filterName: undefined });

		assert.ok(mockEleventy.filters.has("json_html"));
	});
});

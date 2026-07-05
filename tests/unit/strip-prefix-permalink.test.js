import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { stripPrefixPermalink } from "../../11ty/strip-prefix-permalink.js";

describe("stripPrefixPermalink", () => {
	let originalBuildDrafts;

	beforeEach(() => {
		originalBuildDrafts = process.env.BUILD_DRAFTS;
		delete process.env.BUILD_DRAFTS;
	});

	afterEach(() => {
		if (originalBuildDrafts !== undefined) {
			process.env.BUILD_DRAFTS = originalBuildDrafts;
		} else {
			delete process.env.BUILD_DRAFTS;
		}
	});

	it("strips the given prefix from the file path stem", () => {
		const permalinkFn = stripPrefixPermalink("/blog");

		const result = permalinkFn({ page: { filePathStem: "/blog/2024/07/hello-world" } });

		assert.strictEqual(result, "/2024/07/hello-world/");
	});

	it("uses a different prefix for a different content type", () => {
		const permalinkFn = stripPrefixPermalink("/talks");

		const result = permalinkFn({ page: { filePathStem: "/talks/2019/10/cream-city-code" } });

		assert.strictEqual(result, "/2019/10/cream-city-code/");
	});

	it("passes through an explicit permalink instead of rewriting it", () => {
		const permalinkFn = stripPrefixPermalink("/blog");

		const result = permalinkFn({
			permalink: "/blog/tags/meta/",
			page: { filePathStem: "/blog/_tagged-posts" },
		});

		assert.strictEqual(result, "/blog/tags/meta/");
	});

	it("returns false for draft content when BUILD_DRAFTS is not set", () => {
		const permalinkFn = stripPrefixPermalink("/blog");

		const result = permalinkFn({ draft: true, page: { filePathStem: "/blog/2024/07/hello-world" } });

		assert.strictEqual(result, false);
	});

	it("computes the permalink for draft content when BUILD_DRAFTS is set", () => {
		process.env.BUILD_DRAFTS = "true";
		const permalinkFn = stripPrefixPermalink("/blog");

		const result = permalinkFn({ draft: true, page: { filePathStem: "/blog/2024/07/hello-world" } });

		assert.strictEqual(result, "/2024/07/hello-world/");
	});

	it("leaves the path unchanged when it doesn't start with the prefix", () => {
		const permalinkFn = stripPrefixPermalink("/blog");

		const result = permalinkFn({ page: { filePathStem: "/about" } });

		assert.strictEqual(result, "/about/");
	});
});

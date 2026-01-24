import { test, describe, it } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";
import { TableOfContentsPlugin } from "../../11ty/table-of-contents.js";

describe("TableOfContentsPlugin", () => {
	it("should register the tableOfContents transform", () => {
		const mockEleventy = new EleventyMock();
		TableOfContentsPlugin(mockEleventy, {});
		assert.ok(mockEleventy.transforms.has("tableOfContents"));
	});

	it("should generate a TOC for valid headings", () => {
		const mockEleventy = new EleventyMock();
		TableOfContentsPlugin(mockEleventy, {});
		const transform = mockEleventy.transforms.get("tableOfContents");

		const inputHtml = `
            <body>
                <h1>Title</h1>
                <h2>Section 1</h2>
                <h3>Subsection 1.1</h3>
                <h2>Section 2</h2>
            </body>
        `;

		const outputHtml = transform(inputHtml, "test.html");

		// Ideally we use a simple parser or regex to verify, or snapshoting.
		// Checking for existence of generated IDs and TOC structure.

		assert.match(outputHtml, /id="Section-1"/);
		assert.match(outputHtml, /id="Subsection-11"/);
		assert.match(outputHtml, /href="#Section-1"/);
		assert.match(outputHtml, /<ol>/);
	});

	it("should handle duplicate headings by appending numbers", () => {
		const mockEleventy = new EleventyMock();
		TableOfContentsPlugin(mockEleventy, {});
		const transform = mockEleventy.transforms.get("tableOfContents");

		const inputHtml = `
            <body>
                <h2>Duplicate</h2>
                <h2>Duplicate</h2>
            </body>
        `;

		const outputHtml = transform(inputHtml, "test.html");

		assert.match(outputHtml, /id="Duplicate"/);
		assert.match(outputHtml, /id="Duplicate-1"/);
	});

	it("should ignore non-html files", () => {
		const mockEleventy = new EleventyMock();
		TableOfContentsPlugin(mockEleventy, {});
		const transform = mockEleventy.transforms.get("tableOfContents");

		const content = "some content";
		const result = transform(content, "style.css");
		assert.strictEqual(result, content);
	});
});

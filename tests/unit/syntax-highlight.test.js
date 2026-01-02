
import { test, describe, it } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";
import { SyntaxHighlightPlugin } from "../../11ty/syntax-highlight.js";

describe("SyntaxHighlightPlugin", () => {
    it("should amend the md library", () => {
        const mockEleventy = new EleventyMock();
        SyntaxHighlightPlugin(mockEleventy);
        assert.ok(mockEleventy.libraryAmendments.has("md"));
    });

    it("should configure the fence renderer to output custom elements", () => {
        const mockEleventy = new EleventyMock();
        SyntaxHighlightPlugin(mockEleventy);

        const amendment = mockEleventy.libraryAmendments.get("md")[0];

        // Mock the markdown-it instance
        const mockMdLib = {
            renderer: {
                rules: {
                    fence: null // Will be overwritten
                }
            }
        };

        // Apply amendment
        amendment(mockMdLib);

        assert.ok(typeof mockMdLib.renderer.rules.fence === "function");

        // Test the fence renderer
        const fenceFn = mockMdLib.renderer.rules.fence;
        const tokens = [
            {
                info: "js",
                content: "console.log('hi');"
            }
        ];

        const output = fenceFn(tokens, 0, {}, {}, {});

        // Check for escaped content
        assert.ok(output.includes('<syntax-highlight language="javascript"'));
        // The plugin escapes single quotes, so we expect that
        assert.ok(output.includes("console.log(&#039;hi&#039;);"));
        assert.ok(output.includes("</syntax-highlight>"));
    });

    it("should handle 'live' code blocks", () => {
        const mockEleventy = new EleventyMock();
        SyntaxHighlightPlugin(mockEleventy);
        const amendment = mockEleventy.libraryAmendments.get("md")[0];
        const mockMdLib = { renderer: { rules: { fence: null } } };
        amendment(mockMdLib);

        const fenceFn = mockMdLib.renderer.rules.fence;
        const tokens = [
            {
                info: "js live",
                content: "alert('hi');"
            }
        ];

        const output = fenceFn(tokens, 0, {}, {}, {});
        assert.ok(output.includes('<pob-demo>'));
        assert.ok(output.includes('</pob-demo>'));
    });
});

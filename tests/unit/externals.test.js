
import { test, describe, it, before } from "node:test";
import assert from "node:assert";
import { EleventyMock } from "./mocks/eleventy.mock.js";
import { ExternalsPlugin } from "../../11ty/externals.js";
import fs from "node:fs";
import path from "node:path";

// Mock generic fs operations if needed, but ExternalsPlugin reads real package.json files
// We will rely on the real `node_modules` existing in the project for this test,
// or we can mock `fs.readFileSync`.
// Given the complexity of mocking fs modules in ESM without a loader, 
// and that we want to test "real" resolution, we'll try to pick a safe package that exists (like "lit" or "slugify").

describe("ExternalsPlugin", () => {
    it("should register passthrough copies and global data for specified packages", (t) => {
        const mockEleventy = new EleventyMock();

        // Use a package we know exists in devDependencies
        const packages = ["slugify"];

        ExternalsPlugin(mockEleventy, { packages });

        // Verify passthrough copy
        assert.strictEqual(mockEleventy.passthroughCopies.length, 1);
        const copy = mockEleventy.passthroughCopies[0];
        assert.ok(copy["node_modules/slugify"]);

        // Verify output path format (approximate)
        const outputPath = copy["node_modules/slugify"];
        assert.match(outputPath, /^assets\/external\/slugify-/);

        // Verify global data
        const externalsData = mockEleventy.globalData.get("externals");
        assert.ok(externalsData);
        assert.ok(externalsData.importMap);
        assert.ok(externalsData.importMap.imports["slugify"]);

        // Check import path formatting
        const importPath = externalsData.importMap.imports["slugify"];
        // Slugify uses "slugify.js" as entry, but might be resolved differently depending on version
        // We match for the structure: /assets/external/slugify-<version>/...
        assert.match(importPath, /^\/assets\/external\/slugify-[^\/]+\/.+/);
    });

    it("should handle scoped packages", () => {
        const mockEleventy = new EleventyMock();
        // @11ty/eleventy is definitely installed
        const packages = ["@11ty/eleventy"];

        ExternalsPlugin(mockEleventy, { packages });

        const copy = mockEleventy.passthroughCopies[0];
        assert.ok(copy["node_modules/@11ty/eleventy"]);

        const outputPath = copy["node_modules/@11ty/eleventy"];
        assert.match(outputPath, /^assets\/external\/@11ty\/eleventy-/);
    });

    it("should warn and do nothing if no packages provided", (t) => {
        const mockEleventy = new EleventyMock();
        const warnMock = t.mock.method(console, 'warn', () => { });

        ExternalsPlugin(mockEleventy, {});

        assert.strictEqual(mockEleventy.passthroughCopies.length, 0);
        assert.strictEqual(warnMock.mock.calls.length, 1);
    });
});

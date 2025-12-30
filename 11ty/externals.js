import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Resolves the entry point from a package.json exports field.
 * Handles nested conditional exports (browser, import, default, etc.)
 */
function resolveEntryPoint(exports) {
	if (typeof exports === "string") {
		return exports;
	}

	if (typeof exports === "object") {
		// Priority: browser.default -> browser -> import -> default
		if (exports.browser) {
			if (typeof exports.browser === "string") {
				return exports.browser;
			}
			if (exports.browser.default) {
				return exports.browser.default;
			}
		}
		if (exports.import) {
			return exports.import;
		}
		if (exports.default) {
			return exports.default;
		}
	}

	return null;
}

/**
 * Plugin to manage external dependencies with versioned paths for cache busting.
 *
 * @param {Object} options
 * @param {string[]} options.packages - List of package names to externalize (e.g., ["lit", "@lit/reactive-element"])
 *
 * @example
 * eleventyConfig.addPlugin(ExternalsPlugin, {
 *   packages: ["lit", "lit-html", "lit-element", "@lit/reactive-element", "@lit-labs/ssr-client", "@lit-labs/ssr-dom-shim"]
 * });
 */
export function ExternalsPlugin(eleventyConfig, options = {}) {
	const { packages = [] } = options;

	if (packages.length === 0) {
		console.warn("[ExternalsPlugin] No packages specified");
		return;
	}

	const imports = {};
	const versions = {};

	for (const pkg of packages) {
		const pkgJsonPath = resolve(process.cwd(), "node_modules", pkg, "package.json");
		let pkgJson;

		try {
			pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
		} catch (err) {
			console.error(`[ExternalsPlugin] Could not read package.json for ${pkg}: ${err.message}`);
			continue;
		}

		const version = pkgJson.version;
		versions[pkg] = version;

		// Determine the output path based on whether it's a scoped package
		const isScoped = pkg.startsWith("@");
		let outputPath;

		if (isScoped) {
			// @scope/name -> @scope/name-version
			const [scope, name] = pkg.split("/");
			outputPath = `assets/external/${scope}/${name}-${version}`;
		} else {
			outputPath = `assets/external/${pkg}-${version}`;
		}

		// Set up passthrough copy
		eleventyConfig.addPassthroughCopy({ [`node_modules/${pkg}`]: outputPath });

		// Determine entry point from exports or main field
		let entryPoint = "index.js"; // default fallback

		if (pkgJson.exports?.["."]) {
			const resolved = resolveEntryPoint(pkgJson.exports["."]);
			if (resolved) {
				// Remove leading ./ if present
				entryPoint = resolved.replace(/^\.\//, "");
			}
		} else if (pkgJson.module) {
			entryPoint = pkgJson.module;
		} else if (pkgJson.main) {
			entryPoint = pkgJson.main;
		}

		// Build import map entries
		const basePath = `/${outputPath}`;
		imports[pkg] = `${basePath}/${entryPoint}`;
		imports[`${pkg}/`] = `${basePath}/`;
	}

	// Generate a cache version hash from all package versions
	const cacheVersion = Object.entries(versions)
		.map(([pkg, ver]) => `${pkg.replace(/[/@]/g, "")}-${ver}`)
		.join("_");

	// Expose data globally
	eleventyConfig.addGlobalData("externals", {
		importMap: { imports },
		cacheVersion,
		versions,
	});
}

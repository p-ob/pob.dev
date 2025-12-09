import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const data = {
	permalink: "sw.js",
	eleventyExcludeFromCollections: true,
	layout: false,
};

export function render({ metadata }) {
	const swSource = readFileSync(join(__dirname, "sw.js"), "utf-8");
	const cacheName = `pob-dev-${metadata.commitSha.slice(0, 8)}`;

	return swSource.replace("%%CACHE_NAME%%", cacheName);
}

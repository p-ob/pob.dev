import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const feedTypes = ["rss", "json", "atom"];

const feedExtensionMap = {
	rss: "rss",
	json: "json",
	atom: "xml",
};

export function FeedsPlugin(eleventyConfig, options) {
	const { base, author, collection, metadata, outputPath } = options;

	for (const type of feedTypes) {
		const feedPath = `${outputPath}.${feedExtensionMap[type]}`;
		eleventyConfig.addPlugin(feedPlugin, {
			type,
			outputPath: feedPath,
			collection,
			metadata: {
				...metadata,
				author,
				base,
			},
		});
	}
}

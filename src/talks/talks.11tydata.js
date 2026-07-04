import { stripPrefixPermalink } from "../../11ty/strip-prefix-permalink.js";

export default {
	tags: ["talk"],
	layout: "talk",
	pageType: "article",
	eleventyComputed: {
		permalink: stripPrefixPermalink("/talks"),
	},
};

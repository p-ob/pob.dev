import { stripPrefixPermalink } from "../../11ty/strip-prefix-permalink.js";

export default {
	tags: ["post"],
	layout: "post",
	back: {
		href: "/blog",
		text: "Back",
	},
	eleventyComputed: {
		permalink: stripPrefixPermalink("/blog"),
	},
};

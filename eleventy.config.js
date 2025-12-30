import litPlugin from "@lit-labs/eleventy-plugin-lit";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { JsonHtmlPlugin } from "./11ty/json-html.js";
import { TableOfContentsPlugin } from "./11ty/table-of-contents.js";
import CleanCSS from "clean-css";
import markdownItFootnote from "markdown-it-footnote";
import markdownItContainer from "markdown-it-container";
import { FeedsPlugin } from "./11ty/feeds.js";
import { DraftPlugin } from "./11ty/draft.js";
import { FeedAggregatorPlugin } from "./11ty/feed-aggregator.js";
import { ExternalsPlugin } from "./11ty/externals.js";
import { SyntaxHighlightPlugin } from "./11ty/syntax-highlight.js";

function getLitComponents(...components) {
	const root = "src/assets/js/components/";
	return components.map((x) => `${root}${x}.js`);
}
const LIT_COMPONENTS = getLitComponents("app", "note", "tile");

export default async function (eleventyConfig) {
	/* passthrough copies */
	eleventyConfig.addPassthroughCopy("src/favicon.ico");
	eleventyConfig.addPassthroughCopy("src/assets");
	eleventyConfig.addPassthroughCopy("src/robots.txt");
	eleventyConfig.addPassthroughCopy("src/_headers");
	eleventyConfig.addPlugin(ExternalsPlugin, {
		packages: [
			"lit",
			"lit-html",
			"lit-element",
			"@lit/reactive-element",
			"@lit-labs/ssr-client",
			"@lit-labs/ssr-dom-shim",
			"syntax-highlight-element",
		],
	});

	/* global data */
	eleventyConfig.addGlobalData("layout", "base.njk");

	/* plugins */
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["avif", "webp", "auto"],
		widths: ["auto"],
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
		},
	});
	eleventyConfig.addPlugin(JsonHtmlPlugin);
	eleventyConfig.addPlugin(TableOfContentsPlugin, { parent: "#toc" });
	eleventyConfig.addPlugin(FeedsPlugin, {
		outputPath: "feed",
		author: {
			name: "Patrick O'Brien",
			email: "public@pob.dev",
		},
		base: "https://pob.dev/",
		collection: {
			name: "post",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "Patrick O'Brien",
			subtitle: "Posts from Patrick O'Brien. Opinions my own.",
		},
	});
	eleventyConfig.addPlugin(DraftPlugin);
	eleventyConfig.addPlugin(FeedAggregatorPlugin, {
		configFile: "feeds.json",
		durationLimit: "P1Y6M", // 1 year 6 months
	});
	eleventyConfig.addPlugin(SyntaxHighlightPlugin);

	// this must come last
	eleventyConfig.addPlugin(litPlugin, {
		mode: "worker",
		componentModules: LIT_COMPONENTS,
	});

	/* filters */
	eleventyConfig.addFilter("toDate", (dateString) => {
		return new Date(dateString);
	});

	eleventyConfig.addFilter("readableDate", (date, opts = { year: "numeric", month: "long", day: "numeric" }) => {
		if (!date) {
			return "";
		}
		return new Intl.DateTimeFormat("en-US", opts).format(date);
	});

	eleventyConfig.addFilter("machineDate", (date) => {
		if (!date) {
			return "";
		}
		return date.toISOString();
	});

	eleventyConfig.addFilter("cssmin", (code) => {
		const output = new CleanCSS({}).minify(code);
		return output.styles;
	});

	eleventyConfig.addFilter("except", (arr, ...exclusions) => {
		return arr.filter((x) => !exclusions.includes(x));
	});

	eleventyConfig.addFilter("humanizeDuration", (durationString) => {
		if (!durationString) {
			return null;
		}

		try {
			// Parse ISO 8601 duration string (e.g., "P1Y6M", "P90D")
			const match = durationString.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/);
			if (!match) {
				return durationString;
			}

			const years = parseInt(match[1] || 0);
			const months = parseInt(match[2] || 0);
			const weeks = parseInt(match[3] || 0);
			const days = parseInt(match[4] || 0);

			const parts = [];
			if (years > 0) {
				parts.push(`${years} year${years > 1 ? "s" : ""}`);
			}
			if (months > 0) {
				parts.push(`${months} month${months > 1 ? "s" : ""}`);
			}
			if (weeks > 0) {
				parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
			}
			if (days > 0) {
				parts.push(`${days} day${days > 1 ? "s" : ""}`);
			}

			if (parts.length === 0) {
				return durationString;
			}
			if (parts.length === 1) {
				return parts[0];
			}
			if (parts.length === 2) {
				return parts.join(" and ");
			}

			// For 3+ parts, use commas and "and" for the last part
			const lastPart = parts.pop();
			return parts.join(", ") + ", and " + lastPart;
		} catch (err) {
			return durationString;
		}
	});

	eleventyConfig.addWatchTarget("./src/assets/js/components/**/*.js");

	// additional config
	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.use(markdownItFootnote);

		// Add container support for note types
		const noteTypes = ["note", "warning", "success", "info"];
		const noteTypePattern = new RegExp(`^\\[!(${noteTypes.join("|")})\\]\\s*`, "i");

		noteTypes.forEach((type) => {
			mdLib.use(markdownItContainer, type, {
				render: function (tokens, idx) {
					if (tokens[idx].nesting === 1) {
						// opening tag
						return `<pob-note type="${type}">\n`;
					} else {
						// closing tag
						return "</pob-note>\n";
					}
				},
			});
		});

		// Add support for GitLab-style blockquote alerts: > [!TYPE]
		// Use a core rule to transform blockquotes into pob-note elements
		mdLib.core.ruler.after("block", "gitlab_alerts", function (state) {
			const tokens = state.tokens;
			for (let i = 0; i < tokens.length; i++) {
				if (tokens[i].type === "blockquote_open") {
					// Check if the next token is a paragraph containing an alert marker
					const nextToken = tokens[i + 1];
					if (nextToken && nextToken.type === "paragraph_open") {
						const contentToken = tokens[i + 2];
						if (contentToken && contentToken.type === "inline") {
							const match = contentToken.content.match(noteTypePattern);
							if (match) {
								const type = match[1].toLowerCase();
								// Remove the alert marker from the content
								contentToken.content = contentToken.content.replace(noteTypePattern, "");
								// Also update children if they exist
								if (contentToken.children && contentToken.children.length > 0) {
									const firstChild = contentToken.children[0];
									if (firstChild.type === "text") {
										firstChild.content = firstChild.content.replace(noteTypePattern, "");
									}
								}
								// Convert blockquote to pob-note
								tokens[i].type = "pob_note_open";
								tokens[i].tag = "pob-note";
								tokens[i].attrSet("type", type);
								// Find the corresponding closing tag
								let depth = 1;
								for (let j = i + 1; j < tokens.length; j++) {
									if (tokens[j].type === "blockquote_open") {
										depth++;
									} else if (tokens[j].type === "blockquote_close") {
										depth--;
										if (depth === 0) {
											tokens[j].type = "pob_note_close";
											tokens[j].tag = "pob-note";
											break;
										}
									}
								}
							}
						}
					}
				}
			}
		});

		const defaultRender =
			mdLib.renderer.rules.link_open ||
			function (tokens, idx, options, _env, self) {
				return self.renderToken(tokens, idx, options);
			};

		mdLib.renderer.rules.link_open = function (tokens, idx, options, env, self) {
			const href = tokens[idx].attrGet("href");
			if (href?.startsWith("http://") || href?.startsWith("https://")) {
				tokens[idx].attrSet("target", "_blank");
				tokens[idx].attrSet("rel", "noopener noreferrer");
			}

			// Pass the token to the default renderer.
			return defaultRender(tokens, idx, options, env, self);
		};

		return mdLib;
	});
}

export const config = {
	dir: {
		input: "src",
		output: "public",
		layouts: "_includes/layouts/",
	},
	templateFormats: ["html", "njk", "md", "11ty.js"],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
};

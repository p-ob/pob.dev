import { resolve, sep, join } from "path";
import eleventyImage, { generateHTML } from "@11ty/eleventy-img";

export default (eleventyConfig) => {
	function relativeToInputPath(inputPath, relativeFilePath) {
		const split = inputPath.split("/");
		split.pop();

		return resolve(split.join(sep), relativeFilePath);
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, widths, sizes) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		const formats = ["avif", "webp", "auto"];
		const file = relativeToInputPath(this.page.inputPath, src);
		const metadata = await eleventyImage(file, {
			widths: widths || ["auto"],
			formats,
			outputDir: join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
		});

		// TODO loading=eager and fetchpriority=high
		const imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		};
		return generateHTML(metadata, imageAttributes);
	});
};

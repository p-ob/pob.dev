import litPlugin from "@lit-labs/eleventy-plugin-lit";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { JsonHtmlPlugin } from "./11ty/json-html.js";
import { TableOfContentsPlugin } from "./11ty/table-of-contents.js";
import { copyFile } from "node:fs/promises";
import CleanCSS from "clean-css";
import markdownItFootnote from "markdown-it-footnote";

function getLitComponents(...components) {
  const root = "src/assets/js/components/";
  return components.map((x) => `${root}${x}.js`);
}

function passthroughCopyLitDependencies(eleventyConfig) {
  const modules = ["@webcomponents", "@lit", "@lit-labs", "lit", "lit-element", "lit-html"];

  for (const module of modules) {
    const modulePath = `node_modules/${module}`;
    const outputPath = `assets/external/${module}`;
    const copyConfig = {};
    copyConfig[modulePath] = outputPath;
    eleventyConfig.addPassthroughCopy(copyConfig);
  }
}

async function includeMetafiles(...filePaths) {
  for (const filePath of filePaths) {
    await copyFile(filePath, `src/meta/${filePath}`);
  }
}

const LIT_COMPONENTS = getLitComponents("app");

export default async function (eleventyConfig) {
  await includeMetafiles("README.md", "LICENSE.md");

  /* passthrough copies */
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/assets");
  passthroughCopyLitDependencies(eleventyConfig);

  /* global data */
  eleventyConfig.addGlobalData("layout", "base.njk");
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

  /* plugins */
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(JsonHtmlPlugin);
  eleventyConfig.addPlugin(pluginWebc);
  eleventyConfig.addPlugin(TableOfContentsPlugin, { parent: "#toc" });

  // this must come last
  eleventyConfig.addPlugin(litPlugin, {
    mode: "vm",
    componentModules: LIT_COMPONENTS,
  });

  /* filters */
  eleventyConfig.addFilter("readableDate", (date) => {
    const opts = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", opts).format(date);
  });

  eleventyConfig.addFilter("machineDate", (date) => {
    return date.toISOString();
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addWatchTarget("./src/assets/js/components/");

  // additional config
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItFootnote);

		const defaultRender = mdLib.renderer.rules.link_open || function (tokens, idx, options, _env, self) {
			return self.renderToken(tokens, idx, options);
		};

		mdLib.renderer.rules.link_open = function (tokens, idx, options, env, self) {
			const href = tokens[idx].attrGet('href');
			if (href?.startsWith('http://') || href?.startsWith('https://')) {
				tokens[idx].attrSet('target', '_blank');
				tokens[idx].attrSet('rel', 'noopener noreferrer');
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

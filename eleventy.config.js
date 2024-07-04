import litPlugin from "@lit-labs/eleventy-plugin-lit";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { JsonHtmlPlugin } from "./11ty/json-html.js";
import { TableOfContentsPlugin } from "./11ty/table-of-contents.js";

function getLitComponents(...components) {
  const root = "src/assets/js/components/";
  return components.map((x) => `${root}${x}.js`);
}

function passthroughCopyLitDependencies(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("node_modules/@webcomponents");
  eleventyConfig.addPassthroughCopy("node_modules/@lit");
  eleventyConfig.addPassthroughCopy("node_modules/@lit-labs");
  eleventyConfig.addPassthroughCopy("node_modules/lit");
  eleventyConfig.addPassthroughCopy("node_modules/lit-element");
  eleventyConfig.addPassthroughCopy("node_modules/lit-html");
}

const LIT_COMPONENTS = getLitComponents("app");

export default async function (eleventyConfig) {
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

  eleventyConfig.addWatchTarget("./src/assets/js/components/");
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

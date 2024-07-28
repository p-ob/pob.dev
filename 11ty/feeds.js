import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const feedTypes = ["rss", "json", "atom"];

export function FeedsPlugin(eleventyConfig, options) {
  const { base, author, collection, metadata, outputPath } = options;

  for (const type of feedTypes) {
    const feedPath = `${outputPath}.${type}`;
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

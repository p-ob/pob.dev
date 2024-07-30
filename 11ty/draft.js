// inspiration: https://www.11ty.dev/docs/quicktips/draft-posts/

export function DraftPlugin(eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false;
      }

      return data.permalink;
    };
  });

  eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", () => {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return true;
      }

      return data.eleventyExcludeFromCollections;
    };
  });

  eleventyConfig.on("eleventy.before", ({ runMode }) => {
    // Set the environment variable
    if (runMode === "serve" || runMode === "watch") {
      process.env.BUILD_DRAFTS = true;
    }
  });
}

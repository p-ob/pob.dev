// Plugin to aggregate RSS feeds from external sources
// Fetches feeds at build time and makes them available as global data

export function FeedAggregatorPlugin(eleventyConfig, options = {}) {
  const { configFile = "feeds.json" } = options;

  // Add global data for aggregated feeds
  eleventyConfig.addGlobalData("aggregatedFeeds", async () => {
    try {
      // Dynamic import of RSS parser
      const Parser = (await import("rss-parser")).default;
      const parser = new Parser({
        customFields: {
          item: [
            ["dc:creator", "creator"],
            ["author", "author"],
          ],
        },
      });

      // Read feed configuration
      const fs = await import("fs/promises");
      const path = await import("path");

      let feedConfig;
      try {
        const configPath = path.resolve(configFile);
        const configContent = await fs.readFile(configPath, "utf-8");
        feedConfig = JSON.parse(configContent);
      } catch (err) {
        console.warn(`[FeedAggregator] Could not read ${configFile}:`, err.message);
        return [];
      }

      if (!Array.isArray(feedConfig.feeds)) {
        console.warn(`[FeedAggregator] No feeds array found in ${configFile}`);
        return [];
      }

      // Fetch all feeds
      const allItems = [];

      for (const feedSource of feedConfig.feeds) {
        try {
          console.log(`[FeedAggregator] Fetching feed: ${feedSource.name} (${feedSource.url})`);
          const feed = await parser.parseURL(feedSource.url);

          // Transform feed items to our standard format
          const items = feed.items.map((item) => ({
            title: item.title,
            link: item.link,
            date: item.isoDate || item.pubDate,
            source: {
              name: feedSource.name,
              url: feedSource.url,
              siteUrl: feedSource.siteUrl || feed.link,
            },
            // Optional fields for future use
            description: item.contentSnippet || item.summary,
            author: item.creator || item.author || feed.author,
          }));

          allItems.push(...items);
          console.log(`[FeedAggregator] ✓ Fetched ${items.length} items from ${feedSource.name}`);
        } catch (err) {
          console.error(`[FeedAggregator] ✗ Failed to fetch ${feedSource.name}:`, err.message);
          // Continue with other feeds
        }
      }

      // Sort by date, newest first
      allItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      console.log(`[FeedAggregator] Total items aggregated: ${allItems.length}`);
      return allItems;
    } catch (err) {
      console.error(`[FeedAggregator] Critical error:`, err);
      return [];
    }
  });
}

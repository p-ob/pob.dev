// Plugin to aggregate RSS feeds from external sources
// Fetches feeds at build time and makes them available as global data

import { Temporal } from "temporal-polyfill";

// Module-level cache to avoid refetching on every watch rebuild
let cachedFeeds = null;
let cacheConfigFile = null;

export function FeedAggregatorPlugin(eleventyConfig, options = {}) {
  const { configFile = "feeds.json", durationLimit = null } = options;

  // Watch the feeds configuration file for changes
  eleventyConfig.addWatchTarget(configFile);

  // Clear cache when feeds.json changes
  eleventyConfig.on("eleventy.beforeWatch", (changedFiles) => {
    if (changedFiles.some((file) => file.endsWith(configFile))) {
      console.log(`[FeedAggregator] ${configFile} changed, clearing cache`);
      cachedFeeds = null;
    }
  });

  // Expose the duration limit as global data
  eleventyConfig.addGlobalData("readingFeedDurationLimit", durationLimit);

  // Add global data for aggregated feeds
  eleventyConfig.addGlobalData("aggregatedFeeds", async () => {
    // Return cached data if available
    if (cachedFeeds !== null && cacheConfigFile === configFile) {
      console.log(`[FeedAggregator] Using cached feed data (${cachedFeeds.length} items)`);
      return cachedFeeds;
    }
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

      // Filter by date if durationLimit is provided
      let filteredItems = allItems;
      if (durationLimit) {
        try {
          const now = Temporal.Now.plainDateISO();
          const duration = Temporal.Duration.from(durationLimit);
          const cutoffDate = now.subtract(duration);

          filteredItems = allItems.filter((item) => {
            const itemDate = Temporal.PlainDate.from(item.date.substring(0, 10));
            return Temporal.PlainDate.compare(itemDate, cutoffDate) >= 0;
          });

          console.log(
            `[FeedAggregator] Filtered ${allItems.length} items to ${filteredItems.length} items (keeping posts from the last ${durationLimit})`
          );
        } catch (err) {
          console.error(`[FeedAggregator] Invalid durationLimit "${durationLimit}":`, err.message);
          console.warn(`[FeedAggregator] Proceeding without date filtering`);
        }
      }

      // Sort by date, newest first
      filteredItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      console.log(`[FeedAggregator] Total items aggregated: ${filteredItems.length}`);

      // Cache the results
      cachedFeeds = filteredItems;
      cacheConfigFile = configFile;

      return filteredItems;
    } catch (err) {
      console.error(`[FeedAggregator] Critical error:`, err);
      return [];
    }
  });
}

import fs from "fs";
import path from "path";
import ssri from "ssri";

// stolen with <3 from https://stackoverflow.com/a/52171480
function hash(str, seed) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function skipFile(filename) {
  const pattern = /^https?:\/\//i;
  return pattern.test(filename);
}

export default (eleventyConfig) => {
  eleventyConfig.addFilter("hashcontent", (file) => {
    if (!file) {
      return "";
    }
    if (skipFile(file)) {
      return file;
    }
    let contentHash;
    const filepath = path.join(".", file);
    try {
      const content = fs.readFileSync(filepath, "utf8");
      contentHash = hash(content, 0);
    } catch (error) {
      console.error(`Error encountered trying to load file for hashing: ${file}. Error: ${error}`);
    }
    return contentHash ? `${file}?h=${contentHash}` : file;
  });

  eleventyConfig.addFilter("ssri", (file) => {
    if (!file) {
      return "";
    }
    if (skipFile(file)) {
      return "";
    }
    let integrity;
    const filepath = path.join(".", file);
    try {
      const content = fs.readFileSync(filepath, "utf8");
      integrity = ssri.fromData(content);
    } catch (error) {
      console.error(`Error encountered trying to load file for ssri: ${file}. Error: ${error}`);
    }
    return integrity ? `integrity="${integrity}"` : "";
  });
};

export function sanitize(value) {
  if (!value) {
    return null;
  }
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  return value.replace(/'/g, `\'`).replace(/"/g, `\"`);
}

export function JsonHtmlPlugin(eleventyConfig, options = { filterName: "json_html" }) {
	const filterName = options?.filterName || "json_html";
  eleventyConfig.addFilter(filterName, sanitize);
}

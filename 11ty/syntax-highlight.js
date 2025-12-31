/**
 * Eleventy plugin for syntax highlighting using <syntax-highlight> element
 * Transforms code blocks to use the syntax-highlight web component
 * and tracks which languages are used on each page
 */

export function SyntaxHighlightPlugin(eleventyConfig) {
	// Track languages used on the current page
	const pageLanguages = new Map();

	// Transform markdown code blocks to use <syntax-highlight> element
	eleventyConfig.amendLibrary("md", (mdLib) => {
		// Store the default fence renderer
		const defaultFence = mdLib.renderer.rules.fence;

		mdLib.renderer.rules.fence = function (tokens, idx, options, env, self) {
			const token = tokens[idx];
			const info = token.info ? token.info.trim() : "";
			const parts = info ? info.split(/\s+/g) : [];
			const langName = parts[0] || "plaintext";
			const isLive = parts.includes("live");
			const content = token.content;

			// Map common language aliases to syntax-highlight-element supported languages
			const languageMap = {
				js: "javascript",
				ts: "javascript", // TypeScript uses JS grammar
				jsx: "javascript",
				tsx: "javascript",
				html: "markup",
				xml: "markup",
				svg: "markup",
				css: "css",
				scss: "css",
				python: "python",
				py: "python",
				csharp: "csharp",
				cs: "csharp",
				json: "javascript", // JSON is close to JS
				bash: "bash",
				sh: "bash",
				shell: "bash",
				// Add more as needed
			};

			const language = languageMap[langName.toLowerCase()] || langName.toLowerCase();

			// Track the language for this page (stored in env if available)
			if (env?.page?.inputPath) {
				const pageKey = env.page.inputPath;
				if (!pageLanguages.has(pageKey)) {
					pageLanguages.set(pageKey, new Set());
				}
				pageLanguages.get(pageKey).add(language);
			}

			// Escape HTML in content
			const escapedContent = content
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");

			// Return the syntax-highlight element, optionally wrapped in pob-demo for live demos
			const syntaxHighlight = `<syntax-highlight language="${language}">${escapedContent}</syntax-highlight>`;

			if (isLive) {
				return `<pob-demo>${syntaxHighlight}</pob-demo>\n`;
			}

			return `${syntaxHighlight}\n`;
		};

		return mdLib;
	});

	// Add a filter to get languages for the current page
	eleventyConfig.addFilter("getCodeLanguages", function (page) {
		const inputPath = page?.inputPath;
		if (!inputPath) {
			return [];
		}

		const languages = pageLanguages.get(inputPath);
		if (!languages || languages.size === 0) {
			return [];
		}

		// Always include the base languages
		const baseLanguages = new Set(["markup", "css", "javascript"]);
		const allLanguages = new Set([...baseLanguages, ...languages]);

		return Array.from(allLanguages);
	});
}

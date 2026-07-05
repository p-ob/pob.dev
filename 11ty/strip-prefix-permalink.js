// Shared eleventyComputed.permalink factory for content types nested under a
// directory prefix (e.g. src/blog, src/talks) that should publish at bare
// /yyyy/mm/slug/ URLs instead of /prefix/yyyy/mm/slug/. Respects draft-exclusion
// (see draft.js) and passes through any explicit permalink already set on the
// template (e.g. a tag listing page) instead of rewriting it.
export function stripPrefixPermalink(prefix) {
	return (data) => {
		if (data.draft && !process.env.BUILD_DRAFTS) {
			return false;
		}

		if (data.permalink) {
			return data.permalink;
		}

		const stem = data.page.filePathStem;
		const stripped = stem.startsWith(prefix) ? stem.slice(prefix.length) : stem;
		return `${stripped}/`;
	};
}

// Serves the standard.site publication verification endpoint:
// https://pob.dev/.well-known/site.standard.publication
// It returns the AT-URI of the publication record living in the ATProto repo.
// The URI is populated by `npm run publish:standard` (writes src/_data/standardSite.json).
// Until a publication has been published, permalink is false so no (empty) file is emitted.
export const data = {
	permalink: (data) => (data.standardSite?.publication ? ".well-known/site.standard.publication" : false),
	eleventyExcludeFromCollections: true,
	layout: false,
};

export function render({ standardSite }) {
	return standardSite.publication;
}

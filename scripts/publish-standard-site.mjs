#!/usr/bin/env node
// Publishes standard.site (https://standard.site) records to the site owner's
// ATProto repo (PDS), so pob.dev conforms to the site.standard lexicons:
//
//   - one `site.standard.publication` record (the masthead), at rkey `self`
//   - one `site.standard.document` record per published blog post
//
// The resulting AT-URIs are written back to src/_data/standardSite.json, which
// the Eleventy build reads to emit the /.well-known endpoint and the per-post
// `<link rel="site.standard.document">` tags. Commit that file after running.
//
// Usage:
//   node scripts/publish-standard-site.mjs            # dry run: print planned records, touch nothing
//   node scripts/publish-standard-site.mjs --commit   # authenticate and write to the PDS
//
// Auth (only needed with --commit) comes from environment / .env:
//   BSKY_APP_PASSWORD   required — an app password (Settings → App Passwords), NOT your login password
//   BSKY_IDENTIFIER     optional — handle or DID (default: pob.dev)

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";
import { load as loadYaml } from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "src", "blog");
const DATA_FILE = join(ROOT, "src", "_data", "standardSite.json");

const SITE_URL = "https://pob.dev"; // publication base url (no trailing slash)
const DID = "did:plc:hokbelmdnrzpgrd3zwesobql";
const PUBLICATION_RKEY = "self";
const PUBLICATION_URI = `at://${DID}/site.standard.publication/${PUBLICATION_RKEY}`;

const commit = process.argv.includes("--commit");

// --- minimal .env loader (avoids a dependency) -----------------------------
function loadDotenv() {
	try {
		const raw = readFileSync(join(ROOT, ".env"), "utf-8");
		for (const line of raw.split("\n")) {
			const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
			if (!m) {
				continue;
			}
			const key = m[1];
			let val = m[2].trim();
			if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
				val = val.slice(1, -1);
			}
			if (!(key in process.env)) {
				process.env[key] = val;
			}
		}
	} catch {
		// no .env — fine, env may be set another way
	}
}

// --- collect published blog posts ------------------------------------------
function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) {
			out.push(...walk(full));
		} else if (name.endsWith(".md")) {
			out.push(full);
		}
	}
	return out;
}

function parseFrontmatter(raw) {
	const m = raw.match(/^---\n([\s\S]*?)\n---/);
	return m ? loadYaml(m[1]) || {} : {};
}

// Mirror Eleventy's default permalink for blog posts (no permalink override in
// src/blog/blog.11tydata.js): src/blog/2024/07/hello-world.md -> /blog/2024/07/hello-world/
function urlForPost(file) {
	const rel = relative(join(ROOT, "src"), file).split(sep).join("/");
	return "/" + rel.replace(/\.md$/, "") + "/";
}

// Deterministic, idempotent record key from the post URL so re-running updates
// the same record instead of creating duplicates: /blog/2024/07/hello-world/ -> blog-2024-07-hello-world
function rkeyForUrl(url) {
	return url.replace(/^\/|\/$/g, "").replace(/\//g, "-");
}

function collectDocuments() {
	return walk(BLOG_DIR)
		.map((file) => {
			const raw = readFileSync(file, "utf-8");
			const fm = parseFrontmatter(raw);
			return { file, fm };
		})
		.filter(({ fm }) => fm.title && !fm.draft)
		.map(({ file, fm }) => {
			const url = urlForPost(file);
			const publishedAt = new Date(fm.date).toISOString();
			const record = {
				$type: "site.standard.document",
				site: PUBLICATION_URI,
				path: url,
				title: fm.title,
				publishedAt,
			};
			if (fm.description) {
				record.description = fm.description;
			}
			if (fm.updatedDate) {
				record.updatedAt = new Date(fm.updatedDate).toISOString();
			}
			if (Array.isArray(fm.tags)) {
				const tags = fm.tags.filter((t) => t !== "post");
				if (tags.length) {
					record.tags = tags;
				}
			}
			return { url, rkey: rkeyForUrl(url), record };
		})
		.sort((a, b) => a.record.publishedAt.localeCompare(b.record.publishedAt));
}

function buildPublicationRecord() {
	// Reuse the site's own metadata rather than duplicating it here.
	return import("../src/_data/metadata.js").then(async ({ default: metadata }) => {
		const { default: author } = await import("../src/_data/author.js");
		return {
			$type: "site.standard.publication",
			url: SITE_URL,
			name: author.name,
			description: metadata.description,
			preferences: { showInDiscover: true },
		};
	});
}

async function main() {
	const documents = collectDocuments();
	const publication = await buildPublicationRecord();

	console.log(`standard.site publish (${commit ? "COMMIT" : "dry run"})`);
	console.log(`  did: ${DID}`);
	console.log(`  publication: ${PUBLICATION_URI}`);
	console.log(`  documents: ${documents.length}`);
	for (const doc of documents) {
		console.log(`    - ${doc.rkey}  (${doc.record.title})`);
	}

	const data = { publication: PUBLICATION_URI, documents: {} };
	for (const doc of documents) {
		data.documents[doc.url] = `at://${DID}/site.standard.document/${doc.rkey}`;
	}

	if (!commit) {
		console.log("\nDry run — no records written, src/_data/standardSite.json untouched.");
		console.log("Planned publication record:");
		console.log(JSON.stringify(publication, null, 2));
		if (documents[0]) {
			console.log("Example document record:");
			console.log(JSON.stringify(documents[0].record, null, 2));
		}
		console.log("\nRe-run with --commit (and BSKY_APP_PASSWORD set) to write to the PDS.");
		return;
	}

	const password = process.env.BSKY_APP_PASSWORD;
	if (!password) {
		console.error("\nBSKY_APP_PASSWORD is not set. Add it to .env (an app password, not your login password).");
		process.exit(1);
	}
	const identifier = process.env.BSKY_IDENTIFIER || "pob.dev";

	const { AtpAgent } = await import("@atproto/api");
	const agent = new AtpAgent({ service: "https://verpa.us-west.host.bsky.network" });
	await agent.login({ identifier, password });
	console.log(`\nLogged in as ${agent.session?.handle} (${agent.session?.did})`);
	if (agent.session?.did !== DID) {
		console.error(`Refusing to write: authenticated DID does not match ${DID}.`);
		process.exit(1);
	}

	const put = (collection, rkey, record) =>
		agent.com.atproto.repo.putRecord({ repo: DID, collection, rkey, record });

	await put("site.standard.publication", PUBLICATION_RKEY, publication);
	console.log(`  ✓ publication ${PUBLICATION_RKEY}`);
	for (const doc of documents) {
		await put("site.standard.document", doc.rkey, doc.record);
		console.log(`  ✓ document ${doc.rkey}`);
	}

	writeFileSync(DATA_FILE, JSON.stringify(data, null, "\t") + "\n");
	console.log(`\nWrote ${relative(ROOT, DATA_FILE)}. Rebuild and commit it to publish the verification tags.`);
}

loadDotenv();
main().catch((err) => {
	console.error(err);
	process.exit(1);
});

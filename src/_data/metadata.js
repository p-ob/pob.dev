import { execSync } from "child_process";

const now = new Date();
let commitSha = "";
try {
	commitSha = execSync("git rev-parse HEAD").toString().trim();
} catch (e) {
	commitSha = "";
	console.error(e);
}

export default {
	currentYear: now.getFullYear(),
	host: "https://pob.dev",
	buildDate: now.toISOString(),
	commitSha,
};

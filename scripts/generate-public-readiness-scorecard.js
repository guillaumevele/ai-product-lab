import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPublicReadinessScorecard } from "../src/report/public-readiness-scorecard.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outputPath = path.join(root, "docs", "generated", "public-readiness-scorecard.md");
const checkMode = process.argv.includes("--check");

const input = JSON.parse(
  fs.readFileSync(path.join(root, "examples", "public-readiness-gates.json"), "utf8")
);
const scorecard = buildPublicReadinessScorecard(input);

if (checkMode) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";

  if (current !== scorecard) {
    console.error("Public readiness scorecard is out of date. Run `npm run scorecard`.");
    process.exitCode = 1;
  } else {
    console.log("Public readiness scorecard is up to date.");
  }
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, scorecard);
  console.log(`Wrote ${path.relative(root, outputPath)}.`);
}

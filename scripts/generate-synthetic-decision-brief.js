import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSyntheticDecisionBrief } from "../src/report/synthetic-decision-brief.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outputPath = path.join(root, "docs", "generated", "synthetic-decision-brief.md");
const checkMode = process.argv.includes("--check");

const captureRuns = readJson(path.join(root, "examples", "synthetic-capture-quality-runs.json"));
const workflowActions = readJson(path.join(root, "examples", "synthetic-agent-action-requests.json"));
const brief = buildSyntheticDecisionBrief({ captureRuns, workflowActions });

if (checkMode) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";

  if (current !== brief) {
    console.error("Synthetic decision brief is out of date. Run `npm run report`.");
    process.exitCode = 1;
  } else {
    console.log("Synthetic decision brief is up to date.");
  }
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, brief);
  console.log(`Wrote ${path.relative(root, outputPath)}.`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

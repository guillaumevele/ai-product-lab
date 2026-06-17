import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateRepeatability } from "../src/eval/repeatability-score.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, "..", "examples", "synthetic-capture-quality-runs.json");
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));

for (const scenario of input.scenarios) {
  const result = evaluateRepeatability(scenario.values, input.thresholds);

  console.log(`Scenario: ${scenario.id}`);
  console.log(`Decision: ${result.pass ? "pass" : "fail"}`);
  console.log(`Mean: ${result.summary.mean}`);
  console.log(`CV: ${result.summary.coefficientOfVariationPct}%`);
  console.log(`Max delta: ${result.summary.maxAbsoluteDelta}`);
  console.log("");
}


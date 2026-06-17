import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateWorkflowAction } from "../src/eval/workflow-gate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, "..", "examples", "synthetic-agent-action-requests.json");
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));

for (const action of input.actions) {
  const result = evaluateWorkflowAction(action);

  console.log(`Action: ${action.id}`);
  console.log(`Decision: ${result.status}`);
  console.log(`Controls: ${result.requiredControls.join(", ") || "none"}`);
  console.log(`Reason: ${result.reasons[0]}`);
  console.log("");
}


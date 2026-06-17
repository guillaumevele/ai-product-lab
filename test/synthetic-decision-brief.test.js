import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildSyntheticDecisionBrief } from "../src/report/synthetic-decision-brief.js";

const captureRuns = JSON.parse(
  fs.readFileSync(new URL("../examples/synthetic-capture-quality-runs.json", import.meta.url), "utf8")
);

const workflowActions = JSON.parse(
  fs.readFileSync(new URL("../examples/synthetic-agent-action-requests.json", import.meta.url), "utf8")
);

test("synthetic decision brief summarizes release posture", () => {
  const brief = buildSyntheticDecisionBrief({ captureRuns, workflowActions });

  assert.match(brief, /Release posture: Proceed only with product controls\./);
  assert.match(brief, /Capture-quality scenarios passing: 1\/2\./);
  assert.match(brief, /Workflow actions blocked: 2\/5\./);
});

test("synthetic decision brief includes capture and workflow tables", () => {
  const brief = buildSyntheticDecisionBrief({ captureRuns, workflowActions });

  assert.match(brief, /\| stable_capture_quality \| pass \| 82\.25 \| 1\.824% \| 3 \|/);
  assert.match(brief, /\| unstable_capture_quality \| fail \| 65\.75 \| 27\.274% \| 39 \|/);
  assert.match(brief, /\| generate_unreviewed_legal_conclusion \| block \| human_review \|/);
});

test("synthetic decision brief rejects missing fixtures", () => {
  assert.throws(() => buildSyntheticDecisionBrief({ captureRuns: null, workflowActions }), /captureRuns/);
  assert.throws(() => buildSyntheticDecisionBrief({ captureRuns, workflowActions: null }), /workflowActions/);
});

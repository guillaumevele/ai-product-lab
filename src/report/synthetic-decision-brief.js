import { evaluateRepeatability } from "../eval/repeatability-score.js";
import { evaluateWorkflowAction } from "../eval/workflow-gate.js";

export function buildSyntheticDecisionBrief({ captureRuns, workflowActions }) {
  assertFixture(captureRuns, "captureRuns");
  assertFixture(workflowActions, "workflowActions");

  const captureResults = captureRuns.scenarios.map((scenario) => ({
    scenario,
    result: evaluateRepeatability(scenario.values, captureRuns.thresholds)
  }));

  const workflowResults = workflowActions.actions.map((action) => ({
    action,
    result: evaluateWorkflowAction(action)
  }));

  const captureFailures = captureResults.filter((entry) => !entry.result.pass);
  const blockedActions = workflowResults.filter((entry) => entry.result.status === "block");
  const confirmationActions = workflowResults.filter(
    (entry) => entry.result.status === "requires_confirmation"
  );

  const releasePosture =
    captureFailures.length === 0 && blockedActions.length === 0 && confirmationActions.length === 0
      ? "Proceed"
      : "Proceed only with product controls";

  return [
    "# Synthetic Decision Brief",
    "",
    "This report is generated from public synthetic fixtures. It is designed to",
    "show a compact product-evaluation loop without exposing private product",
    "code, production prompts, user data or sensitive datasets.",
    "",
    "## Executive Decision",
    "",
    `- Release posture: ${releasePosture}.`,
    `- Capture-quality scenarios passing: ${captureResults.length - captureFailures.length}/${captureResults.length}.`,
    `- Workflow actions allowed without extra controls: ${workflowResults.filter((entry) => entry.result.status === "allow").length}/${workflowResults.length}.`,
    `- Workflow actions blocked: ${blockedActions.length}/${workflowResults.length}.`,
    "",
    "## Capture Quality Gate",
    "",
    "| Scenario | Decision | Mean | CV | Max delta | Product note |",
    "| --- | --- | ---: | ---: | ---: | --- |",
    ...captureResults.map(({ scenario, result }) =>
      [
        scenario.id,
        result.pass ? "pass" : "fail",
        result.summary.mean,
        `${result.summary.coefficientOfVariationPct}%`,
        result.summary.maxAbsoluteDelta,
        captureNote(result.pass)
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    ),
    "",
    "## Workflow Action Gate",
    "",
    "| Action | Decision | Required controls | Product note |",
    "| --- | --- | --- | --- |",
    ...workflowResults.map(({ action, result }) =>
      [
        action.id,
        result.status,
        result.requiredControls.join(", ") || "none",
        result.reasons[0]
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    ),
    "",
    "## Product Interpretation",
    "",
    "- Stable synthetic inputs can proceed through the product gate.",
    "- Unstable capture quality should trigger retry or fallback UX, not a silent answer.",
    "- External or sensitive workflow actions need explicit controls before execution.",
    "- Unreviewed medical or legal conclusions are blocked in this public safety model.",
    "",
    "## Verification",
    "",
    "Run the full public verification suite:",
    "",
    "```bash",
    "npm run verify",
    "```",
    "",
    "The suite checks unit behavior, demo output, report freshness and publication safety."
  ].join("\n") + "\n";
}

function captureNote(pass) {
  return pass
    ? "Stable enough for the synthetic gate."
    : "Needs retry, fallback or clearer uncertainty UX.";
}

function assertFixture(value, name) {
  if (!value || typeof value !== "object") {
    throw new TypeError(`Expected ${name} fixture object.`);
  }
}

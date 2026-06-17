export function buildPublicReadinessScorecard(input) {
  assertInput(input);

  const passing = input.gates.filter((gate) => gate.status === "pass");
  const attention = input.gates.filter((gate) => gate.status !== "pass");
  const posture = attention.length === 0 ? "Public-ready" : "Needs review before publishing";

  return [
    "# Public Readiness Scorecard",
    "",
    "This generated scorecard summarizes the public repository hygiene checks",
    "that make this lab easier to review without access to non-public work.",
    "",
    "## Summary",
    "",
    `- Posture: ${posture}.`,
    `- Passing gates: ${passing.length}/${input.gates.length}.`,
    `- Gates needing attention: ${attention.length}.`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Evidence | Reviewer value |",
    "| --- | --- | --- | --- |",
    ...input.gates.map((gate) =>
      [
        gate.label,
        gate.status,
        gate.evidence,
        gate.reviewerValue
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |")
    ),
    "",
    "## Review Notes",
    "",
    "- This scorecard is generated from a public synthetic manifest.",
    "- It is evidence of repository hygiene, not evidence of private product performance.",
    "- Conceptual redaction still requires human review; the technical scan is only one layer.",
    "",
    "## Verification",
    "",
    "```bash",
    "npm run verify",
    "```"
  ].join("\n") + "\n";
}

function assertInput(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError("Expected a scorecard input object.");
  }

  if (!Array.isArray(input.gates) || input.gates.length === 0) {
    throw new TypeError("Expected input.gates to be a non-empty array.");
  }

  for (const gate of input.gates) {
    for (const key of ["id", "label", "status", "evidence", "reviewerValue"]) {
      if (typeof gate[key] !== "string" || gate[key].length === 0) {
        throw new TypeError(`Expected gate.${key} to be a non-empty string.`);
      }
    }
  }
}

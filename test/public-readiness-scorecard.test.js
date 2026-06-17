import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildPublicReadinessScorecard } from "../src/report/public-readiness-scorecard.js";

const fixture = JSON.parse(
  fs.readFileSync(new URL("../examples/public-readiness-gates.json", import.meta.url), "utf8")
);

test("public readiness scorecard summarizes passing gates", () => {
  const scorecard = buildPublicReadinessScorecard(fixture);

  assert.match(scorecard, /Posture: Public-ready\./);
  assert.match(scorecard, /Passing gates: 7\/7\./);
  assert.match(scorecard, /Gates needing attention: 0\./);
});

test("public readiness scorecard lists reviewer evidence", () => {
  const scorecard = buildPublicReadinessScorecard(fixture);

  assert.match(scorecard, /\| Unit tests \| pass \| npm test \|/);
  assert.match(scorecard, /\| CI workflow \| pass \| \.github\/workflows\/test\.yml \|/);
  assert.match(scorecard, /Conceptual redaction still requires human review/);
});

test("public readiness scorecard validates input shape", () => {
  assert.throws(() => buildPublicReadinessScorecard(null), /scorecard input/);
  assert.throws(() => buildPublicReadinessScorecard({ gates: [] }), /non-empty array/);
  assert.throws(() => buildPublicReadinessScorecard({ gates: [{ id: "missing" }] }), /gate.label/);
});

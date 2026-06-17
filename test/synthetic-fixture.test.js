import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { evaluateRepeatability } from "../src/eval/repeatability-score.js";

const fixture = JSON.parse(
  fs.readFileSync(new URL("../examples/synthetic-capture-quality-runs.json", import.meta.url), "utf8")
);

test("synthetic capture-quality fixture is public-safe metadata", () => {
  assert.equal(fixture.metadata.contains_real_user_data, false);
  assert.equal(fixture.metadata.contains_medical_claims, false);
});

test("synthetic capture-quality fixture has one passing and one failing scenario", () => {
  const decisions = fixture.scenarios.map((scenario) =>
    evaluateRepeatability(scenario.values, fixture.thresholds).pass
  );

  assert.deepEqual(decisions, [true, false]);
});


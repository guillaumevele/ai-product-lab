import assert from "node:assert/strict";
import test from "node:test";
import {
  coefficientOfVariationPct,
  evaluateRepeatability,
  mean,
  standardDeviation,
  summarizeRepeatability
} from "../src/eval/repeatability-score.js";

test("mean computes a simple average", () => {
  assert.equal(mean([10, 20, 30]), 20);
});

test("standard deviation is sample-based", () => {
  assert.equal(standardDeviation([10, 10, 10]), 0);
  assert.equal(Math.round(standardDeviation([10, 20, 30]) * 1000) / 1000, 10);
});

test("coefficient of variation is returned as a percentage", () => {
  assert.equal(coefficientOfVariationPct([50, 50, 50]), 0);
  assert.equal(Math.round(coefficientOfVariationPct([45, 50, 55]) * 1000) / 1000, 10);
});

test("coefficient of variation handles zero means explicitly", () => {
  assert.equal(coefficientOfVariationPct([0, 0, 0]), 0);
  assert.equal(coefficientOfVariationPct([-10, 0, 10]), Number.POSITIVE_INFINITY);
});

test("a single repeated value has no dispersion", () => {
  assert.deepEqual(summarizeRepeatability([42]), {
    count: 1,
    mean: 42,
    standardDeviation: 0,
    coefficientOfVariationPct: 0,
    meanAbsoluteDelta: 0,
    maxAbsoluteDelta: 0
  });
});

test("summarizeRepeatability captures deltas across repeated runs", () => {
  assert.deepEqual(summarizeRepeatability([70, 72, 71]), {
    count: 3,
    mean: 71,
    standardDeviation: 1,
    coefficientOfVariationPct: 1.408,
    meanAbsoluteDelta: 1.5,
    maxAbsoluteDelta: 2
  });
});

test("evaluateRepeatability reports pass and failed checks", () => {
  assert.equal(evaluateRepeatability([70, 72, 71]).pass, true);

  const unstable = evaluateRepeatability([20, 80, 30], {
    maxCoefficientOfVariationPct: 12,
    maxAbsoluteDelta: 10
  });

  assert.equal(unstable.pass, false);
  assert.equal(unstable.checks.coefficientOfVariation, false);
  assert.equal(unstable.checks.maxAbsoluteDelta, false);
});

test("numeric validation rejects empty or invalid input", () => {
  assert.throws(() => mean([]), /non-empty/);
  assert.throws(() => mean([1, Number.NaN]), /finite/);
  assert.throws(() => mean([1, "2"]), /finite/);
});

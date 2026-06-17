export function mean(values) {
  assertNumericArray(values);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function standardDeviation(values) {
  assertNumericArray(values);
  if (values.length === 1) return 0;

  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
    (values.length - 1);

  return Math.sqrt(variance);
}

export function coefficientOfVariationPct(values) {
  assertNumericArray(values);

  const avg = mean(values);
  if (avg === 0) {
    return standardDeviation(values) === 0 ? 0 : Number.POSITIVE_INFINITY;
  }

  return Math.abs((standardDeviation(values) / avg) * 100);
}

export function summarizeRepeatability(values) {
  assertNumericArray(values);

  const avg = mean(values);
  const deltas = values
    .slice(1)
    .map((value, index) => Math.abs(value - values[index]));

  return {
    count: values.length,
    mean: round(avg),
    standardDeviation: round(standardDeviation(values)),
    coefficientOfVariationPct: round(coefficientOfVariationPct(values)),
    meanAbsoluteDelta: round(deltas.length ? mean(deltas) : 0),
    maxAbsoluteDelta: round(deltas.length ? Math.max(...deltas) : 0)
  };
}

export function evaluateRepeatability(values, thresholds = {}) {
  const summary = summarizeRepeatability(values);
  const maxCvPct = thresholds.maxCoefficientOfVariationPct ?? 12;
  const maxDelta = thresholds.maxAbsoluteDelta ?? 10;

  const checks = {
    coefficientOfVariation: summary.coefficientOfVariationPct <= maxCvPct,
    maxAbsoluteDelta: summary.maxAbsoluteDelta <= maxDelta
  };

  return {
    pass: Object.values(checks).every(Boolean),
    checks,
    thresholds: {
      maxCoefficientOfVariationPct: maxCvPct,
      maxAbsoluteDelta: maxDelta
    },
    summary
  };
}

function assertNumericArray(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new TypeError("Expected a non-empty array of numeric values.");
  }

  for (const value of values) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError("Expected only finite numeric values.");
    }
  }
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

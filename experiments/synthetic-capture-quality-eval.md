# Synthetic Capture Quality Evaluation

This is a filled public-safe example. The numbers are synthetic and do not come
from a private product, a user, a real-world image or a production dataset.

## Product Surface

Synthetic input-quality gate for an AI-assisted consumer workflow.

The gate is intentionally upstream from any user-facing analysis. The product
question is simple: should the workflow proceed, ask for better input, or
block the result surface?

## Thresholds

| Check | Threshold |
| --- | --- |
| Coefficient of variation | <= 8% |
| Max absolute run delta | <= 8 points |

## Runs

| Scenario | Synthetic scores | Harness result | Product decision |
| --- | --- | --- |
| Stable input quality under small framing changes | 81, 83, 84, 81 | pass | Proceed |
| Unstable input quality under mixed conditions | 82, 43, 60, 78 | fail | Ask for better input |

## Demo

```bash
npm run demo
```

Expected result:

```text
Scenario: stable_capture_quality
Decision: pass
Mean: 82.25
CV: 1.824%
Max delta: 3

Scenario: unstable_capture_quality
Decision: fail
Mean: 65.75
CV: 27.274%
Max delta: 39
```

## Product Decision

Stable input quality can proceed to the next workflow step. Unstable input
quality should not produce a confident result; it should trigger a recovery
state asking the user for better input.

## Redaction Boundary

- Synthetic values only.
- No image files.
- No professional conclusions.
- No treatment guidance.
- No private thresholds from a production app.

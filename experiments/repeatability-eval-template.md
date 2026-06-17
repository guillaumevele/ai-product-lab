# Repeatability Evaluation Template

Use this template for repeated AI-assisted observations where consistency
matters more than one impressive output.

## Setup

- Product surface:
- User goal:
- Input type:
- Model or system under test:
- Date:
- Environment:
- Test owner:

## Run Matrix

| Run | Input condition | Expected behavior | Observed behavior | Pass |
| --- | --- | --- | --- | --- |
| 1 | Baseline | | | |
| 2 | Slight lighting change | | | |
| 3 | Slight framing change | | | |
| 4 | Lower quality input | | | |
| 5 | Invalid or unsafe input | | | |

## Numeric Summary

Use repeated scalar outputs only when the scalar is meaningful and safe to
publish.

```js
import { evaluateRepeatability } from "./src/eval/repeatability-score.js";

const result = evaluateRepeatability([70, 72, 71], {
  maxCoefficientOfVariationPct: 12,
  maxAbsoluteDelta: 10
});
```

## Decision

- Ship:
- Needs more testing:
- Blocked:
- Reason:
- Next action:


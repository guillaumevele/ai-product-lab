# LLM Workflow Evaluation Template

Use this template when evaluating an AI workflow that produces user-facing
answers, extracted fields, summaries or recommendations.

## Scenario

- Workflow:
- User:
- Input:
- Expected output:
- Prohibited output:
- Source of truth:

## Checks

| Check | Question | Pass |
| --- | --- | --- |
| Grounding | Is the answer supported by the available source? | |
| Calibration | Does it expose uncertainty when needed? | |
| Refusal | Does it refuse unsafe or unsupported requests? | |
| Specificity | Is it useful without inventing details? | |
| UX fit | Does the answer fit the product surface? | |
| Recovery | Does it give the user a next action? | |

## Failure Log

| Failure | Likely cause | Fix | Retest |
| --- | --- | --- | --- |
| | | | |

## Release Decision

- Can ship:
- Needs prompt change:
- Needs product change:
- Needs source validation:
- Needs legal or medical review:


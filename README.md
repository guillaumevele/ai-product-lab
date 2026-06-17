# AI Product Lab

Runnable public artifacts from AI product experiments by Guillaume Vele.

This repository focuses on evaluation, workflow safety and product judgment for
AI-assisted user experiences. It includes synthetic fixtures, small test
harnesses, workflow gates and publication checks that can be inspected without
access to sensitive datasets or production code.

## What To Notice In 30 Seconds

- I work on AI products for constrained domains: sensitive consumer UX,
  document workflows, and local voice automation.
- I care about evaluation, refusal states and uncertainty, not only impressive
  model output.
- I can turn vague product risk into testable checks, synthetic examples and
  clear release decisions.
- The public artifacts are intentionally synthetic; the goal is to show method
  and product judgment with a clear publication boundary.

For a fast review, start with the [public proof pack](docs/public-proof-pack.md).
For a concrete generated artifact, read the
[synthetic decision brief](docs/generated/synthetic-decision-brief.md).
For repository hygiene, read the
[public readiness scorecard](docs/generated/public-readiness-scorecard.md).

## Where I Contribute In A Hackathon

- Product framing: turn a broad model capability into a narrow user workflow.
- UX and interaction: make uncertainty, retries and edge cases feel usable.
- Evaluation: define synthetic tests, expected failures and release criteria.
- Implementation: build lightweight prototypes, harnesses and automation loops.

## Focus

- AI product prototyping for constrained domains.
- Evaluation plans for model-assisted user workflows.
- UX patterns for trust, uncertainty and failure states.
- Local automation and voice agent experiments.
- Privacy-first and evidence-aware product design.

## Public Case Studies

- [Sensitive consumer UX evaluation notes](case-studies/sensitive-consumer-ux-evaluation-notes.md)
- [Local voice automation experiments](case-studies/local-voice-automation.md)
- [Real estate document workflow evaluation](case-studies/real-estate-document-workflow-evaluation.md)

## Evaluation Templates

- [Repeatability evaluation template](experiments/repeatability-eval-template.md)
- [LLM workflow evaluation template](experiments/llm-workflow-eval-template.md)

## Small Test Harness

The `src/eval` code is intentionally generic. It demonstrates repeatability
checks and action-safety gates for AI-assisted product surfaces.

Run:

```bash
npm run verify
npm test
npm run demo
npm run report
npm run report:check
npm run scorecard
npm run scorecard:check
npm run demo:workflow
npm run public:scan
```

Example demo output:

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

See [synthetic capture quality evaluation](experiments/synthetic-capture-quality-eval.md)
for a filled, public-safe example.

The second demo covers workflow action safety:

```text
Action: summarize_public_notes
Decision: allow
Controls: none
Reason: Read-only action within policy boundary.

Action: generate_unreviewed_legal_conclusion
Decision: block
Controls: human_review
Reason: Unreviewed medical or legal advice is outside the public-safe automation boundary.
```

See [synthetic workflow gate evaluation](experiments/synthetic-workflow-gate-eval.md)
for the full public-safe example.

The generated decision brief turns the synthetic fixtures into a compact product
readout:

- [Synthetic decision brief](docs/generated/synthetic-decision-brief.md)
- [Public readiness scorecard](docs/generated/public-readiness-scorecard.md)
- Generator: `scripts/generate-synthetic-decision-brief.js`
- Tests: `test/synthetic-decision-brief.test.js` and
  `test/public-readiness-scorecard.test.js`

## Publication Safety Scan

The repo includes a lightweight public scan:

```bash
npm run public:scan
```

It checks for token-shaped secrets, personal email exposure and optional
blocklist terms. It is a technical scan, not a guarantee against conceptual
over-disclosure. See the [public proof pack](docs/public-proof-pack.md) for the
local pre-publication workflow.

## What This Demonstrates

- A method for framing AI product behavior as testable workflow quality.
- A publication workflow that separates synthetic public evidence from
  sensitive production material.
- Lightweight harnesses and templates that support product decisions.

## What This Does Not Prove

- It does not expose private product code.
- It does not claim medical or legal authority.
- It does not include real user, patient or client data.

## Boundaries

This repo does not include:

- Private pre-release product source code.
- Patient images or biometric data.
- Medical diagnostic claims.
- Private prompts or evaluation datasets.
- Client documents or legal files.
- Secrets, API keys or infrastructure details.

The public goal is simple: show product judgment, evaluation discipline and
practical prototyping without exposing sensitive work.

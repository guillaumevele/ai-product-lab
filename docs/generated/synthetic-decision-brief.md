# Synthetic Decision Brief

This report is generated from public synthetic fixtures. It is designed to
show a compact product-evaluation loop without exposing private product
code, production prompts, user data or sensitive datasets.

## Executive Decision

- Release posture: Proceed only with product controls.
- Capture-quality scenarios passing: 1/2.
- Workflow actions allowed without extra controls: 1/5.
- Workflow actions blocked: 2/5.

## Capture Quality Gate

| Scenario | Decision | Mean | CV | Max delta | Product note |
| --- | --- | ---: | ---: | ---: | --- |
| stable_capture_quality | pass | 82.25 | 1.824% | 3 | Stable enough for the synthetic gate. |
| unstable_capture_quality | fail | 65.75 | 27.274% | 39 | Needs retry, fallback or clearer uncertainty UX. |

## Workflow Action Gate

| Action | Decision | Required controls | Product note |
| --- | --- | --- | --- |
| summarize_public_notes | allow | none | Read-only action within policy boundary. |
| publish_public_readme_update | allow_with_controls | explicit_confirmation | Action changes external state. |
| send_sensitive_document_to_external_model | requires_confirmation | explicit_confirmation, audit_trail | Action changes external state. |
| delete_unreviewed_project_assets | block | rollback_plan | Destructive action has no rollback plan. |
| generate_unreviewed_legal_conclusion | block | human_review | Unreviewed medical or legal advice is outside the public-safe automation boundary. |

## Product Interpretation

- Stable synthetic inputs can proceed through the product gate.
- Unstable capture quality should trigger retry or fallback UX, not a silent answer.
- External or sensitive workflow actions need explicit controls before execution.
- Unreviewed medical or legal conclusions are blocked in this public safety model.

## Verification

Run the full public verification suite:

```bash
npm run verify
```

The suite checks unit behavior, demo output, report freshness and publication safety.

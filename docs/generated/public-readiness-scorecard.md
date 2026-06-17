# Public Readiness Scorecard

This generated scorecard summarizes the public repository hygiene checks
that make this lab easier to review without access to non-public work.

## Summary

- Posture: Public-ready.
- Passing gates: 7/7.
- Gates needing attention: 0.

## Gates

| Gate | Status | Evidence | Reviewer value |
| --- | --- | --- | --- |
| Unit tests | pass | npm test | Core evaluation logic has executable checks. |
| Synthetic demos | pass | npm run demo | A reviewer can inspect pass, fail and blocked decisions quickly. |
| Generated reports | pass | npm run report:check && npm run scorecard:check | Reviewer-facing artifacts are generated from source fixtures. |
| Technical publication scan | pass | npm run public:scan | Token-shaped secrets and configured blocklist terms are checked before publishing. |
| Synthetic fixtures only | pass | examples/ | Public examples do not require real user, client or production data. |
| Publication boundary | pass | SAFETY_AND_SCOPE.md | The repository states what is intentionally excluded. |
| CI workflow | pass | .github/workflows/test.yml | The verification suite runs on GitHub Actions for public pushes. |

## Review Notes

- This scorecard is generated from a public synthetic manifest.
- It is evidence of repository hygiene, not evidence of private product performance.
- Conceptual redaction still requires human review; the technical scan is only one layer.

## Verification

```bash
npm run verify
```

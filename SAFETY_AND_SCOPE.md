# Safety And Scope

This repository is public-facing and deliberately redacted.

## What Is Safe To Publish

- High-level architecture notes.
- Product evaluation methodology.
- Synthetic examples.
- Generic test helpers.
- Screenshots only when they are synthetic or explicitly redacted and reviewed.
- Lessons learned that do not reveal proprietary strategy.

## What Is Not Published

- Production app code.
- Private prompts.
- Internal model routing logic.
- Medical datasets or patient imagery.
- Legal documents, contracts or client data.
- Business-sensitive product roadmap details.
- Infrastructure secrets or deployment credentials.

## Sensitive Domain Boundary

Sensitive-domain notes are framed as product and evaluation notes. They are not
professional advice and they do not make diagnostic, legal or clinical claims.

Any real medical claim should be backed by verified primary literature or
recognized clinical guidance. Public notes should avoid precise concentrations,
doses or treatment protocols.

## Legal Boundary

Legal-adjacent workflow notes are framed as product and UX notes. They are not
legal advice. Public examples should use synthetic documents only.

## Screenshot Boundary

Screenshots are ignored by default. Only explicitly reviewed, public-safe assets
may be committed under `screenshots/public/`.

Before publishing any image asset, strip file metadata such as EXIF, creator,
device, GPS, export path and editing history.

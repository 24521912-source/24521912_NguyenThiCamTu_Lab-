# AI Failure Audit

This document records genuine AI-assisted development failures
identified during the implementation of Homework 1.

## Incident 01 – Dialog Mocks Scoped to a Single Test File

| Field | Details |
| --- | --- |
| Task | T04 – Native Dialog Lightbox |
| AI suggestion | Mocking native dialog methods inside a single test suite |
| Observed problem | A previously passing category filter test failed |
| Root cause | Dialog mocks were scoped to one test file |
| Applied fix | Moving dialog mocks into the shared Vitest setup |

**Verification:** Test files: 4 passed, tests 28 passed
**Re-verification (2026-11-26):** Test files: 7 passed, tests 60 passed

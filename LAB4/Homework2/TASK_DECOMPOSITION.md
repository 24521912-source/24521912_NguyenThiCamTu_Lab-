# Task Decomposition — Homework 2

## 1. Project Overview

**Project:** Full-Stack Esports Fair-Play Appeal Tribunal  
**Course:** Web Application Development — Lab 4  
**Case Study:** Himass & TanVuu

The project provides an academic demonstration of a fair-play appeal portal with dynamic dossier navigation, context-based appeal forms, real-time validation, a zero-drift SLA countdown, and persistent appeal storage.

All case records and evaluation values are fictional demonstration data. They do not represent actual allegations, evidence, penalties, or official decisions.

## 2. Task Progress

| ID | Task | Status |
|---|---|---|
| T01 | Repository Setup and Architecture Contracts | DONE |
| T02 | Dynamic Dossier Routing and Derived Matrix | DONE |
| T03 | Appeal Form Context and Validation | DONE |
| T04 | Zero-Drift SLA Countdown Hook | DONE |
| T05 | Full-Stack API and Persistence | DONE |
| T06 | Accessibility and Regression Testing | TODO |
| T07 | Documentation, Audit and Live Defense | TODO |

Git history is the authoritative record of completed work.

## 3. Architecture Contracts

### 3.1 Technology Stack

- React and Vite for the frontend.
- React Router v7 for dynamic navigation.
- React Context for shared appeal form state.
- Express for the backend REST API.
- JSON file storage for persistent appeal records.
- Vitest and React Testing Library for testing.

JSON file storage is intended for a local academic demonstration rather than a production tribunal system.

### 3.2 Application Routes

| Route | Purpose |
|---|---|
| `/` | Tribunal overview |
| `/dossier/himass` | Himass demonstration dossier |
| `/dossier/tanvuu` | TanVuu demonstration dossier |
| `/dossier/:playerID` | Dynamic dossier route |
| Unknown route | Not-found boundary |

Unknown player identifiers must display a meaningful error rather than silently loading another dossier.

### 3.3 Disproportionality Matrix

Each fictional dossier contains evaluation dimensions with the following fields:

- `criterion`: stable criterion identifier.
- `label`: human-readable criterion name.
- `referenceScore`: fictional reference value.
- `observedScore`: fictional observed value.

Both scores use a scale from 0 to 100.

The signed difference is calculated as:

`difference = observedScore - referenceScore`

The absolute deviation is calculated as:

`deviation = Math.abs(difference)`

The overall deviation is the arithmetic mean of valid criterion deviations.

Missing or invalid scores are excluded and displayed as unavailable. An empty set of valid criteria produces an unavailable overall result, not a division-by-zero error.

The matrix is derived during rendering using `useMemo`. It must not be stored as redundant state or synchronized through an effect.

These calculations are demonstration metrics and must not be presented as official fairness judgments.

### 3.4 Appeal Form Contract

| Field | Validation |
|---|---|
| appellantName | Required, 2–80 characters |
| appealCategory | Must match an allowed category |
| statement | Required, 50–2000 characters |
| requestedOutcome | Required, 10–500 characters |
| evidenceUrl | Optional, valid HTTP or HTTPS URL |
| acknowledged | Must be true |

Allowed appeal categories:

- procedural_review
- evidence_review
- proportionality_review
- other

The evidence review category requires an evidence URL.

Validation is derived synchronously from current form values.

Drafts are isolated by player identifier during the current application session. Switching dossiers must not transfer one player's draft into another player's form.

Invalid or duplicate submissions must be prevented. Failed submissions must preserve the draft. Successful submissions require a real server acknowledgment.

### 3.5 SLA Timer Contract

The demonstration appeal window is 24 hours from the initial case opening timestamp.

The backend provides a stable absolute deadline and the current server timestamp in milliseconds.

Remaining time is calculated as:

`remainingMs = Math.max(0, deadlineMs - estimatedServerNowMs)`

The timer must not decrement previous state by a fixed interval.

Clock offset is estimated using the midpoint of the client request and response timestamps:

`offsetMs = serverNowMs - (requestStartMs + responseEndMs) / 2`

The estimated server time is:

`estimatedServerNowMs = Date.now() + offsetMs`

Network latency and system clock changes may affect estimation accuracy. Zero drift refers to the absence of accumulated interval-counting errors.

The timer resynchronizes when the document becomes visible. Timers and event listeners must be cleaned up when no longer needed.

Expired appeal windows must be enforced by both the frontend and backend.

### 3.6 REST API Contract

**GET /api/health**

Returns the backend health status.

**GET /api/clock**

Returns the current server timestamp.

**GET /api/dossiers/:playerID**

Returns the requested demonstration dossier, evaluation dimensions, stable SLA deadline and current server timestamp.

**POST /api/dossiers/:playerID/appeals**

Validates the submitted appeal and persists it.

Successful creation returns HTTP 201 with the stored appeal identifier and submission timestamp.

**GET /api/dossiers/:playerID/appeals**

Returns persisted demonstration appeals associated with the requested dossier. Only non-sensitive summary fields are returned.

Expected response statuses:

- 200: successful retrieval.
- 201: appeal created.
- 400: invalid request or validation failure.
- 404: unknown dossier.
- 409: expired appeal window or duplicate request.
- 500: unexpected server failure.

Error responses use a consistent structure containing a machine-readable code and a human-readable message.

The backend must not expose internal stack traces or environment secrets.

### 3.7 Persistence Contract

Appeal records contain:

- Appeal identifier.
- Client-generated request identifier.
- Player identifier.
- Validated appeal fields.
- Submission timestamp.
- Initial appeal status.

Case opening timestamps and deadlines remain stable across server restarts.

Storage writes must be serialized to avoid concurrent write conflicts. Repeated requests with the same request identifier must not create duplicate records.

Runtime storage files must not be committed to Git.

## 4. Task Details

### T01 — Repository Setup and Architecture Contracts

**Status:** DONE

**Objective:** Establish a reproducible development environment and document the project contracts before implementing features.

**Prerequisites:** Node.js, npm, Git and VS Code.

**Affected paths:**

- TASK_DECOMPOSITION.md
- Project_rules.md
- AI_FAILURE_AUDIT.md
- .gitignore
- .env.example
- package.json
- client/
- server/

**Acceptance criteria:**

- Existing Git repository is preserved.
- Frontend and backend packages are initialized.
- React Router v7 and required development dependencies are installed.
- Architecture and API contracts are documented.
- The initial frontend passes lint and production build.
- Environment secrets and generated files are excluded from Git.
- Unrelated homework files remain untouched.

**Edge cases:** Existing files, incorrect working directory, dependency installation failures and unrelated Git changes.

**Verification:**

- npm --prefix client run lint
- npm --prefix client run build
- npm --prefix server ls --depth=0
- git diff --check
- git status -sb

**Commit:** chore(hw2): initialize tribunal project and contracts

### T02 — Dynamic Dossier Routing and Derived Matrix

**Status:** DONE

**Prerequisite:** T01.

**Objective:** Implement dynamic player dossier navigation and render-time matrix calculations.

**Affected paths:** client/src/pages/, components/, data/, utils/, test/ and application routing files.

**Acceptance criteria:**

- Both named dossier routes are accessible.
- Dynamic routing uses the playerID parameter.
- Direct links and browser refresh work.
- Unknown identifiers show an error boundary.
- The matrix is computed from source data using useMemo.
- Demonstration data is clearly labeled.

**Edge cases:** Unknown player, empty matrix, missing scores, zero scores and invalid values.

**Verification:** Run frontend unit tests, lint and production build. Manually verify navigation and direct URLs.

**Commit:** feat(hw2): implement dossier navigation and derived matrix

### T03 — Appeal Form Context and Validation

**Status:** DONE

**Prerequisite:** T02.

**Objective:** Implement reusable form context with synchronous validation.

**Affected paths:** client/src/context/, components/, hooks/, utils/ and test/.

**Acceptance criteria:**

- Form state is managed through React Context.
- Validation updates immediately as values change.
- Cross-field validation is enforced.
- Errors are accessible and actionable.
- Drafts remain isolated between dossiers.
- Invalid submissions are blocked.
- No fake server success message is displayed.

**Edge cases:** Empty fields, whitespace, boundary lengths, malformed URLs, category changes and dossier switching.

**Verification:** Run validation and component tests, lint and production build.

**Commit:** feat(hw2): implement appeal form context and validation

### T04 — Zero-Drift SLA Countdown Hook

**Status:** DONE


**Prerequisite:** T03.

**Objective:** Implement useAppealSlaTimer using absolute timestamps and visibility resynchronization.

**Affected paths:** client/src/hooks/, components/, utils/ and test/.

**Acceptance criteria:**

- Remaining time is derived from the deadline and current clock.
- Background tab delays do not accumulate countdown errors.
- Visibility changes trigger resynchronization.
- Expired and invalid deadlines are handled.
- Timers and listeners are cleaned up.
- Stale synchronization results are ignored.

**Edge cases:** Large clock jumps, expired deadlines, changed deadlines, invalid timestamps and component unmounting.

**Verification:** Run deterministic fake-clock tests, lint and production build.

**Commit:** feat(hw2): implement zero-drift appeal countdown

### T05 — Full-Stack API and Persistence

**Status:** DONE

**Prerequisite:** T04.

**Objective:** Connect the frontend to the Express API and persist validated appeals.

**Affected paths:** server/src/, server/tests/, client/src/services/, context/, hooks/, pages/ and integration tests.

**Acceptance criteria:**

- Dossiers are retrieved through the real API.
- Server-side validation is independent of client validation.
- Valid appeals are persisted.
- Invalid, duplicate and expired requests are handled.
- SLA synchronization uses actual server timestamps.
- Stored appeals survive server restarts.
- Failed requests preserve the user's draft.
- Stale requests do not overwrite current dossier state.

**Edge cases:** Server downtime, malformed payloads, unknown identifiers, duplicate requests, concurrent writes and expired appeal windows.

**Verification:** Run backend API tests, frontend integration tests and production build. Manually verify persistence after server restart.

**Commit:** feat(hw2): integrate appeal persistence and server clock

### T06 — Accessibility and Regression Testing

**Status:** TODO

**Prerequisite:** T05.

**Objective:** Improve usability, accessibility and application reliability.

**Affected paths:** Frontend components, styles, request services and regression tests.

**Acceptance criteria:**

- Keyboard navigation works.
- Focus indicators are visible.
- Form labels and error descriptions are accessible.
- Loading and error states are understandable.
- Duplicate submissions are prevented.
- Network failures can be recovered from.
- The interface adapts to mobile and desktop layouts.
- No unexpected browser console errors remain during verified workflows.

**Edge cases:** Rapid navigation, repeated clicks, request timeout, failed submission and small viewport.

**Verification:** Run all tests, lint and production build. Perform manual accessibility checks and record actual results locally.

**Commit:** fix(hw2): improve tribunal accessibility and reliability

### T07 — Documentation, Audit and Live Defense

**Status:** TODO

**Prerequisite:** T06.

**Objective:** Finalize submission documentation and prepare for the live defense.

**Affected paths:**

- README.md
- AI_FAILURE_AUDIT.md
- TASK_DECOMPOSITION.md

**Acceptance criteria:**

- Installation and startup instructions are reproducible.
- Architecture and API contracts match the implementation.
- Actual verification results are documented.
- The student completes the AI failure audit independently.
- All task statuses reflect completed work.
- The student can explain routing, context, derived state, validation, timer synchronization and persistence.
- HTTP 413: Request body exceeds the configured size limit.
- Duplicate request IDs with identical payloads return
  HTTP 409 with the existing appeal receipt.
- Duplicate request IDs with different payloads return
  HTTP 409 without a receipt.
- Runtime storage is initialized once and preserved
  across backend restarts.
- JSON persistence supports a single backend process.
**Verification:** Review documentation, run the final verification suite and inspect Git history.

**Commit:** docs(hw2): finalize tribunal documentation and defense

## 5. Definition of Done

A task is completed only after its implementation and required verification are finished, its status is updated, and its changes are committed.

Test results, audit incidents and commit identifiers must never be fabricated.

The final submission must remain reproducible and understandable without relying on AI-generated explanations during the live defense.
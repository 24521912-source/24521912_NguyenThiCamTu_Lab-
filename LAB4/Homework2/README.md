# Full-Stack Esports Fair-Play Appeal Tribunal

## Overview

This project was developed for Homework 2 of the Web Application Development Lab 4.

The application provides a demonstration portal for exploring player dossiers, comparing review criteria, validating appeal forms, and submitting appeals within a limited time window.

The main purpose of this project is to practice React Router, Context API, derived state, custom hooks, REST API integration, and persistent data storage.

All case records and evaluation scores are fictional. The application does not represent actual allegations, evidence, penalties, or official decisions involving the named players.

## Features

- Dynamic player dossier navigation.
- Individual dossiers for Himass and TanVuu.
- Disproportionality matrix calculated from dossier data.
- Context-based appeal form management.
- Real-time and cross-field validation.
- Independent appeal drafts for each dossier.
- Zero-drift SLA countdown.
- Server clock synchronization.
- Persistent appeal storage.
- Duplicate request prevention.
- Network error handling and request cancellation.
- Keyboard navigation and accessible form feedback.
- Responsive desktop and mobile layouts.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Routing | React Router v7 |
| Shared State | React Context API |
| Backend | Express |
| Storage | JSON file storage |
| Frontend Testing | Vitest and React Testing Library |
| Backend Testing | Vitest and Supertest |
| Code Quality | ESLint |
| Version Control | Git |

## Project Structure

```text
Homework2/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── test/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── FairPlayAppealPortal.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   ├── tests/
│   └── package.json
├── .env.example
├── .gitignore
├── AI_FAILURE_AUDIT.md
├── Project_rules.md
├── TASK_DECOMPOSITION.md
├── package.json
└── README.md
```

The server creates its runtime storage directory automatically. Generated files, dependencies, local environment files, and runtime records are excluded from version control.

## Installation

### Prerequisites

- Node.js
- npm
- Git

The project was developed on Windows using VS Code and PowerShell.

Development environment:

- Node.js: v24.14.0
- npm: 11.9.0

### Install Dependencies

Run the following commands from the Homework2 directory:

```powershell
npm --prefix client ci
npm --prefix server ci
```

### Environment Configuration

Create a local environment file if it does not already exist:

```powershell
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}
```

The default configuration is:

```dotenv
PORT=3001
HOST=127.0.0.1
CLIENT_ORIGIN=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3001/api
```

The local `.env` file should not be committed to Git.

## Running the Application

Open two terminal windows in the Homework2 directory.

### Terminal 1 — Backend

```powershell
npm run server
```

The backend listens on port 3001 by default.

### Terminal 2 — Frontend

```powershell
npm run dev
```

Open the application at:

http://localhost:5173

Both servers must be running for the full-stack workflow.

## Application Routes

| Route | Description |
|---|---|
| `/` | Tribunal overview |
| `/dossier/himass` | Himass demonstration dossier |
| `/dossier/tanvuu` | TanVuu demonstration dossier |
| `/dossier/:playerID` | Dynamic dossier route |
| Unknown route | Not-found page |

Unknown player identifiers are handled separately from unknown application routes.

## Application Architecture

The project separates presentation, shared state, business logic, API communication, and persistence.

The React frontend is responsible for navigation, displaying dossier data, managing form drafts, and providing immediate validation feedback.

The Express backend handles dossier retrieval, independent payload validation, deadline enforcement, duplicate request detection, and persistent storage.

The frontend communicates with the backend through a dedicated API service.

### Dynamic Routing

The application uses one dynamic route for player dossiers.

The `DossierView` component retrieves the player identifier using `useParams()` and loads the corresponding dossier from the backend.

This avoids duplicating page components for individual players.

### Derived State

The disproportionality matrix is calculated from the current dossier data using `computeMatrix()` and `useMemo()`.

For each valid review criterion:

```text
difference = observedScore - referenceScore

deviation = abs(difference)

overallDeviation = sum(deviations) / validCount
```

Invalid or missing scores are excluded from the overall calculation.

The matrix is not stored as separate React state because it can be derived directly from the source data.

These scores are demonstration values and should not be interpreted as official fairness judgments.

### Appeal Form Context

The appeal form uses React Context to share form values and actions.

Drafts are stored independently using each player's identifier.

The Context Provider is placed above the application routes so drafts remain available when navigating between dossiers.

Drafts are retained during the current application session. Refreshing the browser resets the in-memory drafts, but submitted appeals remain stored on the backend.

### Real-Time Validation

Validation errors are calculated synchronously from the current form values.

The application does not use an effect to synchronize validation errors with input state.

The form supports required fields, length constraints, URL validation, and cross-field validation.

An evidence URL becomes mandatory when the evidence review category is selected.

The backend independently validates every submitted payload.

### Zero-Drift SLA Countdown

The countdown uses an absolute deadline instead of subtracting one second after each interval callback.

```text
remainingMs = max(0, deadlineMs - estimatedServerNowMs)
```

The server clock offset is estimated using the midpoint of the client request and response timestamps.

```text
midpointMs = (requestStartMs + responseEndMs) / 2

offsetMs = serverNowMs - midpointMs

estimatedServerNowMs = clientNowMs + offsetMs
```

The interval triggers recalculation rather than representing elapsed time.

The timer resynchronizes periodically and when the document becomes visible again.

Timers and event listeners are removed when the component unmounts.

Zero drift means that delayed interval callbacks do not accumulate timing errors. It does not guarantee perfect clock synchronization because network latency and system clock changes may still affect accuracy.

### Persistent Storage

The backend stores demonstration dossiers, deadlines, and submitted appeals in:

```text
server/storage/tribunal.json
```

The storage file is initialized automatically during the first backend startup.

Appeals and deadlines remain available after restarting the server.

Write operations are serialized within the backend process. A temporary file is written before replacing the main storage file.

This approach is suitable for a local academic demonstration, but it is not intended to replace a production database.

### Request Reliability

The API service includes:

- Request timeout handling.
- HTTP error normalization.
- Request cancellation with AbortController.
- Stale response protection.
- Duplicate request prevention using request identifiers.

If a submission fails, the current draft is retained.

Retrying an unchanged failed submission reuses the same request identifier during the current session.

The application displays a successful submission message only after receiving a valid server receipt.

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend availability |
| GET | `/api/clock` | Retrieve server time |
| GET | `/api/dossiers/:playerID` | Retrieve a dossier |
| POST | `/api/dossiers/:playerID/appeals` | Submit an appeal |
| GET | `/api/dossiers/:playerID/appeals` | Retrieve appeal summaries |

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Successful retrieval |
| 201 | Appeal successfully created |
| 400 | Invalid payload or malformed JSON |
| 404 | Unknown dossier or API route |
| 409 | Expired appeal window or duplicate request |
| 413 | Request body exceeds the size limit |
| 500 | Unexpected server error |

A duplicate request with an identical payload returns the existing receipt without creating another appeal.

A duplicate request with a different payload is rejected without returning an existing receipt.

### Example Appeal Payload

```json
{
  "requestID": "00000000-0000-4000-8000-000000000001",
  "appellantName": "Demo Appellant",
  "appealCategory": "procedural_review",
  "statement": "This academic appeal requests a review of the fictional case procedure.",
  "requestedOutcome": "Request an independent review.",
  "evidenceUrl": "",
  "acknowledged": true
}
```

This payload is for demonstration only. Real personal information or confidential evidence should not be entered.

## Testing

Run all frontend tests:

```powershell
npm run test:client
```

Run all backend tests:

```powershell
npm run test:server
```

Run the complete test suite:

```powershell
npm test
```

Check frontend code quality:

```powershell
npm run lint
```

Create a production build:

```powershell
npm run build
```

Preview the production build while the backend is running:

```powershell
npm --prefix client run preview -- --port 5173 --strictPort
```

Stop the frontend development server before starting the preview server.

### Test Coverage Areas

- Dynamic routing and unknown dossier handling.
- Matrix calculations and invalid scores.
- Appeal field validation.
- Cross-field validation.
- Draft isolation.
- Countdown initialization and expiration.
- Large clock changes and visibility resynchronization.
- Timer and listener cleanup.
- Backend payload validation.
- Duplicate and concurrent requests.
- Persistent storage.
- Network failures and request timeout.
- Request cancellation and stale responses.
- Keyboard focus and accessible error descriptions.

### Final Verification Results

| Verification | Actual Result |
|---|---|
| Frontend tests | [Enter actual result] |
| Backend tests | [Enter actual result] |
| ESLint | [Enter actual result] |
| Production build | [Enter actual result] |
| Persistence after restart | [Enter actual result] |
| Keyboard navigation | [Enter actual result] |
| Responsive layout | [Enter actual result] |

### Lighthouse Results

| Metric | Desktop | Mobile |
|---|---|---|
| Performance | [Actual score] | [Actual score or not measured] |
| Accessibility | [Actual score] | [Actual score or not measured] |
| Best Practices | [Actual score] | [Actual score or not measured] |
| SEO | [Actual score] | [Actual score or not measured] |

Lighthouse results are recorded from actual measurements. Automated accessibility scores do not establish full WCAG compliance.

## Demonstration Window

Each demonstration dossier has a 24-hour appeal window starting from the initial storage creation time.

Restarting the backend does not extend the deadline.

When the appeal window expires, submission is disabled and the backend rejects new appeals.

The deadline and stored appeal records should not be modified merely to bypass expiration. A separate fresh demonstration storage environment may be prepared when necessary.

## Known Limitations

- The application is an academic demonstration rather than a production tribunal.
- No authentication or authorization system is implemented.
- JSON storage is designed for a single backend process.
- Form drafts do not survive a full browser reload.
- Request identifier reuse is limited to the current draft session.
- The application does not download or verify external evidence URLs.
- Server clock estimation is affected by network latency.
- The dossier directory is maintained locally, while detailed dossier data is retrieved from the backend.

## Troubleshooting

### Port 5173 Is Already in Use

Check whether another Vite development server is running.

Stop the previous server before starting the frontend.

### Backend Connection Failure

Make sure the Express backend is running on port 3001.

The health endpoint can be used to verify connectivity:

```powershell
Invoke-RestMethod "http://127.0.0.1:3001/api/health"
```

### Vitest Worker Memory Failure

The test runner uses the thread-based worker pool with limited concurrency to reduce memory pressure during regression testing.

The related troubleshooting experience is documented in the AI failure audit.

## Project Documents

- `Project_rules.md`: Development rules and working conventions.
- `TASK_DECOMPOSITION.md`: Task breakdown and development progress.
- `AI_FAILURE_AUDIT.md`: Personally documented AI-assisted development incidents and architectural lessons.

## Conclusion

This project helped me practice building a full-stack React application with shared state, dynamic navigation, derived data, reliable asynchronous requests, server-side validation, and persistent storage.

The implementation focuses on understandable architecture and reproducible testing rather than production-scale deployment.
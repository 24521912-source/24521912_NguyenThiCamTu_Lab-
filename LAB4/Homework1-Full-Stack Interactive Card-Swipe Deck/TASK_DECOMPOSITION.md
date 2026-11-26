
# Task Decomposition

## Project Overview

- Course: Web Application Development
- Lab: Lab 4
- Assignment: Homework 1.2
- Project: Full-Stack Interactive Card-Swipe Deck
- Edition: Hen Ho Nhung Khong Yeu

## Project Objective

Build an interactive card-swipe application with keyboard
and pointer controls, LIFO undo, derived scoring, and
persistent data using Express and Mongoose 8.

## Task Progress

| ID | Task | Status |
| --- | --- | --- |
| T01 | Project Setup and Architecture | DONE |
| T02 | Backend Persistence API | TODO |
| T03 | React Deck and Derived State | TODO |
| T04 | Swipe Controls and LIFO Undo | TODO |
| T05 | Full-Stack Integration | TODO |
| T06 | Accessibility and Reliability | TODO |
| T07 | Documentation and Defense | TODO |

---

## T01 - Project Setup and Architecture

### Objective

Set up the development environment and establish the
project structure before implementing features.

### Prerequisites

- Node.js and npm
- Existing Git repository
- Docker Engine

### Planned Files

- client/
- server/
- compose.yaml
- .gitignore
- API_CONTRACT.md
- TASK_DECOMPOSITION.md
- Project-rules.md
- AI_FAILURE_AUDIT.md
- README.md

### Implementation

- Inspect the existing repository.
- Initialize the React frontend using Vite.
- Initialize the Express backend.
- Install Mongoose 8.
- Prepare the MongoDB environment.
- Define API and state contracts.
- Prepare the project documentation.

### Acceptance Criteria

- The frontend runs locally.
- The backend health endpoint works.
- MongoDB is available.
- API contracts are documented.
- Environment files are excluded from Git.
- Previous homework projects remain unchanged.

### Edge Cases

- Docker Engine is unavailable.
- Development ports are already in use.
- Generated files are accidentally staged.

### Verification

- npm --prefix client run lint
- npm --prefix client run build
- npm --prefix server run test
- docker compose ps
- MongoDB ping
- git diff --check

### Commit

chore(hw1.2): initialize swipe deck and contracts

---

## T02 - Backend Persistence API

### Objective

Implement the database connection and REST API for
profiles and swipe actions.

### Prerequisites

- T01 is complete.
- MongoDB is available.

### Planned Files

- server/src/index.js
- server/src/app.js
- server/src/config/database.js
- server/src/models/Profile.js
- server/src/models/Swipe.js
- server/src/routes/
- server/src/seed.js
- server/test/

### Implementation

- Connect to MongoDB using Mongoose 8.
- Validate the database environment variable.
- Define Profile and Swipe schemas.
- Create fictional demo profiles.
- Implement GET /api/profiles.
- Implement POST /api/swipe.
- Handle invalid requests and database errors.

### Acceptance Criteria

- The backend connects to MongoDB.
- Profiles can be retrieved from the database.
- Valid swipe actions are persisted.
- Invalid requests return appropriate errors.
- Duplicate active swipe actions are prevented.

### Edge Cases

- Missing MONGODB_URI.
- Database connection failure.
- Invalid profile identifier.
- Unsupported swipe action.
- Duplicate swipe action.

### Verification

- npm --prefix server run test
- Real HTTP request checks
- MongoDB persistence checks

### Commit

feat(hw1.2): implement swipe persistence API

---

## T03 - React Deck and Derived State

### Objective

Build the profile card deck and implement predictable
state management.

### Prerequisites

- T02 is complete.

### Planned Files

- client/src/App.jsx
- client/src/components/SwipeDeck.jsx
- client/src/components/ProfileCard.jsx
- client/src/state/SwipeState.jsx
- client/src/test/

### Implementation

- Display profile cards.
- Maintain an ordered profile queue.
- Record swipe actions in history.
- Calculate the score from swipe history.
- Use stable identifiers for profiles and actions.

### Acceptance Criteria

- Profiles are displayed correctly.
- Swiped profiles leave the queue.
- History maintains the correct action order.
- LIKE adds 10 points.
- Other swipe actions subtract 5 points.
- Score is derived rather than stored separately.

### Edge Cases

- Empty profile list.
- Exhausted card deck.
- Empty swipe history.
- Negative score.

### Verification

- Client unit tests
- npm --prefix client run lint
- npm --prefix client run build

### Commit

feat(hw1.2): build deck and derived swipe state

---

## T04 - Swipe Controls and LIFO Undo

### Objective

Support keyboard and pointer interactions and restore
swiped cards using a LIFO undo stack.

### Prerequisites

- T03 is complete.

### Planned Files

- client/src/components/SwipeDeck.jsx
- client/src/components/SwipeListeners.jsx
- client/src/state/SwipeState.jsx
- client/src/test/

### Implementation

- Handle ArrowLeft for left swipes.
- Handle ArrowRight for right swipes.
- Handle ArrowUp for upward swipes.
- Handle Backspace for undo.
- Detect pointer displacement.
- Apply the documented gesture threshold.
- Restore the latest swiped profile.
- Provide accessible action buttons.

### Acceptance Criteria

- All keyboard mappings work correctly.
- Pointer gestures follow the agreed policy.
- Short and cancelled gestures are ignored.
- Undo follows LIFO order.
- Undo restores the corresponding profile.
- Score updates correctly after undo.

### Edge Cases

- Empty undo stack.
- Repeated undo operations.
- Rapid keyboard events.
- Cancelled pointer events.
- Diagonal gestures.
- Editable input targets.

### Verification

- Client unit tests
- Manual keyboard checks
- Manual pointer checks
- npm --prefix client run lint
- npm --prefix client run build

### Commit

feat(hw1.2): add swipe controls and undo stack

---

## T05 - Full-Stack Integration

### Objective

Connect the frontend to the backend and maintain
consistent swipe history across page reloads.

### Prerequisites

- T04 is complete.

### Planned Files

- client/src/api/
- client/src/App.jsx
- client/src/components/SwipeDeck.jsx
- server/src/routes/
- server/test/
- client/src/test/

### Implementation

- Load profiles from the backend.
- Persist swipe actions through the API.
- Retrieve saved swipe history.
- Persist undo operations.
- Restore the queue and score after reload.
- Serialize mutation requests.
- Handle loading and error states.

### Acceptance Criteria

- Profiles are retrieved through the API.
- Swipe actions are stored in MongoDB.
- Undo updates the frontend and database.
- Reload restores the correct history and score.
- Failed requests are not displayed as successful.
- Duplicate actions are prevented.

### Edge Cases

- Network failure.
- Backend unavailable.
- Rapid consecutive actions.
- Duplicate requests.
- Reload after swipe or undo.

### Verification

- Client and server tests
- Real database persistence checks
- Manual reload checks
- Network failure and recovery checks

### Commit

feat(hw1.2): synchronize deck with persisted history

---

## T06 - Accessibility and Reliability

### Objective

Improve usability, responsive layout, accessibility,
and overall application reliability.

### Prerequisites

- T05 is complete.

### Planned Files

- client/src/App.css
- client/src/index.css
- client/src/components/
- client/src/test/
- server/test/

### Implementation

- Improve the card deck layout.
- Support desktop and mobile screens.
- Provide visible keyboard focus.
- Improve accessible action controls.
- Handle empty, loading, and error states.
- Run regression tests.

### Acceptance Criteria

- The interface works across screen sizes.
- Keyboard-only navigation is supported.
- Action buttons have accessible labels.
- Focus indicators are visible.
- Existing features continue to work.
- Lint and production build succeed.

### Edge Cases

- Small mobile viewport.
- Keyboard-only interaction.
- Exhausted card deck.
- Reduced motion preference.
- Unavailable backend.

### Verification

- Client regression tests
- Server regression tests
- npm --prefix client run lint
- npm --prefix client run build
- Manual accessibility checks

### Commit

fix(hw1.2): improve accessibility and reliability

---

## T07 - Documentation and Defense

### Objective

Finalize the project documentation and prepare
for the assignment demonstration.

### Prerequisites

- T06 is complete.

### Planned Files

- README.md
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md

### Implementation

- Document installation and startup instructions.
- Explain the application architecture.
- Document keyboard and pointer controls.
- Explain the scoring and undo mechanisms.
- Document the API endpoints.
- Record actual verification results.
- Review the self-written AI failure audit.
- Prepare for the oral defense.

### Acceptance Criteria

- Documentation matches the implementation.
- Setup instructions are reproducible.
- All required features can be demonstrated.
- Verification notes contain actual results.
- The student can explain the main design decisions.
- All completed tasks have Git commits.

### Verification

- Final regression tests
- Final production build
- Documentation review
- Manual application demonstration

### Commit

docs(hw1.2): finalize documentation and defense

---

## Development Workflow

1. Review the current task and its requirements.
2. Mark the task as IN PROGRESS.
3. Implement the required changes.
4. Run tests and manual checks.
5. Fix any identified issues.
6. Update the AI failure audit when applicable.
7. Mark the task as DONE.
8. Review and commit the changes.
9. Continue to the next unfinished task.

## Status Definitions

- TODO: The task has not started.
- IN PROGRESS: The task is being implemented.
- BLOCKED: An unresolved issue prevents completion.
- DONE: Implementation and required verification are complete.

## Completion Rules

- Work on one task at a time.
- Commit every completed file-changing task.
- Do not fabricate verification results.
- Do not commit credentials or generated dependencies.
- Preserve existing homework projects.
- Follow Project-rules.md throughout development.

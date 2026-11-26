# Almost Love - Interactive Card-Swipe Deck

UIT Web Application Development - Lab 4, Homework 1.2

## Overview

Almost Love is a full-stack interactive profile card deck
inspired by the Hen Ho Nhung Khong Yeu assignment.

The application demonstrates keyboard and pointer event
handling, immutable state management, LIFO undo, derived
scoring, and database persistence.

All profiles are fictional and created for demonstration
purposes.

## Features

- Interactive profile card deck
- Keyboard-based swipe controls
- Mouse and touch pointer gestures
- Gesture direction and threshold detection
- Asymmetric derived scoring
- LIFO undo operations
- Persistent swipe history
- State recovery after page reload
- Duplicate swipe prevention
- Request locking and timeout handling
- Network error recovery
- Responsive layouts
- Accessible keyboard controls
- Reduced motion support

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React and Vite |
| Backend | Node.js and Express |
| ODM | Mongoose 8 |
| Database | MongoDB 8 |
| Frontend Testing | Vitest and React Testing Library |
| Backend Testing | Node.js Test Runner |
| Infrastructure | Docker Compose |
| Code Quality | ESLint |
| Version Control | Git |

## Architecture

The application follows a client-server architecture.

    React Frontend
          |
          | HTTP / JSON
          v
    Express REST API
          |
          v
    Mongoose Models
          |
          v
    MongoDB Database

The frontend manages user interactions and derives the
visible deck state from confirmed swipe history.

The backend validates requests and manages persistent
profiles and swipe actions.

## Project Structure

    client/
        public/
        src/
            api/
            components/
            data/
            hooks/
            state/
            test/
            App.jsx
            App.css
            Responsive.css
            index.css
            main.jsx
        .env.example
        package.json
        vite.config.js

    server/
        src/
            config/
            data/
            models/
            routes/
            app.js
            index.js
            seed.js
        test/
        .env.example
        package.json

    evidence/
    compose.yaml
    Project-rules.md
    TASK_DECOMPOSITION.md
    API_CONTRACT.md
    AI_FAILURE_AUDIT.md
    QUALITY_CHECKLIST.md
    DEFENSE_GUIDE.md

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Docker Desktop

Run all setup commands from the project root unless
otherwise specified.

### 1. Install Dependencies

    npm --prefix client ci
    npm --prefix server ci

### 2. Configure Environment Variables

Create the environment files if they do not exist.

    Copy-Item server/.env.example server/.env
    Copy-Item client/.env.example client/.env

The backend uses the following local configuration:

    PORT=3001
    CLIENT_ORIGIN=http://localhost:5174
    MONGODB_URI=mongodb://127.0.0.1:27018/swipe_deck

The frontend uses:

    VITE_API_BASE_URL=http://localhost:3001/api

Environment files are excluded from version control.

### 3. Start MongoDB

Make sure Docker Desktop is running.

    docker compose up -d
    docker compose ps

Verify the database connection:

    docker compose exec mongodb mongosh --quiet --eval "db.adminCommand({ ping: 1 })"

MongoDB uses a named Docker volume for data persistence.

### 4. Seed Profiles

    npm --prefix server run seed

The seed script inserts fictional demo profiles without
duplicating existing profile identifiers.

### 5. Start the Backend

Open a terminal and run:

    npm --prefix server run dev

Backend URL:

    http://localhost:3001

Health endpoint:

    http://localhost:3001/api/health

### 6. Start the Frontend

Open another terminal and run:

    npm --prefix client run dev

Frontend URL:

    http://localhost:5174

## User Controls

### Keyboard Controls

| Key | Action |
| --- | --- |
| ArrowLeft | PASS |
| ArrowRight | LIKE |
| ArrowUp | SUPER_LIKE |
| Backspace | Undo the latest swipe |

Repeated keyboard events and shortcuts inside editable
elements are ignored.

### Pointer Controls

- Swipe left to pass a profile.
- Swipe right to like a profile.
- Swipe upward to perform a super like.
- Movement must exceed 50 pixels.
- The dominant axis determines the swipe direction.
- Short, downward, cancelled, and equally diagonal
  gestures are ignored.

### Button Controls

The same actions are available through accessible buttons.

All swipe input methods share the same state management
and persistence logic.

## Scoring Rules

| Action | Score |
| --- | --- |
| PASS | -5 |
| LIKE | +10 |
| SUPER_LIKE | -5 |

The score is derived directly from swipe history.

LIKE contributes ten points, while other supported
actions contribute negative five points.

The application does not maintain a separate score state.

## State Management

Swipe history is the single source of truth for the
current deck state.

The remaining profile queue is calculated by excluding
profiles that already exist in swipe history.

The score is calculated using Array.reduce().

State updates preserve immutability.

## LIFO Undo

Undo follows the Last In, First Out principle.

The latest swipe action is removed first, restoring its
profile to the remaining queue.

In persistent mode, the backend deletes the action from
MongoDB before the frontend updates its confirmed history.

The remaining queue and score are then recalculated.

## REST API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | Check server availability |
| GET | /api/profiles | Retrieve profiles |
| POST | /api/swipe | Persist a swipe action |
| GET | /api/swipe/history/:sessionId | Retrieve ordered history |
| DELETE | /api/swipe/history/:sessionId/last | Undo the latest action |

Example swipe request:

    {
      "sessionId": "local-demo-session",
      "profileId": "profile-01",
      "action": "LIKE"
    }

Example undo request:

    {
      "expectedActionId": "stored-action-id"
    }

Detailed request and response contracts are documented
in API_CONTRACT.md.

## Database Design

### Profiles

Each profile contains a stable identifier, name, age,
biography, and avatar reference.

### Swipes

Each swipe contains:

- Database-generated action identifier
- Session identifier
- Profile identifier
- Swipe action
- Creation timestamp

A unique compound index on sessionId and profileId
prevents duplicate active swipes within a session.

The history is ordered using createdAt and _id.

## Persistence and Synchronization

The application uses a fixed local demonstration session:

    local-demo-session

Profiles and swipe history are retrieved from the
backend when the application starts.

The frontend waits for server confirmation before
updating its history.

Mutation requests are serialized to prevent overlapping
operations from the same frontend.

After a page reload, the application reconstructs its
remaining queue and score from stored history.

## Error Handling

The application handles:

- Invalid requests
- Unknown profiles
- Duplicate swipe actions
- Stale undo identifiers
- Network failures
- Request timeouts
- Initial loading failures

HTTP requests use a ten-second timeout.

If a mutation fails, the last confirmed frontend history
is preserved. Further mutations are blocked until the
user reloads the deck.

Failed or timed-out mutations are not retried automatically.

## Accessibility

The interface provides:

- Accessible button names
- Keyboard shortcut annotations
- Accessible scoring descriptions
- Visible keyboard focus
- Live statistics announcements
- Error notifications
- Reduced motion support
- Responsive layouts

Accessibility and responsive verification results are
recorded in QUALITY_CHECKLIST.md.

## Testing

Make sure MongoDB is running before backend tests.

### Frontend Tests

    npm --prefix client run test

The test suites cover state management, swipe gestures,
keyboard controls, pointer controls, undo, API requests,
persistence, request timeouts, and accessibility.

### Backend Tests

    npm --prefix server run test

The backend tests verify database connectivity,
profile retrieval, swipe persistence, validation,
duplicate prevention, history ordering, and undo.

### Linting

    npm --prefix client run lint

### Production Build

    npm --prefix client run build

### Production Preview

    npm --prefix client run preview -- --host localhost --port 5174 --strictPort

The backend must remain available when using the
production preview.

Actual test and Lighthouse results are recorded in
QUALITY_CHECKLIST.md.

## Development Process

The project was divided into seven tasks.

| Task | Description |
| --- | --- |
| T01 | Project setup and architecture |
| T02 | Backend persistence API |
| T03 | React deck and derived state |
| T04 | Swipe controls and LIFO undo |
| T05 | Full-stack integration |
| T06 | Accessibility and reliability |
| T07 | Documentation and defense |

Development progress is tracked in TASK_DECOMPOSITION.md.

Each completed task is recorded through a Git commit.

## AI-Assisted Development

AI was used to assist with implementation planning,
code suggestions, explanations, and debugging.

The suggested code was manually integrated and tested.

Observed AI-related failures, corrections, and lessons
learned are documented in AI_FAILURE_AUDIT.md.

## Known Limitations

- The application uses a fixed demonstration session.
- Authentication is outside the assignment scope.
- Multi-client transaction guarantees are not provided.
- Profile illustrations are fictional SVG graphics.
- Cancelling a frontend request does not guarantee
  cancellation of the corresponding database operation.
- Recovery depends on the database state available
  when the history is reloaded.

## Conclusion

Almost Love demonstrates how event-driven interactions,
derived React state, immutable updates, REST APIs,
and MongoDB persistence can be combined in a full-stack
web application.

The project emphasizes correctness, maintainability,
testing, and responsible AI-assisted development.

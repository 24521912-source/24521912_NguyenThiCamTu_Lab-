
# Full-Stack Interactive Card-Swipe Deck

UIT Web Application Development - Lab 4, Homework 1.2

## Overview

An interactive profile card deck based on the
Hen Ho Nhung Khong Yeu assignment.

The project focuses on event handling, state management,
undo operations, and database persistence.

## Planned Features

- Keyboard and pointer swipe controls
- LIFO undo stack
- Asymmetric derived scoring
- Persistent swipe history
- Responsive and accessible interface
- Error handling and state recovery

## Technology Stack

### Frontend

- React
- Vite
- Vitest
- React Testing Library

### Backend

- Node.js
- Express
- Mongoose 8
- MongoDB
- Node.js Test Runner

### Development Tools

- Docker Compose
- Git
- Visual Studio Code

## Project Structure

    client/                  Frontend application
    server/                  Backend application
    compose.yaml             MongoDB container configuration
    Project-rules.md         Development guidelines
    TASK_DECOMPOSITION.md    Task planning and progress
    API_CONTRACT.md          API and state contracts
    AI_FAILURE_AUDIT.md      AI-assisted development audit

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Docker Desktop

### 1. Start MongoDB

From the project root, run:

    docker compose up -d

### 2. Start the Backend

    cd server
    npm install

Create the environment file if it does not exist.

    Copy-Item .env.example .env

Start the development server.

    npm run dev

Backend URL:

    http://localhost:3001

Health endpoint:

    http://localhost:3001/api/health

### 3. Start the Frontend

Open a separate terminal from the project root.

    cd client
    npm install
    npm run dev

Frontend URL:

    http://localhost:5174

## Testing

Run the following commands from the project root.

### Frontend

    npm --prefix client run test
    npm --prefix client run lint
    npm --prefix client run build

### Backend

    npm --prefix server run test

### Database

    docker compose ps

## Project Status

- T01: Project setup and architecture completed.
- T02: Backend persistence API completed.
- T03: React card deck and derived state completed.
- T04: Keyboard, pointer controls, and LIFO undo completed.
- T05: Full-stack integration and persistence completed.

The application retrieves profiles and swipe history
from the backend.

Swipe and undo operations are persisted in MongoDB.

The score and remaining queue are reconstructed from
the stored history after a page reload.

Mutation requests are serialized, and failed requests
require synchronization before further interactions.

Accessibility and reliability improvements will be
implemented in T06.

## Swipe Scoring

| Action | Score |
| --- | --- |
| PASS | -5 |
| LIKE | +10 |
| SUPER_LIKE | -5 |

The score is derived directly from swipe history.
It is not stored as independent React state.

## Frontend State Management

The application retrieves profiles and persisted swipe
history from the backend by default.

Local profile data can be passed to the application
for isolated component testing.

## Keyboard Controls

| Key | Action |
| --- | --- |
| ArrowLeft | Pass |
| ArrowRight | Like |
| ArrowUp | Super Like |
| Backspace | Undo last swipe |

Repeated keyboard events and editable input targets
are ignored.

## Pointer Controls

- Drag right to Like.
- Drag left to Pass.
- Drag upward to Super Like.
- Movement must exceed 50 pixels.
- The dominant axis determines the gesture direction.
- Short, downward, cancelled, and equally diagonal
  gestures are ignored.

## Undo Behavior

Undo is persisted in MongoDB.

The frontend removes the latest history entry only
after receiving a successful server response.
## Available API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | Check server availability |
| GET | /api/profiles | Retrieve profiles |
| POST | /api/swipe | Create a swipe action |
| GET | /api/swipe/history/:sessionId | Retrieve ordered history |
| DELETE | /api/swipe/history/:sessionId/last | Undo the latest action |
## Frontend Environment

Create the frontend environment file if it does not
already exist.

    Copy-Item client/.env.example client/.env

The default API base URL is:

    http://localhost:3001/api

## Persistent Session

The application uses a fixed local demo session:

    local-demo-session

Authentication and multi-user session management are
outside the scope of this assignment.

## Synchronization and Error Recovery

Swipe and undo operations wait for server confirmation
before updating the visible history.

Additional mutation requests are blocked while an
operation is pending.

If a request fails, the application preserves its last
confirmed history and requires a reload of the deck
before accepting more actions.

## Database Persistence

MongoDB data is stored in a Docker named volume.

Stopping or restarting the container preserves the data.

Do not remove the database volume unless a complete
database reset is intended.

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

The frontend displays fictional demo profiles and supports
button-based swipe actions.

The remaining queue, score, and swipe count are derived
from swipe history.

Keyboard controls, pointer gestures, and LIFO undo will
be implemented in T04.

Frontend API integration and reload persistence will
be implemented in T05.

## Swipe Scoring

| Action | Score |
| --- | --- |
| PASS | -5 |
| LIKE | +10 |
| SUPER_LIKE | -5 |

The score is derived directly from swipe history.
It is not stored as independent React state.

## Frontend State Management

Swipe history acts as the single source of truth.

Remaining profiles and score are calculated using pure
functions. State updates preserve immutability.

The current frontend uses local fictional demo data.
Database synchronization is planned for T05.
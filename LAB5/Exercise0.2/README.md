# Lab 5 — Exercise 0.2

## Zero-Effect Pagination & Container Queries

### Overview

This project is a small React application that demonstrates how pagination can be implemented without unnecessary effects or duplicated state. It also explores how CSS container queries can make components responsive to their available space instead of relying only on the browser viewport.

The application displays 13 fictional evidence clips, with six clips per page by default. Users can navigate between pages using Previous and Next buttons.

All evidence clips are fictional and are provided for demonstration purposes only.

## Features

- Zero-effect pagination with a default page size of six.
- Reusable EvidenceGrid and EvidenceCard components.
- Controlled pagination with Previous and Next buttons.
- Automatic page clamping when the source data changes.
- Safe handling of invalid pagination inputs and empty collections.
- Stable React keys based on unique clip identifiers.
- Responsive layouts using CSS container queries.
- Keyboard navigation and visible focus indicators.
- Minimum 44 × 44 CSS pixel interaction targets.
- Unit, integration, accessibility, and regression tests.

## Technology Stack

- React 19
- Vite
- JavaScript
- CSS
- ESLint
- Vitest
- React Testing Library
- npm and Git

## Getting Started

### Prerequisites

- Node.js
- npm
- A modern web browser with CSS container query support

### Installation

Install the dependencies:

    npm ci

Start the development server:

    npm run dev

Open the local URL displayed in the terminal.

### Available Commands

| Command | Description |
|---|---|
| npm ci | Install dependencies from the lockfile |
| npm run dev | Start the development server |
| npm run lint | Check source code with ESLint |
| npm run test | Run automated tests |
| npm run test:watch | Run tests in watch mode |
| npm run build | Create a production build |
| npm run preview | Preview the production build |

## Project Structure

    Exercise0.2/
    ├── src/
    │   ├── components/
    │   │   ├── EvidenceCard.jsx
    │   │   ├── EvidenceGrid.jsx
    │   │   └── PaginationControls.jsx
    │   ├── data/
    │   │   └── demoClips.js
    │   ├── utils/
    │   │   └── pagination.js
    │   ├── test/
    │   │   ├── accessibility.test.jsx
    │   │   ├── App.test.jsx
    │   │   ├── environment.test.jsx
    │   │   ├── EvidenceGrid.test.jsx
    │   │   ├── pagination.test.js
    │   │   ├── PaginationControls.test.jsx
    │   │   ├── regression.test.jsx
    │   │   └── setup.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── AI_FAILURE_AUDIT.md
    ├── Project_rules.md
    ├── TASK_DECOMPOSITION.md
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── eslint.config.js
    ├── vite.config.js
    └── .gitignore

## Component Responsibilities

| Component | Responsibility |
|---|---|
| App | Receives source clips and manages the requested page |
| EvidenceGrid | Derives and renders the clips for the current page |
| EvidenceCard | Displays information about an individual clip |
| PaginationControls | Requests page changes through a callback |
| pagination.js | Provides pure pagination calculation functions |
| demoClips.js | Provides fictional demonstration data |

## Zero-Effect Pagination

The main idea of this exercise is to keep source state separate from derived data.

The application stores only the requested page in local React state. The source clips are received through props, with a default demonstration collection.

Values such as totalPages, effectivePage, startIdx, and visibleItems are calculated directly from the current inputs during rendering.

The pagination calculations are:

    totalPages = Math.ceil(clips.length / pageSize) || 1

    startIdx = (effectivePage - 1) * pageSize

    visibleItems = clips.slice(startIdx, startIdx + pageSize)

The inputs are normalized before applying these calculations.

There is no additional state for visibleItems and no synchronization effect. This avoids unnecessary state updates and keeps the displayed data consistent with the current inputs.

The pagination utility is a pure function and does not mutate the source array.

## EvidenceGrid Contract

EvidenceGrid accepts the following props:

| Prop | Description |
|---|---|
| clips | Source array of evidence clips |
| page | Requested page number |
| pageSize | Number of clips per page, defaulting to six |

The parent component controls the current page.

Each EvidenceCard is rendered using its unique clip identifier as the React key rather than its array index.

This helps React preserve the correct component identity when items are reordered.

## Pagination Edge Cases

| Scenario | Behavior |
|---|---|
| Empty collection | One logical page with an empty state |
| One clip | One page containing one clip |
| Exactly six clips | One full page |
| Seven clips | Two pages, with one clip on the last page |
| Twelve clips | Two full pages |
| Thirteen clips | Three pages, with one clip on the last page |
| Invalid page | Falls back to page one |
| Page above the maximum | Clamped to the last available page |
| Invalid page size | Falls back to six |
| Non-array source | Treated as an empty collection |

When the source collection becomes smaller, the effective page is calculated again during rendering. The grid and pagination controls use the same valid page.

The requested page is not overwritten automatically. If the collection grows again before another navigation action, the previous requested page may become valid again.

## Responsive Layout

The evidence grid uses a named CSS query container.

    container-name: evidence;
    container-type: inline-size;

The number of columns depends on the available container width.

| Container width | Grid columns |
|---|---|
| Below 520px | 1 |
| 520px to below 800px | 2 |
| 800px and above | 3 |

Unlike media queries, container queries allow the same component to adapt to different parent layouts even when the
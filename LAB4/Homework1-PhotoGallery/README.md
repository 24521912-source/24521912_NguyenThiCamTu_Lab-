# FrameGallery

FrameGallery is a responsive photo gallery developed for Lab 4 of the Web Application Development course. The project focuses on client-side routing, URL-based filtering, native HTML dialogs, accessibility, and web performance.

The main idea is to make gallery interactions shareable through the URL. Users can filter images, open a specific image, refresh the page, or share a link without losing the selected gallery state.

## Features

- Multiple pages with client-side navigation.
- Responsive image gallery with six local demonstration illustrations.
- Category filtering through URL search parameters.
- Native HTML5 dialog for enlarged image previews.
- Direct links to individual images.
- Browser Back and Forward navigation support.
- Keyboard navigation and visible focus indicators.
- Focus restoration after closing the photo dialog.
- Reduced motion support.
- Native lazy loading and image loading priorities.
- Automated tests for routing, filtering, dialogs, accessibility, and performance-related attributes.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| React Router v7 | Client-side routing and URL state |
| Vite | Development server and production build |
| HTML5 | Semantic elements and native dialogs |
| CSS | Responsive layout and accessibility styling |
| Vitest | Automated testing |
| React Testing Library | Component and interaction testing |
| ESLint | Code quality checks |

## Getting Started

Make sure Node.js and npm are installed.

Install the project dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Available Commands

| Command | Description |
|---|---|
| `npm ci` | Install dependencies from the lock file |
| `npm run dev` | Start the development server |
| `npm run test` | Run automated tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code quality |
| `npm run build` | Generate the production build |
| `npm run preview` | Preview the production build locally |

## Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/gallery` | Photo gallery |
| `/about` | Project information |
| Unknown route | Not found page |

## URL-Based Gallery State

The gallery uses URL search parameters as its source of truth instead of maintaining separate React state for the selected category and photo.

| Example URL | Behavior |
|---|---|
| `/gallery` | Display all images |
| `/gallery?category=nature` | Display nature images |
| `/gallery?category=urban` | Display urban images |
| `/gallery?category=architecture` | Display architecture images |
| `/gallery?photoId=p01` | Open the first photo |
| `/gallery?category=nature&photoId=p01` | Filter the gallery and open the selected photo |

An unknown category falls back to the complete gallery. An invalid photo ID does not open the dialog.

Closing the dialog removes only the `photoId` parameter while preserving the category and other query parameters.

## Project Structure

```text
Homework1-PhotoGallery/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── PhotoCard.jsx
│   │   ├── PhotoDialog.jsx
│   │   ├── PhotoGalleryLayout.jsx
│   │   └── RouteAccessibility.jsx
│   ├── data/
│   │   ├── categories.js
│   │   └── photos.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── styles/
│   ├── test/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── AI_FAILURE_AUDIT.md
├── Project_rules.md
├── TASK_DECOMPOSITION.md
├── README.md
├── package.json
└── vite.config.js
```

## Native Dialog Implementation

The photo preview uses the native HTML5 `dialog` element.

The selected photo is derived from the `photoId` search parameter. A React effect synchronizes the dialog with the URL by calling `showModal()` or `close()` when necessary.

A ref provides access to the dialog element. Additional refs help restore keyboard focus after the dialog closes.

This approach avoids maintaining duplicate modal state and supports direct navigation to individual photos.

## Accessibility

The application includes semantic HTML landmarks, descriptive image alternative text, accessible button names, a keyboard skip link, route-specific document titles, and visible focus indicators.

The gallery also supports keyboard interaction, focus restoration, responsive layouts, and reduced motion preferences.

These features are designed with WCAG 2.2 Level AA in mind. Automated accessibility scores alone do not establish full WCAG conformance.

## Performance

The gallery uses lightweight local SVG illustrations. Image dimensions are declared to reduce unexpected layout shifts.

The first gallery image receives higher loading priority, while non-priority images use native lazy loading and asynchronous decoding.

Performance is evaluated using Lighthouse against the production preview rather than the development server.

Actual measurements and verification results are recorded in `TASK_DECOMPOSITION.md`.

## Testing

The automated test suite covers:

- Application routes and navigation.
- Category filtering and URL synchronization.
- Category utility functions.
- Native dialog state synchronization.
- Invalid and missing search parameters.
- Keyboard interactions and focus management.
- Document titles and semantic landmarks.
- Image metadata and loading attributes.

Native dialog methods are mocked in the shared test setup because the test environment does not fully reproduce browser dialog behavior.

Browser-specific behavior, responsive layouts, and Lighthouse metrics require separate manual verification.

## Development Process

The project is divided into seven tasks. Each task has a defined objective, implementation scope, acceptance criteria, and verification process.

The development workflow follows a contract-first and Red-Green-Refactor approach where applicable. Changes are committed after the relevant implementation and verification steps are completed.

Task progress and verification results are maintained in `TASK_DECOMPOSITION.md`.

AI-assisted development issues and their resolutions are documented separately in `AI_FAILURE_AUDIT.md`.

## Limitations

- The gallery uses a fixed collection of demonstration illustrations rather than a backend database.
- The illustrations are not real-world photographs or evidence.
- Image uploading and user authentication are outside the current project scope.
- Automated tests cannot reproduce every native browser or assistive technology behavior.
- Lighthouse results may vary depending on the browser, device, and testing environment.

## Academic Context

This project was developed as a practical exercise for the Web Application Development course.

Its purpose is to demonstrate React routing, URL-driven interface state, native browser APIs, accessibility, performance optimization, and a structured software development workflow.
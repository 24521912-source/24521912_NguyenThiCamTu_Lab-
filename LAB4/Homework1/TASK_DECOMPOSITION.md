# Task Decomposition — Lab 4, Homework 1

## Project Overview

**Project:** Production Multi-Route Photo & Evidence Gallery SPA

**Technology:** React 19, React Router v7, Vite, JavaScript, HTML and CSS.

The application provides a responsive photo gallery with URL-based category filtering and a native HTML dialog lightbox. The project targets WCAG 2.2 AA accessibility and a Lighthouse Performance score of 100.

The following tasks represent the implementation plan, not an official numbered assignment checklist.

## Progress Tracker

| ID | Task | Status |
|---|---|---|
| T01 | Repository Setup, Contracts and Task Decomposition | DONE |
| T02 | Multi-Route Layout and Gallery | TODO |
| T03 | URL-Based Category Filtering | TODO |
| T04 | Native Dialog Lightbox | TODO |
| T05 | Accessibility and Responsive UI | TODO |
| T06 | Performance and Regression | TODO |
| T07 | Documentation and Defense | TODO |

## Application Contracts

### Routes

- `/`: Home page.
- `/gallery`: Photo gallery page.
- `/about`: Project information page.
- `*`: Not found page.

### Search Parameters

- `category`: Selected photo category.
- `photoId`: Unique identifier of the selected photo.
- Missing or unknown categories display all photos.
- Missing or invalid photo IDs do not open the dialog.
- A valid photo ID can open independently of the active category.
- Closing the dialog removes only `photoId`.
- Unrelated search parameters are preserved.
- User-driven filter changes and photo opening create history entries.
- Explicit dialog closing removes the photo ID using history replacement.
- Browser Back and Forward navigation restore URL-derived state.

### Photo Data

Each photo contains:

- `id`: Stable and unique identifier.
- `title`: Human-readable photo title.
- `category`: Category identifier.
- `src`: Local image path.
- `alt`: Meaningful alternative text.
- `width`: Original image width.
- `height`: Original image height.

All images are demonstration assets, not real evidence.

## T01 — Repository Setup, Contracts and Task Decomposition

**Status:** DONE

**Objective:** Prepare the project structure, development environment and implementation contracts.

**Dependencies:** None.

**Affected paths:**

- `TASK_DECOMPOSITION.md`
- `Project_rules.md`
- `AI_FAILURE_AUDIT.md`
- `.gitignore`
- `package.json`
- `package-lock.json`
- Vite configuration and starter application files

**Contract:** Initialize a React application inside the existing Homework1 directory without modifying other exercises or creating a nested Git repository.

**Acceptance criteria:**

- Development environment is available.
- Project contracts are documented.
- React and React Router dependencies are installed.
- Development server starts successfully.
- Production build and lint checks pass.
- Test environment is configured.

**Edge cases:**

- Existing documentation must not be accidentally overwritten.
- Other homework directories must remain unchanged.
- Generated dependencies and build output must not be committed.

**Verification:** Check Git status, dependency versions, development server, lint, tests and production build.

**Commit:** `chore(hw1): initialize gallery project and contracts`

## T02 — Multi-Route Layout and Gallery

**Status:** TODO

**Objective:** Build the shared layout, navigation and responsive photo gallery.

**Dependencies:** T01.

**Affected paths:** `src/App.jsx`, `src/main.jsx`, `src/components/`, `src/pages/`, `src/data/`, `src/styles/`, `public/images/` and related tests.

**Contract:** Provide Home, Gallery, About and Not Found routes using React Router v7.

**Acceptance criteria:**

- Navigation works without full-page reloads.
- The active route is identifiable.
- Gallery cards display local demonstration photos.
- Every photo has a unique ID and meaningful alternative text.
- Unknown routes display a Not Found page.

**Edge cases:** Empty photo data, unknown routes and narrow screens.

**Verification:** Write route and gallery tests before implementation. Run automated tests and manually verify navigation.

**Commit:** `feat(hw1): build multi-route photo gallery`

## T03 — URL-Based Category Filtering

**Status:** TODO

**Objective:** Synchronize gallery filtering with URL search parameters.

**Dependencies:** T02.

**Affected paths:** Gallery page, category controls, photo filtering utilities and related tests.

**Contract:** Derive the active category and filtered photos directly from `useSearchParams()`.

**Acceptance criteria:**

- Category selection updates the URL.
- Direct links and refresh preserve the selected category.
- Browser Back and Forward restore filter state.
- Missing and invalid categories are handled safely.
- Unrelated search parameters remain unchanged.

**Edge cases:** Unknown categories, empty results and additional query parameters.

**Verification:** Write failing filter tests, implement filtering and verify browser history manually.

**Commit:** `feat(hw1): synchronize category filters with URL`

## T04 — Native Dialog Lightbox

**Status:** TODO

**Objective:** Implement a URL-driven photo lightbox using the native HTML dialog element.

**Dependencies:** T03.

**Affected paths:** `PhotoGalleryLayout.jsx`, dialog components, gallery controls and related tests.

**Contract:** Derive the selected photo from `photoId` and synchronize the native dialog using a ref and a narrowly scoped effect.

**Acceptance criteria:**

- Selecting a photo updates the URL and opens the dialog.
- Direct photo links open the correct photo.
- Closing the dialog removes only `photoId`.
- Escape closes the dialog consistently.
- Invalid photo IDs never open an empty dialog.
- Browser history remains predictable.

**Edge cases:** Invalid IDs, direct links, repeated opening, stale close events and photos outside the active category.

**Verification:** Test URL synchronization and manually verify native dialog behavior, Escape and browser history.

**Commit:** `feat(hw1): add URL-driven native lightbox`

## T05 — Accessibility and Responsive UI

**Status:** TODO

**Objective:** Improve keyboard accessibility, focus management and responsive layout.

**Dependencies:** T04.

**Affected paths:** Gallery components, dialog components, navigation, styles and accessibility tests.

**Contract:** Use semantic HTML, accessible names, visible focus indicators and predictable keyboard interaction.

**Acceptance criteria:**

- Interactive elements are keyboard accessible.
- Dialog focus is managed and restored appropriately.
- Text and controls have sufficient contrast.
- Layout remains usable on mobile screens and at increased zoom.
- Reduced-motion preferences are respected where applicable.

**Edge cases:** Direct modal links, missing opener elements, keyboard-only navigation and narrow viewports.

**Verification:** Run automated accessibility checks and manual keyboard, focus, contrast and reflow checks.

**Commit:** `fix(hw1): improve gallery accessibility and responsive layout`

## T06 — Performance and Regression

**Status:** TODO

**Objective:** Optimize application performance and verify existing functionality.

**Dependencies:** T05.

**Affected paths:** Image assets, gallery components, styles, build configuration and verification documentation.

**Contract:** Optimize local images and avoid unnecessary dependencies, layout shifts and redundant rendering.

**Acceptance criteria:**

- Production build succeeds.
- Lint and automated tests pass.
- No unexpected browser console errors occur.
- Gallery and dialog regression checks pass.
- Actual Lighthouse Performance results are recorded.
- The target Performance score is 100/100.

**Edge cases:** Slow loading, image failures, direct navigation, mobile layouts and repeated dialog interactions.

**Verification:** Run production preview, Lighthouse and regression tests. Record actual results and unresolved limitations.

**Commit:** `perf(hw1): optimize gallery and document verification`

## T07 — Documentation and Defense

**Status:** TODO

**Objective:** Complete project documentation and prepare for the oral defense.

**Dependencies:** T06.

**Affected paths:**

- `README.md`
- `TASK_DECOMPOSITION.md`
- `AI_FAILURE_AUDIT.md` (student-authored entries only)

**Contract:** Document the actual implementation, verification results and known limitations without inventing evidence.

**Acceptance criteria:**

- README explains installation, routes, query parameters and testing.
- Task statuses reflect actual completion.
- Genuine AI-related failures are documented by the student.
- Required evidence is saved locally.
- Oral defense preparation is complete.

**Edge cases:** Unmet performance targets, incomplete accessibility checks and unresolved defects.

**Verification:** Review documentation against the implemented application and actual test results.

**Commit:** `docs(hw1): finalize gallery documentation`

## Development Workflow

For each feature:

1. Define the expected behavior.
2. Write a failing automated test.
3. Implement the minimum required change.
4. Run tests and refactor when necessary.
5. Verify acceptance criteria.
6. Update the task status and actual results.
7. Create a meaningful Git commit.

## Verification Log

No application verification results have been recorded yet. Results will be added after the corresponding checks are performed.
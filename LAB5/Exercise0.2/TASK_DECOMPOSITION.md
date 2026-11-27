# Task Decomposition — Lab 5, Exercise 0.2

## 1. Project Overview

**Exercise:** Zero-Effect Pagination & Container Queries

**Objective:** Build a responsive evidence grid with derived pagination, stable React keys, accessible navigation, and CSS container queries without using effects to synchronize derived data.

**Development environment:** Windows, VS Code, PowerShell, React, Vite, npm, and Git.

The exercise is implemented independently from Exercise 0.1. The EvidenceGrid component should remain reusable for future integration with AppProvider.

## 2. Progress Tracker

| ID | Task | Dependencies | Status |
|---|---|---|---|
| T01 | Project setup, rules and task plan | None | DONE |
| T02 | Pure derived pagination and unit tests | T01 | done |
| T03 | EvidenceGrid, EvidenceCard and pagination controls | T02 | DONE |
| T04 | Responsive container queries and accessibility | T03 | DONE |
| T05 | Edge cases and regression tests | T04 | DONE |
| T06 | README, audit review and live defense | T05 | TODO |

Status values: TODO, IN PROGRESS, BLOCKED, DONE.

## 3. Task Details

### T01 — Project Setup, Rules and Task Plan

**Prerequisites:** None.

**Objective:** Prepare a clean and reproducible React development environment before implementing pagination.

**Affected files:**

- Project_rules.md
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md
- README.md
- .gitignore
- package.json
- package-lock.json
- index.html
- vite.config.js
- eslint.config.js
- src/main.jsx
- src/App.jsx
- src/index.css
- src/test/setup.js
- src/test/environment.test.jsx

**Implementation requirements:**

- Inspect the existing repository and development environment.
- Initialize React and Vite without creating a nested Git repository.
- Configure ESLint, Vitest, and React Testing Library.
- Use compatible dependency versions.
- Prepare a minimal working application.
- Create the task plan and audit structure.

**Edge cases:**

- Existing files must not be overwritten accidentally.
- Dependency conflicts must be investigated rather than forced.
- Unrelated changes from previous labs must remain untouched.

**Acceptance criteria:**

- The development server starts successfully.
- The application renders without runtime errors.
- The initial environment test passes.
- Lint and production build complete successfully.
- Generated files and dependencies are correctly ignored.
- The task plan is available before feature implementation.

**Verification commands:**

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`
- `git diff --check`
- `git status -sb`

**Suggested commit:**

`chore(ex0.2): initialize project and task plan`

### T02 — Pure Derived Pagination and Unit Tests

**Prerequisites:** T01 completed.

**Objective:** Implement pagination calculations as pure logic without effects or redundant state.

**Affected files:**

- src/utils/pagination.js
- src/test/pagination.test.js
- TASK_DECOMPOSITION.md

**Technical contract:**

- The default page size is six.
- Calculate totalPages, startIdx, and visibleItems from the source array.
- Normalize invalid page and pageSize values.
- Clamp the effective page within valid boundaries.
- Never mutate the source array.
- Do not use useEffect or additional state for derived pagination values.

**Edge cases:**

- Empty array.
- One item.
- Exactly six items.
- Seven, twelve, and thirteen items.
- Negative, zero, fractional, and invalid page values.
- Non-positive or non-integer page sizes.
- Data shrinking while the current page exceeds the new page count.

**Acceptance criteria:**

- Empty data produces one logical page and no visible items.
- Exact multiples do not create an additional empty page.
- Partial last pages contain the correct items.
- Invalid inputs are handled consistently.
- The original array remains unchanged.
- All focused unit tests pass.

**Verification commands:**

- `npm run test -- src/test/pagination.test.js`
- `npm run lint`
- `npm run test`
- `npm run build`

**Suggested commit:**

`feat(ex0.2): implement zero-effect pagination`

### T03 — EvidenceGrid, EvidenceCard and Pagination Controls

**Prerequisites:** T02 completed.

**Objective:** Build reusable React components and connect them to controlled pagination.

**Affected files:**

- src/components/EvidenceCard.jsx
- src/components/EvidenceGrid.jsx
- src/components/PaginationControls.jsx
- src/data/demoClips.js
- src/App.jsx
- src/test/EvidenceGrid.test.jsx
- src/test/App.test.jsx
- TASK_DECOMPOSITION.md

**Technical contract:**

- EvidenceGrid accepts clips, page, and pageSize = 6.
- The parent component owns the source data and current page.
- EvidenceGrid derives visible items during render.
- Each EvidenceCard uses a stable clip._id key.
- Pagination controls use the same effective page as EvidenceGrid.
- Demo clips use fictional content and unique IDs.
- Previous and Next controls respect page boundaries.

**Edge cases:**

- Empty evidence collection.
- Single-page collection.
- Partial last page.
- Repeated navigation attempts at page boundaries.
- Source data changing while viewing a later page.

**Acceptance criteria:**

- Six cards are displayed on the first page when enough items exist.
- Navigation displays the correct evidence cards.
- Previous is disabled on the first page.
- Next is disabled on the last page.
- The current page indicator matches the visible items.
- An empty state appears when no evidence is available.
- No redundant pagination state or synchronization effect is introduced.

**Verification commands:**

- `npm run test -- src/test/EvidenceGrid.test.jsx`
- `npm run test -- src/test/App.test.jsx`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run dev`

**Suggested commit:**

`feat(ex0.2): implement evidence grid and navigation`

### T04 — Responsive Container Queries and Accessibility

**Prerequisites:** T03 completed.

**Objective:** Replace rigid layout assumptions with flexible, accessible, container-based styling.

**Affected files:**

- src/index.css
- src/components/EvidenceGrid.jsx
- src/components/EvidenceCard.jsx
- src/components/PaginationControls.jsx
- src/App.jsx
- TASK_DECOMPOSITION.md

**Technical contract:**

- Use container-type: inline-size on an appropriate ancestor.
- Apply CSS @container rules to descendants.
- Use flexible grid columns and wrapping pagination controls.
- Use min-height: 100dvh where appropriate.
- Avoid fixed 800px layout assumptions.
- Interactive controls must be at least 44 by 44 CSS pixels.
- Provide accessible names, semantic elements, and visible keyboard focus.

**Edge cases:**

- Narrow container within a wide viewport.
- Wide container within the same viewport.
- Long evidence titles and descriptions.
- Small mobile screens.
- Keyboard-only navigation.
- Disabled pagination controls.

**Acceptance criteria:**

- Grid columns respond to container width rather than only viewport width.
- Cards remain readable at narrow widths.
- Pagination controls wrap without horizontal overflow.
- Interactive controls meet the minimum target size.
- Keyboard navigation and focus indicators work.
- Existing pagination tests continue to pass.

**Verification commands:**

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`

**Manual checks:**

- Inspect container query behavior using browser developer tools.
- Measure interactive control dimensions.
- Check keyboard navigation and visible focus.
- Inspect narrow and wide layouts for overflow.
- Check the browser console for errors.

**Suggested commit:**

`feat(ex0.2): implement responsive accessible layout`

### T05 — Edge Cases and Regression Tests

**Prerequisites:** T04 completed.

**Objective:** Verify pagination behavior, component integration, and responsive layout through automated and manual checks.

**Affected files:**

- src/test/pagination.test.js
- src/test/EvidenceGrid.test.jsx
- src/test/App.test.jsx
- src/test/PaginationControls.test.jsx
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md, if an actual incident occurred

**Test coverage:**

- Empty arrays and single-item collections.
- Collections containing 6, 7, 12, and 13 items.
- Default page size.
- First-page and last-page navigation.
- Invalid page and pageSize values.
- Data shrink and effective page clamping.
- Stable evidence IDs.
- Source array immutability.
- Accessible navigation and disabled boundary controls.

**Acceptance criteria:**

- All automated tests pass.
- Lint and production build pass.
- No effect is used to synchronize derived pagination data.
- No array index is used as an evidence key.
- Manual browser checks confirm container query behavior.
- Interaction targets and keyboard focus are verified manually.
- Any discovered defects are fixed and tested again.

Automated DOM tests do not replace real browser layout verification.

**Verification commands:**

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run dev`
- `git diff --check`

**Suggested commit:**

`test(ex0.2): verify pagination and responsive behavior`

### T06 — README, Audit Review and Live Defense

**Prerequisites:** T05 completed.

**Objective:** Finalize the project documentation and prepare for the classroom defense.

**Affected files:**

- README.md
- AI_FAILURE_AUDIT.md
- TASK_DECOMPOSITION.md

**Documentation requirements:**

- Explain the exercise objective and setup instructions.
- Describe the project structure and component responsibilities.
- Explain source state and derived pagination data.
- Document pagination formulas and input normalization.
- Explain stable React keys.
- Explain container queries compared with media queries.
- Describe accessibility features.
- Record actual verification results.
- Explain future integration with Exercise 0.1's AppProvider.

**Defense topics:**

- Why derived data should not be stored in secondary state.
- How synchronization effects can introduce unnecessary renders.
- How totalPages, startIdx, and visibleItems are calculated.
- How page clamping handles shrinking datasets.
- Why stable IDs are preferred over array indices.
- How container queries support reusable components.
- How to identify and fix a pagination boundary bug.

**Acceptance criteria:**

- README instructions are accurate and reproducible.
- The audit reflects actual incidents only.
- All tasks have been completed and committed.
- Final lint, test, and build checks pass.
- The application is ready for a live demonstration.
- Exercise 0.1 remains unchanged.

**Verification commands:**

- `npm run lint`
- `npm run test`
- `npm run build`
- `git diff --check`
- `git log -6 --oneline`
- `git status -sb`

**Suggested commit:**

`docs(ex0.2): finalize documentation and defense checklist`

## 4. Git Workflow

Each task must receive its own meaningful commit after implementation and verification.

Before committing:

- Update the current task status.
- Review the changed files.
- Run the relevant verification commands.
- Record actual AI-related incidents when appropriate.
- Stage only files belonging to the current task.
- Review the staged changes.
- Commit using the suggested Conventional Commit message.
- Verify the latest commit and repository status.

Do not stage unrelated exercises, node_modules, dist, environment files, or credentials.

## 5. Definition of Done

- [x] T01 — Project environment and task plan are ready.
- [x] T02 — Pure pagination logic and unit tests are complete.
- [x] T03 — Evidence components and controlled navigation work.
- [x] T04 — Responsive container queries and accessibility are implemented.
- [x] T05 — Regression tests and manual browser checks are complete.
- [ ] T06 — Documentation, audit review, and defense preparation are complete.
- [ ] All completed tasks have individual Git commits.
- [ ] Exercise 0.1 remains unchanged.
- [ ] Verification results reflect actual local execution.
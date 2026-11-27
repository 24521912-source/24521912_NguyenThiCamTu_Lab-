
# Task Decomposition — Lab 5, Exercise 0.1

## 1. Project Overview

**Exercise:** Pure useReducer & Split Context

**Objective:** Build a small React application that demonstrates predictable state management using a pure reducer, separate state and dispatch contexts, and proper DOM theme synchronization.

**Technology Stack:**

- React 19
- Vite
- JavaScript and JSX
- CSS
- Vitest
- React Testing Library
- ESLint
- npm and Git

## 2. Scope

The exercise focuses on:

- Pure reducer implementation.
- Immutable state updates.
- Separate state and dispatch contexts.
- Reusable application provider.
- Dark and light theme switching.
- Active tab management.
- Theme synchronization through an effect.
- Context render isolation.
- Accessibility and automated testing.

Pagination, backend services, databases, video playback,
WebSockets and later Lab 5 exercises are outside the scope.

## 3. Task Status

| ID | Task | Status |
| --- | --- | --- |
| T01 | Repository setup, React scaffold and governance | DONE |
| T02 | Pure reducer, initial state and unit tests | DONE |
| T03 | Split Context, AppProvider and consumer hooks | DONE |
| T04 | Theme synchronization and tab navigation UI | TODO |
| T05 | Render isolation, accessibility and regression tests | TODO |
| T06 | Documentation, audit review and live defense | TODO |

Status definitions:

- TODO: Work has not started.
- IN PROGRESS: Work is currently being implemented.
- BLOCKED: Work cannot continue until an issue is resolved.
- DONE: Acceptance criteria are satisfied and changes are committed.

## 4. Technical Contract

### Initial State

```js
{
  theme: 'dark',
  activeTab: 'reels'
}
```

### Supported Actions

| Action | Payload | Expected Behavior |
| --- | --- | --- |
| TOGGLE_THEME | None | Switch between dark and light |
| SET_ACTIVE_TAB | reels or overview | Update the active tab |

The second tab, overview, is an implementation choice
for demonstrating state transitions.

### Reducer Rules

- Never mutate the incoming state or action.
- Preserve unrelated state properties.
- Return the original state for unknown actions.
- Ignore unsupported tab values.
- Return the original state for redundant tab updates.
- Do not perform DOM mutations or other side effects.

### Context Rules

- Initialize both contexts using createContext(null).
- Use a single useReducer inside AppProvider.
- Expose state and dispatch through separate contexts.
- Pass dispatch directly without a wrapper object.
- Provide consumer hooks with clear provider errors.

### Theme Synchronization

The provider must synchronize the root data-theme attribute
using an effect that depends only on state.theme.

The reducer must remain independent of the DOM.

## 5. Task Details

### T01 — Repository Setup and Governance

**Status:** DONE

**Prerequisites:**

- Existing Git repository.
- Compatible Node.js and npm installation.
- Exercise directory.

**Objectives:**

- Initialize the React application.
- Configure testing and linting tools.
- Establish the task plan and project rules.
- Prepare an empty AI failure audit.

**Affected Paths:**

- Project_rules.md
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md
- .gitignore
- package.json
- package-lock.json
- index.html
- vite.config.js
- eslint.config.js
- src/App.jsx
- src/main.jsx
- src/index.css
- src/test/setup.js
- src/test/environment.test.js

**Acceptance Criteria:**

- React 19 application is initialized.
- npm dependencies are installed successfully.
- Development server starts.
- Environment smoke test passes.
- ESLint reports no errors.
- Production build succeeds.
- Governance files are available.
- Unrelated repository files remain untouched.

**Edge Cases:**

- Existing Git repository must not be reinitialized.
- Existing project rules must not be overwritten.
- Unrelated files must not be staged.
- Dependency and environment failures must be resolved
  before completing the task.

**Verification:**

```bash
npm run test
npm run lint
npm run build
```

**Commit:**

chore(ex0.1): initialize project and task plan

### T02 — Pure Reducer and Unit Tests

**Status:** DONE

**Prerequisites:** T01

**Objectives:**

- Define the initial application state.
- Implement a pure appReducer.
- Write focused reducer unit tests.

**Affected Paths:**

- src/context/appReducer.js
- src/context/appReducer.test.js
- TASK_DECOMPOSITION.md

**Acceptance Criteria:**

- Initial state contains dark theme and reels tab.
- Theme toggles correctly in both directions.
- Active tab changes correctly.
- Unrelated fields are preserved.
- Unknown actions return the original state.
- Invalid and redundant tab updates are ignored.
- Input state and action remain unchanged.
- Reducer performs no side effects.

**Edge Cases:**

- Consecutive theme toggles.
- Unsupported action types.
- Invalid or missing tab payload.
- Selecting the currently active tab.
- Frozen input state.
- Frozen action object.

**Verification:**

```bash
npm run test -- src/context/appReducer.test.js
npm run lint
npm run build
```

**Commit:**

feat(ex0.1): implement pure app reducer

### T03 — Split Context and AppProvider

**Status:** DONE

**Prerequisites:** T02

**Objectives:**

- Implement separate state and dispatch contexts.
- Connect both contexts to a single useReducer.
- Provide reusable consumer hooks.
- Verify provider behavior through integration tests.

**Affected Paths:**

- src/context/AppProvider.jsx
- src/context/appContexts.js
- src/context/useAppState.js
- src/context/useAppDispatch.js
- src/context/AppProvider.test.jsx
- src/main.jsx
- TASK_DECOMPOSITION.md

**Acceptance Criteria:**

- Both contexts are initialized with null.
- AppProvider exposes state and dispatch separately.
- Dispatch identity remains stable across state updates.
- Consumer hooks return the correct context values.
- Hooks report clear errors outside AppProvider.
- Existing reducer tests continue to pass.
- Fast Refresh lint rules remain enabled.

**Edge Cases:**

- Consumer rendered without a provider.
- Multiple consumers sharing the same provider.
- State updates triggered by a dispatch consumer.
- Consecutive actions.

**Verification:**

```bash
npm run test
npm run lint
npm run build
```

**Commit:**

feat(ex0.1): implement split context provider

### T04 — Theme and Tab Controls

**Status:** TODO

**Prerequisites:** T03

**Objectives:**

- Implement theme toggle controls.
- Synchronize the root data-theme attribute.
- Implement active tab navigation.
- Build a minimal accessible demonstration interface.

**Affected Paths:**

- src/context/AppProvider.jsx
- src/components/ThemeToggle.jsx
- src/components/TabNavigation.jsx
- src/components/ActiveTabContent.jsx
- src/App.jsx
- src/index.css
- src/test/App.test.jsx
- TASK_DECOMPOSITION.md

**Acceptance Criteria:**

- Initial theme is dark.
- Initial active tab is reels.
- Theme toggles between dark and light.
- Root data-theme matches the reducer state.
- Theme synchronization uses an effect with
  state.theme as its dependency.
- Changing tabs preserves the theme.
- Changing the theme preserves the active tab.
- Active content is derived during render.
- JSX uses className instead of class.
- Interactive controls have accessible names
  and visible keyboard focus.

**Edge Cases:**

- Repeated theme toggles.
- Repeated selection of the same tab.
- Tab changes after switching themes.
- Theme changes after switching tabs.
- Keyboard navigation and narrow viewport widths.

**Verification:**

```bash
npm run test
npm run lint
npm run build
npm run dev
```

**Commit:**

feat(ex0.1): implement theme and tab controls

### T05 — Render Isolation and Regression Tests

**Status:** TODO

**Prerequisites:** T04

**Objectives:**

- Verify dispatch-only context isolation.
- Test stable dispatch identity.
- Verify application state preservation.
- Review keyboard accessibility and responsive behavior.

**Affected Paths:**

- src/context/RenderIsolation.test.jsx
- src/context/AppProvider.test.jsx
- src/test/App.test.jsx
- src/index.css, if corrections are needed
- TASK_DECOMPOSITION.md

**Acceptance Criteria:**

- Controlled dispatch-only consumer does not receive
  state-context update notifications.
- State consumer receives relevant state updates.
- Render measurements use an update baseline.
- Strict Mode initialization behavior is considered.
- Theme and tab regression tests pass.
- Keyboard navigation works.
- Focus indicators remain visible.
- Both themes remain readable.
- No unsupported accessibility compliance claims are made.

**Edge Cases:**

- Parent-driven component renders.
- Stable versus changing props.
- Consecutive state updates.
- Strict Mode development behavior.
- Redundant reducer updates.

**Verification:**

```bash
npm run test
npm run lint
npm run build
npm run dev
```

**Commit:**

test(ex0.1): verify context isolation and reducer behavior

### T06 — Documentation and Live Defense

**Status:** TODO

**Prerequisites:** T05

**Objectives:**

- Document installation and execution instructions.
- Explain the architecture and technical decisions.
- Review the student-authored AI failure audit.
- Perform final verification.
- Prepare for the live defense.

**Affected Paths:**

- README.md
- AI_FAILURE_AUDIT.md
- TASK_DECOMPOSITION.md
- DEFENSE_CHECKLIST.md

**Acceptance Criteria:**

- README explains the project and architecture.
- Setup and verification commands are reproducible.
- Actual verification results are documented accurately.
- Audit contains only genuine incidents, if any.
- All exercise tasks are completed.
- Git history contains meaningful atomic commits.
- Student can explain reducer purity, immutability,
  split context and theme synchronization.
- Student can explain the limitations of render isolation.
- Student can diagnose an injected reducer or theme bug.

**Verification:**

```bash
npm run test
npm run lint
npm run build
git status -sb
git log -6 --oneline
```

**Commit:**

docs(ex0.1): finalize documentation and defense checklist

## 6. Git Workflow

Each completed task must include:

1. Implementation and relevant tests.
2. Local verification.
3. Task status update.
4. Audit review when a troubleshooting incident occurs.
5. Explicit staging of related files.
6. Staged diff review.
7. One meaningful atomic commit.

Do not stage unrelated exercises, dependencies,
build artifacts or secrets.

## 7. Definition of Done

The exercise is complete when the reducer is pure,
state and dispatch contexts are separated, theme
synchronization works correctly, tab transitions
preserve unrelated state, controlled render isolation
is verified, automated checks pass, documentation is
accurate and the student is ready for the live defense.

## 8. Verification Policy

Expected results are not actual results.

Only record test outcomes, render measurements,
commit references and troubleshooting incidents
after they have been observed locally.

The AI failure audit must be written by the student.

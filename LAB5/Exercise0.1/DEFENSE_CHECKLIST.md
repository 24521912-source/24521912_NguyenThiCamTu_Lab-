
# Live Defense Checklist — Exercise 0.1

## 1. Preparation

- [ ] Dependencies are installed.
- [ ] Development server starts successfully.
- [ ] Automated tests pass.
- [ ] ESLint reports no errors.
- [ ] Production build succeeds.
- [ ] Project documentation is up to date.
- [ ] AI failure audit reflects actual incidents.
- [ ] Git history contains meaningful task commits.

## 2. Application Demonstration

- [ ] Open the application.
- [ ] Show the initial dark theme and Reels tab.
- [ ] Switch to light mode.
- [ ] Navigate to Overview.
- [ ] Verify that the theme is preserved.
- [ ] Switch back to dark mode.
- [ ] Verify that Overview remains selected.
- [ ] Navigate back to Reels.
- [ ] Demonstrate keyboard interaction.
- [ ] Inspect the root data-theme attribute.

## 3. Important Source Files

| File | Responsibility |
| --- | --- |
| appReducer.js | Pure state transition logic |
| appContexts.js | Separate context definitions |
| AppProvider.jsx | State management and theme synchronization |
| useAppState.js | State context access |
| useAppDispatch.js | Dispatch context access |
| ThemeToggle.jsx | Theme switching |
| TabNavigation.jsx | Active tab selection |
| ActiveTabContent.jsx | Derived content rendering |
| RenderIsolation.test.jsx | Controlled render isolation tests |
| App.test.jsx | Application integration and regression tests |

## 4. Core Concepts

### Why useReducer?

It centralizes related state transitions and represents
updates using explicit actions.

This makes the update logic predictable and independently
testable.

### What makes a reducer pure?

The same state and action produce equivalent results
without modifying external data or performing side effects.

### Why are immutable updates important?

Immutable updates preserve previous state and allow React
to recognize changes through object identity.

### Why separate state and dispatch contexts?

State changes should not notify components that only
subscribe to the dispatch context.

### Why is dispatch stable?

React guarantees a stable dispatch function identity
within the same useReducer instance.

### Does Split Context prevent every render?

No. Props, parent renders, local state and other context
subscriptions can still trigger renders.

### Why useEffect for theme synchronization?

Updating the root HTML attribute synchronizes React state
with an external DOM value.

This side effect does not belong in the reducer.

### Why does active content not require an effect?

The content can be calculated directly from activeTab
during rendering.

Storing the result separately would duplicate state.

### Why return the original state for redundant actions?

When no actual state change is needed, returning the
original object allows React to skip unnecessary updates.

### Why use render baselines in tests?

Strict Mode can invoke component functions multiple times.

A baseline allows the test to focus on calls caused by
subsequent state updates.

## 5. Render Isolation Demonstration

Run:

```bash
npm run test -- src/context/RenderIsolation.test.jsx
```

Explain that:

- State consumers receive state context updates.
- Dispatch-only consumers do not receive state context updates.
- The test controls props and parent-driven rendering.
- Memoization does not block subscribed context updates.
- Changed props can still cause dispatch-only renders.
- Render function calls and committed renders are different
  measurements.

## 6. Debugging Practice

### Scenario A — State Mutation

Temporarily introduce a reducer mutation:

```javascript
state.theme = 'light';
return state;
```

Investigation:

- Run the reducer tests.
- Identify the incorrect state transition.
- Explain why direct mutation violates reducer purity.
- Restore an immutable state update.
- Rerun the tests.

### Scenario B — Incorrect Theme Condition

Temporarily introduce an inverted theme condition:

```javascript
theme: state.theme === 'dark'
  ? 'dark'
  : 'light',
```

Investigation:

- Run the focused reducer tests.
- Identify the failing theme transition.
- Correct the conditional expression.
- Rerun the tests.

### Scenario C — Incorrect Effect Dependency

Temporarily replace the theme dependency:

```javascript
useEffect(() => {
  document.documentElement.dataset.theme = state.theme;
}, [state]);
```

Investigation:

- Run the application regression tests.
- Inspect the unnecessary root theme mutation.
- Restore the state.theme dependency.
- Rerun the tests.

These scenarios are intentional debugging exercises,
not actual AI failure incidents.

Restore the working source code after every practice.

## 7. Ninety-Second Debugging Plan

| Time | Action |
| --- | --- |
| 0-15 seconds | Read the error or failing assertion |
| 15-35 seconds | Locate the responsible source code |
| 35-60 seconds | Explain and correct the root cause |
| 60-80 seconds | Rerun the focused test |
| 80-90 seconds | Explain the architectural lesson |

## 8. Final Verification

```bash
npm run test
npm run lint
npm run build
git status -sb
git log -6 --oneline
```

Do not report a successful check unless it has been
verified locally.


# Lab 5 — Exercise 0.1

## Pure useReducer & Split Context

This exercise demonstrates how React application state can
be managed using a pure reducer and separate contexts for
reading state and dispatching actions.

The application is intentionally small so that the focus
remains on state management rather than complex UI features.

## Features

- Dark and light theme switching.
- Navigation between Reels and Overview.
- Centralized state management using useReducer.
- Immutable reducer updates.
- Separate state and dispatch contexts.
- Reusable AppProvider and consumer hooks.
- Root DOM theme synchronization using useEffect.
- Keyboard-accessible controls.
- Responsive layout.
- Automated unit and integration tests.

## Technology Stack

- React 19
- Vite 7
- JavaScript and JSX
- CSS
- Vitest 4
- React Testing Library
- Jest DOM
- ESLint
- npm and Git

Vite 7 is used because the original Vite 8 native binding
could not be loaded under the local Windows Application
Control policy. The React version remains unchanged.

The exact dependency versions are recorded in package.json
and package-lock.json.

## Getting Started

Use a compatible Node.js and npm installation.

Install the dependencies:

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
| --- | --- |
| npm ci | Install locked dependencies |
| npm run dev | Start the development server |
| npm run test | Run automated tests |
| npm run test:watch | Run tests in watch mode |
| npm run lint | Check source code with ESLint |
| npm run build | Create a production build |
| npm run preview | Preview the production build |

## Project Structure

```text
Exercise0.1/
├── src/
│   ├── components/
│   │   ├── ActiveTabContent.jsx
│   │   ├── TabNavigation.jsx
│   │   └── ThemeToggle.jsx
│   ├── context/
│   │   ├── appContexts.js
│   │   ├── appReducer.js
│   │   ├── appReducer.test.js
│   │   ├── AppProvider.jsx
│   │   ├── AppProvider.test.jsx
│   │   ├── RenderIsolation.test.jsx
│   │   ├── useAppDispatch.js
│   │   └── useAppState.js
│   ├── test/
│   │   ├── App.test.jsx
│   │   ├── environment.test.js
│   │   └── setup.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── AI_FAILURE_AUDIT.md
├── DEFENSE_CHECKLIST.md
├── Project_rules.md
├── TASK_DECOMPOSITION.md
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Architecture

The application uses a single AppProvider containing a
useReducer hook.

```text
AppProvider
    |
    +-- useReducer(appReducer, initialState)
    |
    +-- AppStateContext
    |       |
    |       +-- State consumers
    |
    +-- AppDispatchContext
            |
            +-- Dispatch consumers
```

The state and dispatch contexts have separate values.

Components that need application state use useAppState().
Components that need to send actions use useAppDispatch().

Components that require both can use both hooks.

## State Management

The initial application state is:

```javascript
{
  theme: 'dark',
  activeTab: 'reels'
}
```

The reducer supports two actions.

| Action | Payload | Description |
| --- | --- | --- |
| TOGGLE_THEME | None | Switch between dark and light |
| SET_ACTIVE_TAB | reels or overview | Change the active tab |

Unknown actions and invalid tab values return the original
state. Selecting the current tab also returns the original
state without creating an unnecessary object.

## Reducer Purity

The reducer only calculates the next application state.

It does not modify the incoming state, perform DOM updates,
access external services or execute other side effects.

State changes use immutable object updates to preserve
unrelated properties.

This makes the reducer easier to understand, test and
maintain.

## Theme Synchronization

The reducer is the source of truth for the current theme.

The AppProvider synchronizes the theme with the root HTML
element using the following effect:

```javascript
useEffect(() => {
  document.documentElement.dataset.theme = state.theme;
}, [state.theme]);
```

CSS variables define the colors for dark and light themes.

Changing the active tab does not require another theme
synchronization.

The application uses one root provider because the HTML
theme attribute is shared by the entire document.

## Derived UI State

The active content is calculated directly from activeTab
during rendering.

No additional state or effect is required to store the
selected content.

This avoids duplicated state and unnecessary updates.

## Split Context and Render Isolation

The dispatch function returned by useReducer has a stable
identity within the same provider instance.

Separating state and dispatch allows dispatch-only consumers
to avoid context-driven updates when application state changes.

However, Split Context does not prevent all component renders.

Parent renders, changed props, local state and other context
subscriptions can still cause a component to render.

The render isolation tests use controlled component trees,
stable props, memoization and render baselines to verify
this behavior.

The tests also demonstrate that changed props can still
cause a dispatch-only consumer to render.

## Testing

The test suite covers:

- Application environment.
- Initial application state.
- Theme transitions.
- Active tab transitions.
- Reducer immutability.
- Unknown and redundant actions.
- Invalid tab values.
- Provider behavior.
- Consumer hooks.
- Stable dispatch identity.
- Theme synchronization.
- State preservation.
- Render isolation.
- Keyboard interaction.

Run the full verification commands:

```bash
npm run test
npm run lint
npm run build
```

### Final Verification Results

| Check | Result |
| --- | --- |
| Automated tests | Pending final verification |
| ESLint | Pending final verification |
| Production build | Pending final verification |
| Theme switching | Pending final verification |
| Tab navigation | Pending final verification |
| Keyboard navigation | Pending final verification |
| Responsive layout | Pending final verification |
| Browser console | Pending final verification |

The final results should reflect actual local verification.

## Accessibility

The application uses semantic HTML buttons, accessible
button names, visible keyboard focus and aria-pressed
attributes for tab selection.

Native keyboard behavior supports Tab, Shift+Tab, Enter
and Space.

The interface is designed to support narrow and wide
viewports.

These checks do not constitute a formal accessibility
compliance certification.

## Known Limitations

- State is reset when the page is refreshed.
- The application does not persist theme preferences.
- Reels and Overview are demonstration views.
- State consumers subscribe to the entire state context.
- Split Context does not eliminate all component renders.
- Theme synchronization assumes one root AppProvider.

These limitations are intentional because the exercise
focuses on reducer purity and Context architecture.

## Project Documentation

- Project_rules.md: Development and workflow requirements.
- TASK_DECOMPOSITION.md: Task plan and completion status.
- AI_FAILURE_AUDIT.md: Student-authored failure analysis.
- DEFENSE_CHECKLIST.md: Demonstration and defense preparation.

## Scope

This project implements Exercise 0.1 only.

Backend services, databases, pagination, video playback
and later Lab 5 exercises are outside the scope.

import ThemeToggle from './components/ThemeToggle.jsx';

import TabNavigation from './components/TabNavigation.jsx';

import ActiveTabContent from './components/ActiveTabContent.jsx';

import { useAppState } from './context/useAppState.js';

export default function App() {
  const { theme, activeTab } = useAppState();

  return (
    <main className="app">
      <div className="app-shell">
        <header className="app-header">
          <div className="header-content">
            <p className="eyebrow">
              Lab 5 / Exercise 0.1
            </p>

            <h1>Pure useReducer &amp; Split Context</h1>

            <p className="description">
              Predictable state management with
              separate context providers.
            </p>
          </div>

          <ThemeToggle />
        </header>

        <TabNavigation />

        <ActiveTabContent />

        <section
          className="state-card"
          aria-labelledby="state-title"
        >
          <h2 id="state-title">
            Application State
          </h2>

          <dl className="state-grid">
            <div className="state-item">
              <dt>Current theme</dt>
              <dd>{theme}</dd>
            </div>

            <div className="state-item">
              <dt>Active tab</dt>
              <dd>{activeTab}</dd>
            </div>
          </dl>
        </section>

        <footer className="app-footer">
          React 19 · useReducer · Split Context
        </footer>
      </div>
    </main>
  );
}
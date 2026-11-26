import { useState } from 'react';

import SwipeDeck from './components/SwipeDeck.jsx';
import demoProfiles from './data/profiles.js';

import {
  SWIPE_ACTIONS,
  appendSwipe,
  calculateScore,
  getRemainingProfiles,
} from './state/SwipeState.jsx';

import './App.css';

const actionLabels = {
  [SWIPE_ACTIONS.PASS]: 'Pass',
  [SWIPE_ACTIONS.LIKE]: 'Like',
  [SWIPE_ACTIONS.SUPER_LIKE]: 'Super Like',
};

function App({ profiles = demoProfiles }) {
  const [history, setHistory] = useState([]);

  const remainingProfiles = getRemainingProfiles(
    profiles,
    history,
  );

  const currentProfile = remainingProfiles[0] ?? null;
  const score = calculateScore(history);

  const scoreClass =
    score > 0
      ? 'positive-score'
      : score < 0
        ? 'negative-score'
        : '';

  function handleSwipe(action) {
    if (!currentProfile) {
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      profileId: currentProfile.id,
      action,
      createdAt: new Date().toISOString(),
    };

    setHistory((previousHistory) =>
      appendSwipe(profiles, previousHistory, entry),
    );
  }

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <div className="brand">
            <span className="brand-icon" aria-hidden="true">
              ♥
            </span>

            <div>
              <h1>Almost Love</h1>
              <p>Hen Ho Nhung Khong Yeu</p>
            </div>
          </div>

          <span className="app-tag">SWIPE DECK</span>
        </header>

        <section
          className="stats-grid"
          aria-label="Deck statistics"
          aria-live="polite"
        >
          <div className="stat-card">
            <span>Score</span>

            <strong
              className={scoreClass}
              data-testid="score-value"
            >
              {score > 0 ? `+${score}` : score}
            </strong>
          </div>

          <div className="stat-card">
            <span>Remaining</span>

            <strong data-testid="remaining-value">
              {remainingProfiles.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Swiped</span>

            <strong data-testid="swiped-value">
              {history.length}
            </strong>
          </div>
        </section>

        <SwipeDeck
          profile={currentProfile}
          remainingCount={remainingProfiles.length}
          totalProfiles={profiles.length}
          onSwipe={handleSwipe}
        />

        <section
          className="history-section"
          aria-labelledby="history-title"
        >
          <div className="history-header">
            <h2 id="history-title">Swipe history</h2>

            <span>
              {history.length}{' '}
              {history.length === 1 ? 'action' : 'actions'}
            </span>
          </div>

          {history.length === 0 ? (
            <p className="empty-history">
              Your swipe history is empty.
            </p>
          ) : (
            <ul className="history-list">
              {[...history].reverse().map((entry) => {
                const profile = profiles.find(
                  (item) => item.id === entry.profileId,
                );

                const isLike =
                  entry.action === SWIPE_ACTIONS.LIKE;

                return (
                  <li key={entry.id} className="history-item">
                    <div className="history-profile">
                      <span
                        className="history-avatar"
                        aria-hidden="true"
                      >
                        {profile?.name.charAt(0) || '?'}
                      </span>

                      <div>
                        <strong>
                          {profile?.name || 'Unknown profile'}
                        </strong>

                        <span>
                          {actionLabels[entry.action]}
                        </span>
                      </div>
                    </div>

                    <span
                      className={
                        isLike
                          ? 'positive-score'
                          : 'negative-score'
                      }
                    >
                      {isLike ? '+10' : '-5'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="app-footer">
          UIT Web Application Development · Lab 4
        </footer>
      </div>
    </main>
  );
}

export default App;
import { useCallback, useState } from 'react';

import SwipeDeck from './components/SwipeDeck.jsx';
import usePersistentDeck from './hooks/usePersistentDeck.js';

import {
  SWIPE_ACTIONS,
  appendSwipe,
  calculateScore,
  getRemainingProfiles,
  undoLastSwipe,
} from './state/SwipeState.jsx';

import './App.css';

const actionLabels = {
  [SWIPE_ACTIONS.PASS]: 'Pass',
  [SWIPE_ACTIONS.LIKE]: 'Like',
  [SWIPE_ACTIONS.SUPER_LIKE]: 'Super Like',
};

function DeckView({
  profiles,
  history,
  phase = 'ready',
  error = '',
  persistent = false,
  onSwipe,
  onUndo,
  onReload,
}) {
  const remainingProfiles = getRemainingProfiles(
    profiles,
    history,
  );

  const currentProfile =
    remainingProfiles[0] ?? null;

  const score = calculateScore(history);

  const scoreClass =
    score > 0
      ? 'positive-score'
      : score < 0
        ? 'negative-score'
        : '';

  const disabled = phase !== 'ready';

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <div className="brand">
            <span
              className="brand-icon"
              aria-hidden="true"
            >
              ♥
            </span>

            <div>
              <h1>Almost Love</h1>
              <p>Hen Ho Nhung Khong Yeu</p>
            </div>
          </div>

          <span className="app-tag">
            SWIPE DECK
          </span>
        </header>

        {persistent && (
          <div
            className="connection-status"
            role="status"
          >
            <span
              className={`connection-dot connection-${phase}`}
              aria-hidden="true"
            />

            {phase === 'loading' &&
              'Synchronizing with server...'}

            {phase === 'ready' &&
              'Synced with server'}

            {phase === 'saving' &&
              'Saving changes...'}

            {phase === 'error' &&
              'Synchronization required'}
          </div>
        )}

        {error && (
          <div
            className="request-error"
            role="alert"
          >
            <strong>
              Unable to synchronize
            </strong>

            <p>{error}</p>

            <p>
              Reload the deck before continuing.
            </p>

            <button
              type="button"
              className="retry-button"
              onClick={onReload}
            >
              Reload deck
            </button>
          </div>
        )}

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

        {phase === 'loading' ? (
          <section
            className="loading-deck"
            aria-label="Loading deck"
            aria-busy="true"
          >
            <div
              className="loading-spinner"
              aria-hidden="true"
            />

            <h2>Loading profiles</h2>

            <p>
              Retrieving your latest swipe history.
            </p>
          </section>
        ) : (
          <SwipeDeck
            profile={currentProfile}
            remainingCount={remainingProfiles.length}
            totalProfiles={profiles.length}
            canUndo={history.length > 0}
            disabled={disabled}
            onSwipe={onSwipe}
            onUndo={onUndo}
          />
        )}

        <section
          className="history-section"
          aria-labelledby="history-title"
        >
          <div className="history-header">
            <h2 id="history-title">
              Swipe history
            </h2>

            <span>
              {history.length}{' '}
              {history.length === 1
                ? 'action'
                : 'actions'}
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
                  (item) =>
                    item.id === entry.profileId,
                );

                const isLike =
                  entry.action === SWIPE_ACTIONS.LIKE;

                return (
                  <li
                    key={entry.id}
                    className="history-item"
                  >
                    <div className="history-profile">
                      <span
                        className="history-avatar"
                        aria-hidden="true"
                      >
                        {profile?.name.charAt(0) || '?'}
                      </span>

                      <div>
                        <strong>
                          {profile?.name ||
                            'Unknown profile'}
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

function LocalDeck({ profiles }) {
  const [history, setHistory] = useState([]);

  const handleSwipe = useCallback(
    (action, profileId) => {
      if (!profileId) {
        return;
      }

      const entry = {
        id: crypto.randomUUID(),
        profileId,
        action,
        createdAt: new Date().toISOString(),
      };

      setHistory((previous) =>
        appendSwipe(
          profiles,
          previous,
          entry,
        ),
      );
    },
    [profiles],
  );

  const handleUndo = useCallback(() => {
    setHistory((previous) =>
      undoLastSwipe(previous),
    );
  }, []);

  return (
    <DeckView
      profiles={profiles}
      history={history}
      onSwipe={handleSwipe}
      onUndo={handleUndo}
    />
  );
}

function PersistentDeck() {
  const deck = usePersistentDeck();

  return (
    <DeckView
      profiles={deck.profiles}
      history={deck.history}
      phase={deck.phase}
      error={deck.error}
      persistent
      onSwipe={deck.handleSwipe}
      onUndo={deck.handleUndo}
      onReload={deck.reloadDeck}
    />
  );
}

function App({ profiles }) {
  if (profiles !== undefined) {
    return <LocalDeck profiles={profiles} />;
  }

  return <PersistentDeck />;
}

export default App;
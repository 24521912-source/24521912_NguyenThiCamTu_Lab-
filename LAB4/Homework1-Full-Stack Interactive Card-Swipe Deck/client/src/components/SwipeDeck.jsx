import ProfileCard from './ProfileCard.jsx';
import SwipeListeners from './SwipeListeners.jsx';

import { SWIPE_ACTIONS } from '../state/SwipeState.jsx';

const actions = [
  {
    action: SWIPE_ACTIONS.PASS,
    label: 'Pass',
    symbol: '×',
    className: 'pass-action',
    points: '-5 points',
    shortcut: '←',
  },
  {
    action: SWIPE_ACTIONS.SUPER_LIKE,
    label: 'Super Like',
    symbol: '★',
    className: 'super-action',
    points: '-5 points',
    shortcut: '↑',
  },
  {
    action: SWIPE_ACTIONS.LIKE,
    label: 'Like',
    symbol: '♥',
    className: 'like-action',
    points: '+10 points',
    shortcut: '→',
  },
];

function SwipeDeck({
  profile,
  remainingCount,
  totalProfiles,
  canUndo,
  onSwipe,
  onUndo,
}) {
  const position = totalProfiles - remainingCount + 1;

  return (
    <section
      className="deck-section"
      aria-label="Profile deck"
    >
      <div className="gesture-hint">
        Drag the card or use your arrow keys.
      </div>

      <SwipeListeners
        key={profile?.id ?? 'empty'}
        profileId={profile?.id ?? null}
        onSwipe={onSwipe}
        onUndo={onUndo}
      >
        {profile ? (
          <ProfileCard
            profile={profile}
            position={position}
            total={totalProfiles}
          />
        ) : (
          <div className="empty-deck" role="status">
            <div
              className="empty-icon"
              aria-hidden="true"
            >
              ✓
            </div>

            <h2>No profiles remaining</h2>

            <p>
              Undo your latest swipe to restore a profile.
            </p>
          </div>
        )}
      </SwipeListeners>

      <div
        className="swipe-actions"
        aria-label="Swipe actions"
      >
        {actions.map((item) => (
          <button
            key={item.action}
            type="button"
            className={`action-button ${item.className}`}
            aria-label={item.label}
            disabled={!profile}
            onClick={() =>
              onSwipe(item.action, profile.id)
            }
          >
            <span
              className="action-symbol"
              aria-hidden="true"
            >
              {item.symbol}
            </span>

            <span className="action-label">
              {item.label}
            </span>

            <span className="action-points">
              {item.points}
            </span>

            <kbd aria-hidden="true">
              {item.shortcut}
            </kbd>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="undo-button"
        disabled={!canUndo}
        onClick={onUndo}
        aria-keyshortcuts="Backspace"
      >
        <span aria-hidden="true">↶</span>

        <span>Undo last swipe</span>

        <kbd aria-hidden="true">Backspace</kbd>
      </button>
    </section>
  );
}

export default SwipeDeck;
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
    keyboardShortcut: 'ArrowLeft',
  },
  {
    action: SWIPE_ACTIONS.SUPER_LIKE,
    label: 'Super Like',
    symbol: '★',
    className: 'super-action',
    points: '-5 points',
    shortcut: '↑',
    keyboardShortcut: 'ArrowUp',
  },
  {
    action: SWIPE_ACTIONS.LIKE,
    label: 'Like',
    symbol: '♥',
    className: 'like-action',
    points: '+10 points',
    shortcut: '→',
    keyboardShortcut: 'ArrowRight',
  },
];

function SwipeDeck({
  profile,
  remainingCount,
  totalProfiles,
  canUndo,
  disabled = false,
  onSwipe,
  onUndo,
}) {
  const position =
    totalProfiles - remainingCount + 1;

  return (
    <section
      className="deck-section"
      aria-label="Profile deck"
    >
      <div
        id="gesture-instructions"
        className="gesture-hint"
      >
        Drag the card or use your arrow keys.
      </div>

      <SwipeListeners
        key={profile?.id ?? 'empty'}
        profileId={
          disabled
            ? null
            : profile?.id ?? null
        }
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
        role="group"
        aria-label="Swipe actions"
        aria-describedby="gesture-instructions"
      >
        {actions.map((item) => (
          <button
            key={item.action}
            type="button"
            className={`action-button ${item.className}`}
            aria-label={item.label}
            aria-keyshortcuts={item.keyboardShortcut}
            aria-describedby={`points-${item.action}`}
            disabled={!profile || disabled}
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

            <span
              id={`points-${item.action}`}
              className="action-points"
            >
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
        disabled={!canUndo || disabled}
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
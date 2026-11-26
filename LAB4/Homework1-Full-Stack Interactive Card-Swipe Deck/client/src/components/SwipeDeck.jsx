import ProfileCard from './ProfileCard.jsx';
import { SWIPE_ACTIONS } from '../state/SwipeState.jsx';

const actions = [
  {
    action: SWIPE_ACTIONS.PASS,
    label: 'Pass',
    symbol: '×',
    className: 'pass-action',
    points: '-5 points',
  },
  {
    action: SWIPE_ACTIONS.SUPER_LIKE,
    label: 'Super Like',
    symbol: '★',
    className: 'super-action',
    points: '-5 points',
  },
  {
    action: SWIPE_ACTIONS.LIKE,
    label: 'Like',
    symbol: '♥',
    className: 'like-action',
    points: '+10 points',
  },
];

function SwipeDeck({
  profile,
  remainingCount,
  totalProfiles,
  onSwipe,
}) {
  const position = totalProfiles - remainingCount + 1;

  return (
    <section
      className="deck-section"
      aria-label="Profile deck"
    >
      {profile ? (
        <ProfileCard
          key={profile.id}
          profile={profile}
          position={position}
          total={totalProfiles}
        />
      ) : (
        <div className="empty-deck" role="status">
          <div className="empty-icon" aria-hidden="true">
            ✓
          </div>

          <h2>No profiles remaining</h2>

          <p>
            You have reached the end of the deck.
          </p>
        </div>
      )}

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
            onClick={() => onSwipe(item.action)}
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
          </button>
        ))}
      </div>
    </section>
  );
}

export default SwipeDeck;
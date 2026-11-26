import { describe, expect, it } from 'vitest';

import {
  SWIPE_ACTIONS,
  getRemainingProfiles,
  calculateScore,
  appendSwipe,
  undoLastSwipe,
} from '../state/SwipeState.jsx';
const profiles = [
  { id: 'profile-01', name: 'Emma' },
  { id: 'profile-02', name: 'Alex' },
  { id: 'profile-03', name: 'Sophia' },
];

function createEntry(profileId, action, id = 'action-01') {
  return {
    id,
    profileId,
    action,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('getRemainingProfiles', () => {
  it('returns all profiles when history is empty', () => {
    expect(getRemainingProfiles(profiles, [])).toEqual(
      profiles,
    );
  });

  it('excludes profiles already present in history', () => {
    const history = [
      createEntry('profile-01', SWIPE_ACTIONS.LIKE),
    ];

    expect(getRemainingProfiles(profiles, history)).toEqual([
      profiles[1],
      profiles[2],
    ]);
  });

  it('preserves the original profile order', () => {
    const history = [
      createEntry('profile-02', SWIPE_ACTIONS.PASS),
    ];

    expect(getRemainingProfiles(profiles, history)).toEqual([
      profiles[0],
      profiles[2],
    ]);
  });

  it('returns an empty queue when all profiles are swiped', () => {
    const history = profiles.map((profile, index) =>
      createEntry(
        profile.id,
        SWIPE_ACTIONS.LIKE,
        `action-${index}`,
      ),
    );

    expect(getRemainingProfiles(profiles, history)).toEqual([]);
  });

  it('handles an empty profile list', () => {
    expect(getRemainingProfiles([], [])).toEqual([]);
  });
});

describe('calculateScore', () => {
  it('returns zero for empty history', () => {
    expect(calculateScore([])).toBe(0);
  });

  it('adds ten points for LIKE', () => {
    expect(
      calculateScore([
        createEntry('profile-01', SWIPE_ACTIONS.LIKE),
      ]),
    ).toBe(10);
  });

  it('subtracts five points for PASS', () => {
    expect(
      calculateScore([
        createEntry('profile-01', SWIPE_ACTIONS.PASS),
      ]),
    ).toBe(-5);
  });

  it('subtracts five points for SUPER_LIKE', () => {
    expect(
      calculateScore([
        createEntry('profile-01', SWIPE_ACTIONS.SUPER_LIKE),
      ]),
    ).toBe(-5);
  });

  it('calculates mixed swipe actions correctly', () => {
    const history = [
      createEntry('profile-01', SWIPE_ACTIONS.LIKE, 'action-01'),
      createEntry('profile-02', SWIPE_ACTIONS.PASS, 'action-02'),
      createEntry(
        'profile-03',
        SWIPE_ACTIONS.SUPER_LIKE,
        'action-03',
      ),
    ];

    expect(calculateScore(history)).toBe(0);
  });
});

describe('appendSwipe', () => {
  it('appends a valid swipe action', () => {
    const entry = createEntry(
      'profile-01',
      SWIPE_ACTIONS.LIKE,
    );

    expect(appendSwipe(profiles, [], entry)).toEqual([entry]);
  });

  it('does not mutate the original history', () => {
    const history = Object.freeze([]);

    const entry = createEntry(
      'profile-01',
      SWIPE_ACTIONS.LIKE,
    );

    const nextHistory = appendSwipe(
      profiles,
      history,
      entry,
    );

    expect(history).toEqual([]);
    expect(nextHistory).not.toBe(history);
  });

  it('rejects an invalid action', () => {
    const history = [];

    const entry = createEntry('profile-01', 'UNKNOWN');

    expect(appendSwipe(profiles, history, entry)).toBe(
      history,
    );
  });

  it('rejects duplicate profile actions', () => {
    const history = [
      createEntry('profile-01', SWIPE_ACTIONS.LIKE),
    ];

    const entry = createEntry(
      'profile-01',
      SWIPE_ACTIONS.PASS,
      'action-02',
    );

    expect(appendSwipe(profiles, history, entry)).toBe(
      history,
    );
  });

  it('rejects a duplicated action identifier', () => {
    const history = [
      createEntry('profile-01', SWIPE_ACTIONS.LIKE),
    ];

    const entry = createEntry(
      'profile-02',
      SWIPE_ACTIONS.PASS,
    );

    expect(appendSwipe(profiles, history, entry)).toBe(
      history,
    );
  });

  it('rejects an action for a profile outside the queue head', () => {
    const history = [];

    const entry = createEntry(
      'profile-03',
      SWIPE_ACTIONS.LIKE,
    );

    expect(appendSwipe(profiles, history, entry)).toBe(
      history,
    );
  });

  it('rejects actions when the deck is exhausted', () => {
    const history = [];

    const entry = createEntry(
      'profile-01',
      SWIPE_ACTIONS.LIKE,
    );

    expect(appendSwipe([], history, entry)).toBe(history);
  });
});
describe('undoLastSwipe', () => {
  it('returns the same history when it is empty', () => {
    const history = [];

    expect(undoLastSwipe(history)).toBe(history);
  });

  it('removes only the latest action', () => {
    const history = [
      createEntry(
        'profile-01',
        SWIPE_ACTIONS.LIKE,
        'action-01',
      ),
      createEntry(
        'profile-02',
        SWIPE_ACTIONS.PASS,
        'action-02',
      ),
    ];

    expect(undoLastSwipe(history)).toEqual([
      history[0],
    ]);
  });

  it('does not mutate the original history', () => {
    const history = Object.freeze([
      createEntry(
        'profile-01',
        SWIPE_ACTIONS.LIKE,
      ),
    ]);

    const result = undoLastSwipe(history);

    expect(history).toHaveLength(1);
    expect(result).toEqual([]);
  });

  it('restores the latest profile to the queue', () => {
    const history = [
      createEntry(
        'profile-01',
        SWIPE_ACTIONS.LIKE,
        'action-01',
      ),
      createEntry(
        'profile-02',
        SWIPE_ACTIONS.PASS,
        'action-02',
      ),
    ];

    const restoredHistory = undoLastSwipe(history);

    expect(
      getRemainingProfiles(
        profiles,
        restoredHistory,
      ),
    ).toEqual([
      profiles[1],
      profiles[2],
    ]);
  });

  it('recalculates the score after undo', () => {
    const history = [
      createEntry(
        'profile-01',
        SWIPE_ACTIONS.LIKE,
        'action-01',
      ),
      createEntry(
        'profile-02',
        SWIPE_ACTIONS.PASS,
        'action-02',
      ),
    ];

    expect(calculateScore(history)).toBe(5);

    expect(
      calculateScore(undoLastSwipe(history)),
    ).toBe(10);
  });

  it('restores profiles in LIFO order', () => {
    const history = [
      createEntry(
        'profile-01',
        SWIPE_ACTIONS.LIKE,
        'action-01',
      ),
      createEntry(
        'profile-02',
        SWIPE_ACTIONS.PASS,
        'action-02',
      ),
      createEntry(
        'profile-03',
        SWIPE_ACTIONS.SUPER_LIKE,
        'action-03',
      ),
    ];

    const firstUndo = undoLastSwipe(history);

    expect(
      getRemainingProfiles(profiles, firstUndo)[0].id,
    ).toBe('profile-03');

    const secondUndo = undoLastSwipe(firstUndo);

    expect(
      getRemainingProfiles(profiles, secondUndo)[0].id,
    ).toBe('profile-02');

    const thirdUndo = undoLastSwipe(secondUndo);

    expect(
      getRemainingProfiles(profiles, thirdUndo)[0].id,
    ).toBe('profile-01');

    expect(calculateScore(thirdUndo)).toBe(0);
  });
});
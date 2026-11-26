export const SWIPE_ACTIONS = Object.freeze({
  PASS: 'PASS',
  LIKE: 'LIKE',
  SUPER_LIKE: 'SUPER_LIKE',
});

export function getRemainingProfiles(profiles, history) {
  const swipedProfileIds = new Set(
    history.map((entry) => entry.profileId),
  );

  return profiles.filter(
    (profile) => !swipedProfileIds.has(profile.id),
  );
}

export function calculateScore(history) {
  return history.reduce(
    (total, entry) =>
      total + (entry.action === SWIPE_ACTIONS.LIKE ? 10 : -5),
    0,
  );
}

export function appendSwipe(profiles, history, entry) {
  if (!entry || !entry.id) {
    return history;
  }

  if (!Object.values(SWIPE_ACTIONS).includes(entry.action)) {
    return history;
  }

  if (history.some((item) => item.id === entry.id)) {
    return history;
  }

  const remainingProfiles = getRemainingProfiles(
    profiles,
    history,
  );

  const currentProfile = remainingProfiles[0];

  if (!currentProfile) {
    return history;
  }

  if (currentProfile.id !== entry.profileId) {
    return history;
  }

  return [...history, entry];
}
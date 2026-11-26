import { SWIPE_ACTIONS } from './SwipeState.jsx';

export const SWIPE_THRESHOLD = 50;

export function resolveSwipeAction(deltaX, deltaY) {
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
    return null;
  }

  const horizontalDistance = Math.abs(deltaX);
  const verticalDistance = Math.abs(deltaY);

  if (
    Math.max(horizontalDistance, verticalDistance) <=
    SWIPE_THRESHOLD
  ) {
    return null;
  }

  if (horizontalDistance === verticalDistance) {
    return null;
  }

  if (horizontalDistance > verticalDistance) {
    return deltaX > 0
      ? SWIPE_ACTIONS.LIKE
      : SWIPE_ACTIONS.PASS;
  }

  if (deltaY < 0) {
    return SWIPE_ACTIONS.SUPER_LIKE;
  }

  return null;
}
import { describe, expect, it } from 'vitest';

import {
  resolveSwipeAction,
} from '../state/SwipeGestures.js';

import {
  SWIPE_ACTIONS,
} from '../state/SwipeState.jsx';

describe('resolveSwipeAction', () => {
  it('recognizes a right swipe', () => {
    expect(resolveSwipeAction(100, 10)).toBe(
      SWIPE_ACTIONS.LIKE,
    );
  });

  it('recognizes a left swipe', () => {
    expect(resolveSwipeAction(-100, 10)).toBe(
      SWIPE_ACTIONS.PASS,
    );
  });

  it('recognizes an upward swipe', () => {
    expect(resolveSwipeAction(10, -100)).toBe(
      SWIPE_ACTIONS.SUPER_LIKE,
    );
  });

  it('ignores a downward swipe', () => {
    expect(resolveSwipeAction(10, 100)).toBeNull();
  });

  it('ignores short gestures', () => {
    expect(resolveSwipeAction(20, 30)).toBeNull();
  });

  it('ignores exactly 50 pixels', () => {
    expect(resolveSwipeAction(50, 0)).toBeNull();
    expect(resolveSwipeAction(-50, 0)).toBeNull();
    expect(resolveSwipeAction(0, -50)).toBeNull();
  });

  it('accepts movement greater than 50 pixels', () => {
    expect(resolveSwipeAction(51, 0)).toBe(
      SWIPE_ACTIONS.LIKE,
    );
  });

  it('ignores equally diagonal gestures', () => {
    expect(resolveSwipeAction(100, 100)).toBeNull();
    expect(resolveSwipeAction(-100, -100)).toBeNull();
  });

  it('uses the dominant horizontal axis', () => {
    expect(resolveSwipeAction(120, -80)).toBe(
      SWIPE_ACTIONS.LIKE,
    );
  });

  it('uses the dominant vertical axis', () => {
    expect(resolveSwipeAction(80, -120)).toBe(
      SWIPE_ACTIONS.SUPER_LIKE,
    );
  });

  it('rejects invalid coordinates', () => {
    expect(resolveSwipeAction(NaN, 100)).toBeNull();
    expect(resolveSwipeAction(100, Infinity)).toBeNull();
  });
});
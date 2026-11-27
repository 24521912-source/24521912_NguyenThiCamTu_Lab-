import { describe, expect, it } from 'vitest';

import {
  appReducer,
  initialState,
} from './appReducer.js';

describe('appReducer', () => {
  it('defines the required initial state', () => {
    expect(initialState).toEqual({
      theme: 'dark',
      activeTab: 'reels',
    });
  });

  it('toggles the theme from dark to light', () => {
    const nextState = appReducer(initialState, {
      type: 'TOGGLE_THEME',
    });

    expect(nextState.theme).toBe('light');
    expect(nextState.activeTab).toBe('reels');
  });

  it('toggles the theme from light to dark', () => {
    const state = {
      theme: 'light',
      activeTab: 'reels',
    };

    const nextState = appReducer(state, {
      type: 'TOGGLE_THEME',
    });

    expect(nextState.theme).toBe('dark');
  });

  it('restores the original values after two theme toggles', () => {
    const action = {
      type: 'TOGGLE_THEME',
    };

    const firstState = appReducer(initialState, action);
    const secondState = appReducer(firstState, action);

    expect(secondState).toEqual(initialState);
  });

  it('changes the active tab to overview', () => {
    const nextState = appReducer(initialState, {
      type: 'SET_ACTIVE_TAB',
      payload: 'overview',
    });

    expect(nextState.activeTab).toBe('overview');
    expect(nextState.theme).toBe('dark');
  });

  it('changes the active tab back to reels', () => {
    const state = {
      theme: 'light',
      activeTab: 'overview',
    };

    const nextState = appReducer(state, {
      type: 'SET_ACTIVE_TAB',
      payload: 'reels',
    });

    expect(nextState.activeTab).toBe('reels');
    expect(nextState.theme).toBe('light');
  });

  it('preserves the active tab when toggling the theme', () => {
    const state = {
      theme: 'dark',
      activeTab: 'overview',
    };

    const nextState = appReducer(state, {
      type: 'TOGGLE_THEME',
    });

    expect(nextState).toEqual({
      theme: 'light',
      activeTab: 'overview',
    });
  });

  it('preserves unrelated state properties', () => {
    const state = {
      ...initialState,
      customValue: 100,
    };

    const nextState = appReducer(state, {
      type: 'TOGGLE_THEME',
    });

    expect(nextState.customValue).toBe(100);
  });

  it('returns the original state for an unknown action', () => {
    const nextState = appReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    });

    expect(nextState).toBe(initialState);
  });

  it.each([
    'invalid',
    '',
    null,
    undefined,
    123,
  ])('ignores an invalid tab payload: %s', (payload) => {
    const nextState = appReducer(initialState, {
      type: 'SET_ACTIVE_TAB',
      payload,
    });

    expect(nextState).toBe(initialState);
  });

  it('returns the original state for a redundant tab update', () => {
    const nextState = appReducer(initialState, {
      type: 'SET_ACTIVE_TAB',
      payload: 'reels',
    });

    expect(nextState).toBe(initialState);
  });

  it('does not mutate the incoming state or action', () => {
    const state = Object.freeze({
      theme: 'dark',
      activeTab: 'reels',
    });

    const action = Object.freeze({
      type: 'SET_ACTIVE_TAB',
      payload: 'overview',
    });

    const nextState = appReducer(state, action);

    expect(state).toEqual({
      theme: 'dark',
      activeTab: 'reels',
    });

    expect(action).toEqual({
      type: 'SET_ACTIVE_TAB',
      payload: 'overview',
    });

    expect(nextState).not.toBe(state);

    expect(nextState).toEqual({
      theme: 'dark',
      activeTab: 'overview',
    });
  });

  it('produces equivalent results for the same inputs', () => {
    const action = {
      type: 'TOGGLE_THEME',
    };

    const firstResult = appReducer(initialState, action);
    const secondResult = appReducer(initialState, action);

    expect(firstResult).toEqual(secondResult);
  });

  it('does not modify the root DOM theme', () => {
    const originalTheme =
      document.documentElement.dataset.theme;

    appReducer(initialState, {
      type: 'TOGGLE_THEME',
    });

    expect(document.documentElement.dataset.theme)
      .toBe(originalTheme);
  });
});
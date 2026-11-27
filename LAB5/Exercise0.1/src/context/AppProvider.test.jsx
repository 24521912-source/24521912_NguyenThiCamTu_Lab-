
import { describe, expect, it } from 'vitest';
import {
  act,
  renderHook,
} from '@testing-library/react';

import { AppProvider } from './AppProvider.jsx';
import { useAppState } from './useAppState.js';
import { useAppDispatch } from './useAppDispatch.js';

describe('AppProvider', () => {
  it('provides the required initial state', () => {
    const { result } = renderHook(
      () => useAppState(),
      { wrapper: AppProvider },
    );

    expect(result.current).toEqual({
      theme: 'dark',
      activeTab: 'reels',
    });
  });

  it('provides a dispatch function', () => {
    const { result } = renderHook(
      () => useAppDispatch(),
      { wrapper: AppProvider },
    );

    expect(typeof result.current).toBe('function');
  });

  it('updates the theme through dispatch', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    act(() => {
      result.current.dispatch({
        type: 'TOGGLE_THEME',
      });
    });

    expect(result.current.state).toEqual({
      theme: 'light',
      activeTab: 'reels',
    });
  });

  it('updates the active tab through dispatch', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    act(() => {
      result.current.dispatch({
        type: 'SET_ACTIVE_TAB',
        payload: 'overview',
      });
    });

    expect(result.current.state).toEqual({
      theme: 'dark',
      activeTab: 'overview',
    });
  });

  it('preserves dispatch identity after a theme update', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    const initialDispatch = result.current.dispatch;

    act(() => {
      result.current.dispatch({
        type: 'TOGGLE_THEME',
      });
    });

    expect(result.current.state.theme).toBe('light');

    expect(result.current.dispatch).toBe(
      initialDispatch,
    );
  });

  it('preserves dispatch identity after a tab update', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    const initialDispatch = result.current.dispatch;

    act(() => {
      result.current.dispatch({
        type: 'SET_ACTIVE_TAB',
        payload: 'overview',
      });
    });

    expect(result.current.state.activeTab).toBe(
      'overview',
    );

    expect(result.current.dispatch).toBe(
      initialDispatch,
    );
  });

  it('processes consecutive actions correctly', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    act(() => {
      result.current.dispatch({
        type: 'TOGGLE_THEME',
      });

      result.current.dispatch({
        type: 'SET_ACTIVE_TAB',
        payload: 'overview',
      });

      result.current.dispatch({
        type: 'TOGGLE_THEME',
      });
    });

    expect(result.current.state).toEqual({
      theme: 'dark',
      activeTab: 'overview',
    });
  });

  it('preserves state identity for an unknown action', () => {
    const { result } = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    const previousState = result.current.state;

    act(() => {
      result.current.dispatch({
        type: 'UNKNOWN_ACTION',
      });
    });

    expect(result.current.state).toBe(previousState);
  });

  it('keeps separate provider instances independent', () => {
    const first = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    const second = renderHook(
      () => ({
        state: useAppState(),
        dispatch: useAppDispatch(),
      }),
      { wrapper: AppProvider },
    );

    act(() => {
      first.result.current.dispatch({
        type: 'TOGGLE_THEME',
      });
    });

    expect(first.result.current.state.theme).toBe(
      'light',
    );

    expect(second.result.current.state.theme).toBe(
      'dark',
    );
  });
});

describe('Consumer hooks', () => {
  it('throws when useAppState is used outside AppProvider', () => {
    expect(() => {
      renderHook(() => useAppState());
    }).toThrow(
      'useAppState must be used within AppProvider.',
    );
  });

  it('throws when useAppDispatch is used outside AppProvider', () => {
    expect(() => {
      renderHook(() => useAppDispatch());
    }).toThrow(
      'useAppDispatch must be used within AppProvider.',
    );
  });
});
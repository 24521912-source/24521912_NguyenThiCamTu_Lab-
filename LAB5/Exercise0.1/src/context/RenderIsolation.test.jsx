import {
  memo,
  StrictMode,
  useState,
} from 'react';

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  render,
  screen,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { AppProvider } from './AppProvider.jsx';
import { useAppState } from './useAppState.js';
import { useAppDispatch } from './useAppDispatch.js';

function renderIsolationFixture() {
  const stateRender = vi.fn();
  const dispatchRender = vi.fn();

  const StateConsumer = memo(function StateConsumer() {
    const { theme, activeTab } = useAppState();

    stateRender();

    return (
      <div>
        <p>Theme: {theme}</p>
        <p>Active tab: {activeTab}</p>
      </div>
    );
  });

  const DispatchConsumer = memo(
    function DispatchConsumer() {
      const dispatch = useAppDispatch();

      dispatchRender();

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              dispatch({
                type: 'TOGGLE_THEME',
              });
            }}
          >
            Toggle theme
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch({
                type: 'SET_ACTIVE_TAB',
                payload: 'overview',
              });
            }}
          >
            Select overview
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch({
                type: 'SET_ACTIVE_TAB',
                payload: 'reels',
              });
            }}
          >
            Select reels
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch({
                type: 'UNKNOWN_ACTION',
              });
            }}
          >
            Unknown action
          </button>
        </div>
      );
    },
  );

  render(
    <StrictMode>
      <AppProvider>
        <StateConsumer />
        <DispatchConsumer />
      </AppProvider>
    </StrictMode>,
  );

  return {
    stateRender,
    dispatchRender,
  };
}

describe('Split Context render isolation', () => {
  it('isolates dispatch-only consumers from theme updates', async () => {
    const user = userEvent.setup();

    const {
      stateRender,
      dispatchRender,
    } = renderIsolationFixture();

    const stateBaseline =
      stateRender.mock.calls.length;

    const dispatchBaseline =
      dispatchRender.mock.calls.length;

    await user.click(
      screen.getByRole('button', {
        name: 'Toggle theme',
      }),
    );

    expect(
      screen.getByText('Theme: light'),
    ).toBeInTheDocument();

    expect(
      stateRender.mock.calls.length,
    ).toBeGreaterThan(stateBaseline);

    expect(
      dispatchRender.mock.calls.length,
    ).toBe(dispatchBaseline);
  });

  it('isolates dispatch-only consumers from tab updates', async () => {
    const user = userEvent.setup();

    const {
      stateRender,
      dispatchRender,
    } = renderIsolationFixture();

    const stateBaseline =
      stateRender.mock.calls.length;

    const dispatchBaseline =
      dispatchRender.mock.calls.length;

    await user.click(
      screen.getByRole('button', {
        name: 'Select overview',
      }),
    );

    expect(
      screen.getByText('Active tab: overview'),
    ).toBeInTheDocument();

    expect(
      stateRender.mock.calls.length,
    ).toBeGreaterThan(stateBaseline);

    expect(
      dispatchRender.mock.calls.length,
    ).toBe(dispatchBaseline);
  });

  it('preserves dispatch-only isolation across consecutive updates', async () => {
    const user = userEvent.setup();

    const {
      stateRender,
      dispatchRender,
    } = renderIsolationFixture();

    const stateBaseline =
      stateRender.mock.calls.length;

    const dispatchBaseline =
      dispatchRender.mock.calls.length;

    await user.click(
      screen.getByRole('button', {
        name: 'Toggle theme',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Select overview',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Toggle theme',
      }),
    );

    expect(
      screen.getByText('Theme: dark'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Active tab: overview'),
    ).toBeInTheDocument();

    expect(
      stateRender.mock.calls.length,
    ).toBeGreaterThan(stateBaseline);

    expect(
      dispatchRender.mock.calls.length,
    ).toBe(dispatchBaseline);
  });

  it('does not update consumers for a redundant tab action', async () => {
    const user = userEvent.setup();

    const {
      stateRender,
      dispatchRender,
    } = renderIsolationFixture();

    const stateBaseline =
      stateRender.mock.calls.length;

    const dispatchBaseline =
      dispatchRender.mock.calls.length;

    await user.click(
      screen.getByRole('button', {
        name: 'Select reels',
      }),
    );

    expect(
      screen.getByText('Active tab: reels'),
    ).toBeInTheDocument();

    expect(
      stateRender.mock.calls.length,
    ).toBe(stateBaseline);

    expect(
      dispatchRender.mock.calls.length,
    ).toBe(dispatchBaseline);
  });

  it('does not update consumers for an unknown action', async () => {
    const user = userEvent.setup();

    const {
      stateRender,
      dispatchRender,
    } = renderIsolationFixture();

    const stateBaseline =
      stateRender.mock.calls.length;

    const dispatchBaseline =
      dispatchRender.mock.calls.length;

    await user.click(
      screen.getByRole('button', {
        name: 'Unknown action',
      }),
    );

    expect(
      screen.getByText('Theme: dark'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Active tab: reels'),
    ).toBeInTheDocument();

    expect(
      stateRender.mock.calls.length,
    ).toBe(stateBaseline);

    expect(
      dispatchRender.mock.calls.length,
    ).toBe(dispatchBaseline);
  });

  it('allows a dispatch-only consumer to render when its props change', async () => {
    const user = userEvent.setup();

    const dispatchRender = vi.fn();

    const DispatchConsumer = memo(
      function DispatchConsumer({ label }) {
        const dispatch = useAppDispatch();

        dispatchRender();

        return (
          <button
            type="button"
            onClick={() => {
              dispatch({
                type: 'TOGGLE_THEME',
              });
            }}
          >
            {label}
          </button>
        );
      },
    );

    function Parent() {
      const [label, setLabel] =
        useState('Original label');

      return (
        <div>
          <button
            type="button"
            onClick={() => {
              setLabel('Updated label');
            }}
          >
            Change label
          </button>

          <DispatchConsumer label={label} />
        </div>
      );
    }

    render(
      <StrictMode>
        <AppProvider>
          <Parent />
        </AppProvider>
      </StrictMode>,
    );

    const dispatchBaseline =
      dispatchRender.mock.calls.length;

    await user.click(
      screen.getByRole('button', {
        name: 'Change label',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Updated label',
      }),
    ).toBeInTheDocument();

    expect(
      dispatchRender.mock.calls.length,
    ).toBeGreaterThan(dispatchBaseline);
  });
});
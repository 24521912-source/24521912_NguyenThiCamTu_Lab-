import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  render,
  screen,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import App from '../App.jsx';
import { AppProvider } from '../context/AppProvider.jsx';

function renderApp() {
  return render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
}

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe('Application theme and navigation', () => {
  it('starts with the dark theme', () => {
    renderApp();

    expect(
      document.documentElement,
    ).toHaveAttribute('data-theme', 'dark');

    expect(
      screen.getByRole('button', {
        name: 'Light mode',
      }),
    ).toBeInTheDocument();
  });

  it('starts with the reels tab', () => {
    renderApp();

    expect(
      screen.getByRole('button', {
        name: 'Reels',
      }),
    ).toHaveAttribute('aria-pressed', 'true');

    expect(
      screen.getByRole('heading', {
        name: 'Reels',
      }),
    ).toBeInTheDocument();
  });

  it('switches from dark to light theme', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Light mode',
      }),
    );

    expect(
      document.documentElement,
    ).toHaveAttribute('data-theme', 'light');

    expect(
      screen.getByRole('button', {
        name: 'Dark mode',
      }),
    ).toBeInTheDocument();
  });

  it('switches back from light to dark theme', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Light mode',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Dark mode',
      }),
    );

    expect(
      document.documentElement,
    ).toHaveAttribute('data-theme', 'dark');
  });

  it('switches to the overview tab', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Overview',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    ).toHaveAttribute('aria-pressed', 'true');

    expect(
      screen.getByRole('button', {
        name: 'Reels',
      }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches back to the reels tab', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Reels',
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Reels',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Overview',
      }),
    ).not.toBeInTheDocument();
  });

  it('preserves the active tab when changing the theme', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Light mode',
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Overview',
      }),
    ).toBeInTheDocument();

    expect(
      document.documentElement,
    ).toHaveAttribute('data-theme', 'light');
  });

  it('preserves the theme when changing tabs', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Light mode',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Reels',
      }),
    );

    expect(
      document.documentElement,
    ).toHaveAttribute('data-theme', 'light');

    expect(
      screen.getByRole('heading', {
        name: 'Reels',
      }),
    ).toBeInTheDocument();
  });

  it('keeps the current tab selected after a redundant click', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Reels',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Reels',
      }),
    ).toHaveAttribute('aria-pressed', 'true');

    expect(
      screen.getByRole('heading', {
        name: 'Reels',
      }),
    ).toBeInTheDocument();
  });

  it('supports theme switching using the keyboard', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.tab();

    expect(
      screen.getByRole('button', {
        name: 'Light mode',
      }),
    ).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(
      document.documentElement,
    ).toHaveAttribute('data-theme', 'light');
  });

  it('supports tab navigation using the keyboard', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.tab();
    await user.tab();
    await user.tab();

    expect(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    ).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(
      screen.getByRole('heading', {
        name: 'Overview',
      }),
    ).toBeInTheDocument();
  });
});
import {
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

describe('Application theme and navigation', () => {
  it('starts with the dark theme', () => {
    renderApp();

    expect(document.documentElement)
      .toHaveAttribute('data-theme', 'dark');

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

    expect(document.documentElement)
      .toHaveAttribute('data-theme', 'light');

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

    expect(document.documentElement)
      .toHaveAttribute('data-theme', 'dark');
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

    expect(document.documentElement)
      .toHaveAttribute('data-theme', 'light');
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

    expect(document.documentElement)
      .toHaveAttribute('data-theme', 'light');

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

    expect(document.documentElement)
      .toHaveAttribute('data-theme', 'light');
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

  it('does not rewrite the root theme during a tab-only update', async () => {
    const user = userEvent.setup();

    renderApp();

    const observer = new MutationObserver(() => {});

    const records = [];

    observer.disconnect();

    const themeObserver = new MutationObserver(
      (mutations) => {
        records.push(...mutations);
      },
    );

    themeObserver.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ['data-theme'],
      },
    );

    try {
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

      records.push(...themeObserver.takeRecords());

      expect(records).toHaveLength(0);

      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'dark');

      await user.click(
        screen.getByRole('button', {
          name: 'Light mode',
        }),
      );

      records.push(...themeObserver.takeRecords());

      expect(document.documentElement)
        .toHaveAttribute('data-theme', 'light');

      expect(records.length).toBeGreaterThan(0);
    } finally {
      themeObserver.disconnect();
    }
  });

  it('preserves mounted controls across theme changes', async () => {
    const user = userEvent.setup();

    renderApp();

    const themeButton = screen.getByRole(
      'button',
      { name: 'Light mode' },
    );

    const overviewButton = screen.getByRole(
      'button',
      { name: 'Overview' },
    );

    await user.click(overviewButton);
    await user.click(themeButton);

    expect(
      screen.getByRole('button', {
        name: 'Dark mode',
      }),
    ).toBe(themeButton);

    expect(
      screen.getByRole('button', {
        name: 'Overview',
      }),
    ).toBe(overviewButton);

    expect(overviewButton)
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('supports button activation using the Space key', async () => {
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

    await user.keyboard(' ');

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
  });
});
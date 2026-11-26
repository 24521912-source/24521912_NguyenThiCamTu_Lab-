import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import App from '../App.jsx';

const profiles = [
  {
    id: 'profile-01',
    name: 'Emma',
    age: 22,
    bio: 'First fictional profile.',
  },
  {
    id: 'profile-02',
    name: 'Alex',
    age: 23,
    bio: 'Second fictional profile.',
  },
];

function getAction(name) {
  return screen.getByRole('button', {
    name,
    exact: true,
  });
}

describe('Deck accessibility', () => {
  it('provides a main landmark and named profile deck', () => {
    render(<App profiles={profiles} />);

    expect(
      screen.getByRole('main'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', {
        name: 'Profile deck',
      }),
    ).toBeInTheDocument();
  });

  it('provides accessible names and keyboard shortcuts', () => {
    render(<App profiles={profiles} />);

    expect(
      getAction('Pass'),
    ).toHaveAttribute(
      'aria-keyshortcuts',
      'ArrowLeft',
    );

    expect(
      getAction('Like'),
    ).toHaveAttribute(
      'aria-keyshortcuts',
      'ArrowRight',
    );

    expect(
      getAction('Super Like'),
    ).toHaveAttribute(
      'aria-keyshortcuts',
      'ArrowUp',
    );

    expect(
      getAction('Undo last swipe'),
    ).toHaveAttribute(
      'aria-keyshortcuts',
      'Backspace',
    );
  });

  it('provides accessible scoring descriptions', () => {
    render(<App profiles={profiles} />);

    expect(
      getAction('Like'),
    ).toHaveAccessibleDescription(
      '+10 points',
    );

    expect(
      getAction('Pass'),
    ).toHaveAccessibleDescription(
      '-5 points',
    );

    expect(
      getAction('Super Like'),
    ).toHaveAccessibleDescription(
      '-5 points',
    );
  });

  it('announces statistics through a live region', () => {
    render(<App profiles={profiles} />);

    expect(
      screen.getByRole('region', {
        name: 'Deck statistics',
      }),
    ).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('supports Tab navigation between swipe buttons', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.tab();

    expect(
      getAction('Pass'),
    ).toHaveFocus();

    await user.tab();

    expect(
      getAction('Super Like'),
    ).toHaveFocus();

    await user.tab();

    expect(
      getAction('Like'),
    ).toHaveFocus();
  });

  it('supports activating a focused button with Enter', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.tab();
    await user.tab();
    await user.tab();

    expect(
      getAction('Like'),
    ).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(
      screen.getByRole('heading', {
        name: 'Alex, 23',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('+10');
  });

  it('ignores swipe shortcuts with the Shift modifier', () => {
    render(<App profiles={profiles} />);

    fireEvent.keyDown(window, {
      key: 'ArrowRight',
      shiftKey: true,
    });

    expect(
      screen.getByRole('heading', {
        name: 'Emma, 22',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent(/^0$/);
  });

  it('ignores shortcuts from editable content', () => {
    render(
      <>
        <div
          contentEditable=""
          role="textbox"
          aria-label="Editable content"
        />
        <App profiles={profiles} />
      </>,
    );

    fireEvent.keyDown(
      screen.getByRole('textbox', {
        name: 'Editable content',
      }),
      {
        key: 'ArrowRight',
      },
    );

    expect(
      screen.getByRole('heading', {
        name: 'Emma, 22',
      }),
    ).toBeInTheDocument();
  });

  it('announces an exhausted deck and disables swipe actions', async () => {
    const user = userEvent.setup();

    render(
      <App profiles={profiles.slice(0, 1)} />,
    );

    await user.click(
      getAction('Like'),
    );

    expect(
      screen.getByRole('status'),
    ).toHaveTextContent(
      'No profiles remaining',
    );

    expect(
      getAction('Like'),
    ).toBeDisabled();

    expect(
      getAction('Pass'),
    ).toBeDisabled();

    expect(
      getAction('Super Like'),
    ).toBeDisabled();

    expect(
      getAction('Undo last swipe'),
    ).toBeEnabled();
  });

  it('marks the gesture surface as unavailable when empty', () => {
    render(<App profiles={[]} />);

    expect(
      screen.getByTestId('swipe-surface'),
    ).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
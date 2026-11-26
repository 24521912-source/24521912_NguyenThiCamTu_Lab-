import { describe, expect, it } from 'vitest';

import {
  act,
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
  {
    id: 'profile-03',
    name: 'Sophia',
    age: 21,
    bio: 'Third fictional profile.',
  },
];

function getUndoButton() {
  return screen.getByRole('button', {
    name: /undo last swipe/i,
  });
}

function expectProfile(name) {
  expect(
    screen.getByRole('heading', { name }),
  ).toBeInTheDocument();
}

function expectScore(score) {
  const formattedScore =
    score > 0 ? `+${score}` : String(score);

  expect(
    screen.getByTestId('score-value').textContent,
  ).toBe(formattedScore);
}

function pointerEvent(target, type, options = {}) {
  const values = {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    clientX: 0,
    clientY: 0,
    ...options,
  };

  if (typeof window.PointerEvent === 'function') {
    fireEvent(
      target,
      new window.PointerEvent(type, values),
    );

    return;
  }

  const event = new MouseEvent(type, values);

  Object.defineProperties(event, {
    pointerId: {
      value: values.pointerId,
    },
    isPrimary: {
      value: values.isPrimary,
    },
  });

  fireEvent(target, event);
}

function dragCard(deltaX, deltaY) {
  const card = screen.getByTestId('swipe-surface');

  pointerEvent(card, 'pointerdown', {
    clientX: 100,
    clientY: 100,
  });

  pointerEvent(card, 'pointermove', {
    clientX: 100 + deltaX,
    clientY: 100 + deltaY,
  });

  pointerEvent(card, 'pointerup', {
    clientX: 100 + deltaX,
    clientY: 100 + deltaY,
  });
}

describe('Keyboard controls', () => {
  it('swipes left using ArrowLeft', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowLeft}');

    expectProfile('Alex, 23');
    expectScore(-5);
  });

  it('swipes right using ArrowRight', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowRight}');

    expectProfile('Alex, 23');
    expectScore(10);
  });

  it('swipes upward using ArrowUp', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowUp}');

    expectProfile('Alex, 23');
    expectScore(-5);
  });

  it('undoes the latest action using Backspace', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Backspace}');

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores repeated keyboard events', () => {
    render(<App profiles={profiles} />);

    fireEvent.keyDown(window, {
      key: 'ArrowRight',
      repeat: true,
    });

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores keys inside editable inputs', async () => {
    const user = userEvent.setup();

    render(
      <>
        <input aria-label="Search" />
        <App profiles={profiles} />
      </>,
    );

    await user.click(
      screen.getByRole('textbox', {
        name: 'Search',
      }),
    );

    await user.keyboard('{ArrowRight}');

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores unrelated keyboard keys', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowDown}a');

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores modified keyboard shortcuts', () => {
    render(<App profiles={profiles} />);

    fireEvent.keyDown(window, {
      key: 'ArrowRight',
      ctrlKey: true,
    });

    expectProfile('Emma, 22');
    expectScore(0);
  });
});

describe('Pointer controls', () => {
  it('supports a right pointer swipe', () => {
    render(<App profiles={profiles} />);

    dragCard(100, 10);

    expectProfile('Alex, 23');
    expectScore(10);
  });

  it('supports a left pointer swipe', () => {
    render(<App profiles={profiles} />);

    dragCard(-100, 10);

    expectProfile('Alex, 23');
    expectScore(-5);
  });

  it('supports an upward pointer swipe', () => {
    render(<App profiles={profiles} />);

    dragCard(10, -100);

    expectProfile('Alex, 23');
    expectScore(-5);
  });

  it('ignores short pointer gestures', () => {
    render(<App profiles={profiles} />);

    dragCard(20, 10);

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores downward pointer gestures', () => {
    render(<App profiles={profiles} />);

    dragCard(10, 100);

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores equally diagonal gestures', () => {
    render(<App profiles={profiles} />);

    dragCard(100, -100);

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores cancelled pointer gestures', () => {
    render(<App profiles={profiles} />);

    const card = screen.getByTestId('swipe-surface');

    pointerEvent(card, 'pointerdown', {
      clientX: 100,
      clientY: 100,
    });

    pointerEvent(card, 'pointercancel');

    pointerEvent(card, 'pointerup', {
      clientX: 250,
      clientY: 100,
    });

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('ignores pointer events from another pointer', () => {
    render(<App profiles={profiles} />);

    const card = screen.getByTestId('swipe-surface');

    pointerEvent(card, 'pointerdown', {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });

    pointerEvent(card, 'pointerup', {
      pointerId: 2,
      clientX: 250,
      clientY: 100,
    });

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('does not swipe twice from repeated pointer-up events', () => {
    render(<App profiles={profiles} />);

    const card = screen.getByTestId('swipe-surface');

    pointerEvent(card, 'pointerdown', {
      clientX: 100,
      clientY: 100,
    });

    pointerEvent(card, 'pointerup', {
      clientX: 250,
      clientY: 100,
    });

    pointerEvent(
      screen.getByTestId('swipe-surface'),
      'pointerup',
      {
        clientX: 250,
        clientY: 100,
      },
    );

    expectProfile('Alex, 23');
    expectScore(10);

    expect(
      screen.getByTestId('swiped-value'),
    ).toHaveTextContent(/^1$/);
  });

  it('blocks keyboard swipes during a pointer gesture', () => {
    render(<App profiles={profiles} />);

    const card = screen.getByTestId('swipe-surface');

    pointerEvent(card, 'pointerdown', {
      clientX: 100,
      clientY: 100,
    });

    fireEvent.keyDown(window, {
      key: 'ArrowRight',
    });

    expectProfile('Emma, 22');
    expectScore(0);

    pointerEvent(card, 'pointerup', {
      clientX: 250,
      clientY: 100,
    });

    expectProfile('Alex, 23');
    expectScore(10);
  });
});

describe('LIFO undo controls', () => {
  it('disables undo when history is empty', () => {
    render(<App profiles={profiles} />);

    expect(getUndoButton()).toBeDisabled();
  });

  it('restores a profile using the undo button', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.click(
      screen.getByRole('button', {
        name: 'Like',
        exact: true,
      }),
    );

    await user.click(getUndoButton());

    expectProfile('Emma, 22');
    expectScore(0);

    expect(getUndoButton()).toBeDisabled();
  });

  it('undoes multiple actions in reverse order', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowLeft}');
    await user.keyboard('{ArrowUp}');

    expectScore(0);

    expect(
      screen.getByRole('heading', {
        name: 'No profiles remaining',
      }),
    ).toBeInTheDocument();

    await user.keyboard('{Backspace}');

    expectProfile('Sophia, 21');
    expectScore(5);

    await user.keyboard('{Backspace}');

    expectProfile('Alex, 23');
    expectScore(10);

    await user.keyboard('{Backspace}');

    expectProfile('Emma, 22');
    expectScore(0);

    expect(getUndoButton()).toBeDisabled();
  });

  it('safely ignores undo on an empty history', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{Backspace}');

    expectProfile('Emma, 22');
    expectScore(0);
  });

  it('allows a restored profile to be swiped again', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Backspace}');
    await user.keyboard('{ArrowLeft}');

    expectProfile('Alex, 23');
    expectScore(-5);

    expect(
      screen.getByTestId('swiped-value'),
    ).toHaveTextContent(/^1$/);
  });

  it('rejects stale duplicate swipes in one update batch', () => {
    render(<App profiles={profiles} />);

    act(() => {
      fireEvent.keyDown(window, {
        key: 'ArrowRight',
      });

      fireEvent.keyDown(window, {
        key: 'ArrowRight',
      });
    });

    expectProfile('Alex, 23');
    expectScore(10);
  });
});
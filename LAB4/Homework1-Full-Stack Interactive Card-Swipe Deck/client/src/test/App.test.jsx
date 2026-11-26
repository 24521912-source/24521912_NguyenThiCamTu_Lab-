import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  render,
  screen,
  within,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import App from '../App.jsx';

const profiles = [
  {
    id: 'profile-01',
    name: 'Emma',
    age: 22,
    bio: 'A fictional test profile.',
    avatar: '/avatars/profile-01.svg',
  },
  {
    id: 'profile-02',
    name: 'Alex',
    age: 23,
    bio: 'Another fictional test profile.',
    avatar: '/avatars/profile-02.svg',
  },
  {
    id: 'profile-03',
    name: 'Sophia',
    age: 21,
    bio: 'The final fictional test profile.',
    avatar: '/avatars/profile-03.svg',
  },
];

describe('Swipe deck application', () => {
  it('displays the first profile and initial statistics', () => {
    render(<App profiles={profiles} />);

    expect(
      screen.getByRole('heading', { name: 'Emma, 22' }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('0');

    expect(
      screen.getByTestId('remaining-value'),
    ).toHaveTextContent('3');

    expect(
      screen.getByTestId('swiped-value'),
    ).toHaveTextContent('0');
  });

  it('adds ten points and advances the deck after Like', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.click(
      screen.getByRole('button', { name: 'Like', exact: true }),
    );

    expect(
      screen.getByRole('heading', { name: 'Alex, 23' }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Emma, 22' }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('+10');

    expect(
      screen.getByTestId('remaining-value'),
    ).toHaveTextContent('2');

    expect(
      screen.getByTestId('swiped-value'),
    ).toHaveTextContent('1');
  });

  it('subtracts five points after Pass', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.click(
      screen.getByRole('button', { name: 'Pass', exact: true }),
    );

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('-5');

    expect(
      screen.getByRole('heading', { name: 'Alex, 23' }),
    ).toBeInTheDocument();
  });

  it('subtracts five points after Super Like', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.click(
      screen.getByRole('button', { name: 'Super Like' }),
    );

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('-5');
  });

  it('displays the latest history entry first', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.click(
      screen.getByRole('button', { name: 'Like', exact: true }),
    );

    await user.click(
      screen.getByRole('button', { name: 'Pass', exact: true }),
    );

    const history = screen.getByRole('region', {
      name: 'Swipe history',
    });

    const entries = within(history).getAllByRole('listitem');

    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent('Alex');
    expect(entries[0]).toHaveTextContent('Pass');
    expect(entries[1]).toHaveTextContent('Emma');
    expect(entries[1]).toHaveTextContent('Like');

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('+5');
  });

  it('disables action buttons when the deck is exhausted', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles.slice(0, 1)} />);

    await user.click(
      screen.getByRole('button', { name: 'Like', exact: true }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'No profiles remaining',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('remaining-value'),
    ).toHaveTextContent('0');

    expect(
      screen.getByRole('button', { name: 'Like', exact: true }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'Pass', exact: true }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'Super Like' }),
    ).toBeDisabled();
  });

  it('handles an empty profile list safely', () => {
    render(<App profiles={[]} />);

    expect(
      screen.getByRole('heading', {
        name: 'No profiles remaining',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent('0');

    expect(
      screen.getByTestId('remaining-value'),
    ).toHaveTextContent('0');

    expect(
      screen.getByRole('button', { name: 'Like', exact: true }),
    ).toBeDisabled();
  });

  it('calculates the final score from the complete history', async () => {
    const user = userEvent.setup();

    render(<App profiles={profiles} />);

    await user.click(
      screen.getByRole('button', { name: 'Like', exact: true }),
    );

    await user.click(
      screen.getByRole('button', { name: 'Pass', exact: true }),
    );

    await user.click(
      screen.getByRole('button', { name: 'Super Like' }),
    );

    expect(
      screen.getByTestId('score-value'),
    ).toHaveTextContent(/^0$/);

    expect(
      screen.getByTestId('remaining-value'),
    ).toHaveTextContent('0');

    expect(
      screen.getByTestId('swiped-value'),
    ).toHaveTextContent('3');
  });
});
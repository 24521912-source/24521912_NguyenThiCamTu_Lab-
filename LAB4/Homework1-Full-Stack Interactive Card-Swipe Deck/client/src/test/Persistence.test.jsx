import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import App from '../App.jsx';

import {
  SESSION_ID,
} from '../api/swipeApi.js';

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

function createEntry(
  profileId,
  action = 'LIKE',
  id = 'action-01',
) {
  return {
    id,
    profileId,
    action,
    sessionId: SESSION_ID,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

function response(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function deferred() {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

function createMockServer(initialHistory = []) {
  let history = [...initialHistory];
  let actionCount = history.length;

  const fetchMock = vi.fn(
    async (url, options = {}) => {
      const path = new URL(url).pathname;

      const method =
        options.method || 'GET';

      if (
        path.endsWith('/profiles') &&
        method === 'GET'
      ) {
        return response(profiles);
      }

      if (
        path.endsWith(
          `/swipe/history/${SESSION_ID}`,
        ) &&
        method === 'GET'
      ) {
        return response([...history]);
      }

      if (
        path.endsWith('/swipe') &&
        method === 'POST'
      ) {
        const payload = JSON.parse(options.body);

        const duplicate = history.some(
          (item) =>
            item.profileId === payload.profileId,
        );

        if (duplicate) {
          return response(
            {
              message: 'Profile already swiped',
            },
            409,
          );
        }

        const entry = createEntry(
          payload.profileId,
          payload.action,
          `action-${++actionCount}`,
        );

        history = [...history, entry];

        return response(entry, 201);
      }

      if (
        path.endsWith('/last') &&
        method === 'DELETE'
      ) {
        const latest = history.at(-1);

        if (!latest) {
          return response(
            {
              message: 'No swipe action to undo',
            },
            404,
          );
        }

        const payload = JSON.parse(options.body);

        if (
          payload.expectedActionId !== latest.id
        ) {
          return response(
            {
              message: 'Swipe history has changed',
            },
            409,
          );
        }

        history = history.slice(0, -1);

        return response(latest);
      }

      return response(
        {
          message: 'Endpoint not found',
        },
        404,
      );
    },
  );

  vi.stubGlobal('fetch', fetchMock);

  return {
    fetchMock,
    getHistory: () => [...history],
    setHistory: (value) => {
      history = [...value];
      actionCount = Math.max(
        actionCount,
        history.length,
      );
    },
  };
}

async function expectProfile(name) {
  expect(
    await screen.findByRole('heading', {
      name,
    }),
  ).toBeInTheDocument();
}

function expectScore(value) {
  const formatted =
    value > 0 ? `+${value}` : String(value);

  expect(
    screen.getByTestId('score-value').textContent,
  ).toBe(formatted);
}

function likeButton() {
  return screen.getByRole('button', {
    name: 'Like',
    exact: true,
  });
}

function undoButton() {
  return screen.getByRole('button', {
    name: /undo last swipe/i,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Persistent swipe deck', () => {
  it('loads profiles and persisted history on startup', async () => {
    createMockServer([
      createEntry('profile-01'),
    ]);

    render(<App />);

    await expectProfile('Alex, 23');

    expectScore(10);

    expect(
      screen.getByTestId('remaining-value'),
    ).toHaveTextContent(/^2$/);
  });

  it('waits for server confirmation before changing history', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer();

    render(<App />);

    await expectProfile('Emma, 22');

    const pending = deferred();

    mockServer.fetchMock.mockImplementationOnce(
      () => pending.promise,
    );

    await user.click(likeButton());

    expectScore(0);

    expect(
      screen.getByRole('heading', {
        name: 'Emma, 22',
      }),
    ).toBeInTheDocument();

    expect(likeButton()).toBeDisabled();

    pending.resolve(
      response(
        createEntry('profile-01'),
        201,
      ),
    );

    await expectProfile('Alex, 23');

    expectScore(10);
  });

  it('prevents additional requests while saving', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer();

    render(<App />);

    await expectProfile('Emma, 22');

    const pending = deferred();

    mockServer.fetchMock.mockImplementationOnce(
      () => pending.promise,
    );

    await user.click(likeButton());

    fireEvent.keyDown(window, {
      key: 'ArrowRight',
    });

    fireEvent.keyDown(window, {
      key: 'ArrowLeft',
    });

    const postRequests =
      mockServer.fetchMock.mock.calls.filter(
        ([, options]) =>
          options?.method === 'POST',
      );

    expect(postRequests).toHaveLength(1);
    expectScore(0);

    pending.resolve(
      response(
        createEntry('profile-01'),
        201,
      ),
    );

    await expectProfile('Alex, 23');

    expectScore(10);
  });

  it('persists keyboard swipes through the API', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer();

    render(<App />);

    await expectProfile('Emma, 22');

    await user.keyboard('{ArrowRight}');

    await expectProfile('Alex, 23');

    expectScore(10);

    expect(
      mockServer.getHistory(),
    ).toHaveLength(1);

    expect(
      mockServer.getHistory()[0].profileId,
    ).toBe('profile-01');
  });

  it('restores the profile after confirmed undo', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer([
      createEntry('profile-01'),
    ]);

    render(<App />);

    await expectProfile('Alex, 23');

    await user.click(undoButton());

    await expectProfile('Emma, 22');

    expectScore(0);

    expect(
      mockServer.getHistory(),
    ).toEqual([]);

    expect(undoButton()).toBeDisabled();
  });

  it('restores persisted data after remounting', async () => {
    const user = userEvent.setup();

    createMockServer();

    const firstRender = render(<App />);

    await expectProfile('Emma, 22');

    await user.click(likeButton());

    await expectProfile('Alex, 23');

    firstRender.unmount();

    render(<App />);

    await expectProfile('Alex, 23');

    expectScore(10);

    expect(
      screen.getByTestId('swiped-value'),
    ).toHaveTextContent(/^1$/);
  });

  it('keeps confirmed history when a mutation fails', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer();

    render(<App />);

    await expectProfile('Emma, 22');

    mockServer.fetchMock.mockRejectedValueOnce(
      new TypeError('Network failure'),
    );

    await user.click(likeButton());

    const alert =
      await screen.findByRole('alert');

    expect(alert).toHaveTextContent(
      'Unable to connect to the server',
    );

    expectScore(0);
    expect(likeButton()).toBeDisabled();

    expect(
      mockServer.getHistory(),
    ).toEqual([]);

    await user.click(
      screen.getByRole('button', {
        name: 'Reload deck',
      }),
    );

    await expectProfile('Emma, 22');

    expect(likeButton()).toBeEnabled();
    expectScore(0);
  });

  it('recovers a saved action after a lost response', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer();

    render(<App />);

    await expectProfile('Emma, 22');

    mockServer.fetchMock.mockImplementationOnce(
      async () => {
        mockServer.setHistory([
          createEntry('profile-01'),
        ]);

        throw new TypeError(
          'Response connection lost',
        );
      },
    );

    await user.click(likeButton());

    await screen.findByRole('alert');

    expectScore(0);
    expect(likeButton()).toBeDisabled();

    await user.click(
      screen.getByRole('button', {
        name: 'Reload deck',
      }),
    );

    await expectProfile('Alex, 23');

    expectScore(10);

    expect(
      mockServer.getHistory(),
    ).toHaveLength(1);
  });

  it('recovers from an initial loading failure', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer();

    mockServer.fetchMock.mockRejectedValueOnce(
      new TypeError('Server unavailable'),
    );

    render(<App />);

    await screen.findByRole('alert');

    await user.click(
      screen.getByRole('button', {
        name: 'Reload deck',
      }),
    );

    await expectProfile('Emma, 22');

    await waitFor(() => {
      expect(likeButton()).toBeEnabled();
    });

    expect(
      screen.queryByRole('alert'),
    ).not.toBeInTheDocument();
  });

  it('keeps history when persistent undo fails', async () => {
    const user = userEvent.setup();

    const mockServer = createMockServer([
      createEntry('profile-01'),
    ]);

    render(<App />);

    await expectProfile('Alex, 23');

    mockServer.fetchMock.mockResolvedValueOnce(
      response(
        {
          message: 'Swipe history has changed',
        },
        409,
      ),
    );

    await user.click(undoButton());

    await screen.findByRole('alert');

    expectScore(10);
    expect(undoButton()).toBeDisabled();

    expect(
      mockServer.getHistory(),
    ).toHaveLength(1);
  });
});
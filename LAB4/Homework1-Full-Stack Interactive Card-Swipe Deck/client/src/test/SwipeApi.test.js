import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  SESSION_ID,
  getProfiles,
  getHistory,
  saveSwipe,
  deleteLastSwipe,
} from '../api/swipeApi.js';

const profile = {
  id: 'profile-01',
  name: 'Emma',
  age: 22,
  bio: 'A fictional profile.',
};

const swipe = {
  id: 'action-01',
  sessionId: SESSION_ID,
  profileId: profile.id,
  action: 'LIKE',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function mockResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function mockFetch(data, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(
    mockResponse(data, status),
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Swipe API client', () => {
  it('retrieves profile data', async () => {
    const fetchMock = mockFetch([profile]);

    expect(await getProfiles()).toEqual([profile]);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/profiles$/),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('retrieves history for the demo session', async () => {
    const fetchMock = mockFetch([swipe]);

    expect(await getHistory()).toEqual([swipe]);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `/swipe/history/${SESSION_ID}`,
      ),
      {
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('sends a valid POST swipe request', async () => {
    const fetchMock = mockFetch(swipe, 201);

    expect(
      await saveSwipe(profile.id, 'LIKE'),
    ).toEqual(swipe);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/swipe$/),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          profileId: profile.id,
          action: 'LIKE',
        }),
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('sends the latest action identifier with undo', async () => {
    const fetchMock = mockFetch(swipe);

    expect(
      await deleteLastSwipe(swipe.id),
    ).toEqual(swipe);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `/swipe/history/${SESSION_ID}/last`,
      ),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expectedActionId: swipe.id,
        }),
        signal: expect.any(AbortSignal),
      },
    );
  });

  it('rejects unsuccessful HTTP responses', async () => {
    mockFetch(
      {
        message: 'Profile has already been swiped',
      },
      409,
    );

    await expect(
      saveSwipe(profile.id, 'LIKE'),
    ).rejects.toThrow(
      'Profile has already been swiped',
    );
  });

  it('handles network failures', async () => {
    const originalError =
      new TypeError('Failed to fetch');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(originalError),
    );

    await expect(
      getProfiles(),
    ).rejects.toMatchObject({
      message: 'Unable to connect to the server',
      cause: originalError,
    });
  });

  it('rejects invalid profile responses', async () => {
    mockFetch({
      unexpected: true,
    });

    await expect(
      getProfiles(),
    ).rejects.toThrow(
      'Invalid profile response',
    );
  });
});
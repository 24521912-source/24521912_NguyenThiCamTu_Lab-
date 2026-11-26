import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  getProfiles,
  saveSwipe,
  deleteLastSwipe,
  REQUEST_TIMEOUT_MS,
} from '../api/swipeApi.js';

function mockPendingRequest() {
  const fetchMock = vi.fn(
    (url, { signal }) =>
      new Promise((resolve, reject) => {
        function handleAbort() {
          reject(
            new DOMException(
              'Request aborted',
              'AbortError',
            ),
          );
        }

        if (signal.aborted) {
          handleAbort();
          return;
        }

        signal.addEventListener(
          'abort',
          handleAbort,
          {
            once: true,
          },
        );
      }),
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('HTTP request timeout', () => {
  it('aborts a request when the timeout is reached', async () => {
    const fetchMock = mockPendingRequest();

    const pending = getProfiles();

    const assertion = expect(
      pending,
    ).rejects.toThrow(
      'Request timed out',
    );

    await vi.advanceTimersByTimeAsync(
      REQUEST_TIMEOUT_MS,
    );

    await assertion;

    const options = fetchMock.mock.calls[0][1];

    expect(options.signal.aborted).toBe(true);
  });

  it('cleans up the timeout after a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      }),
    );

    await expect(
      getProfiles(),
    ).resolves.toEqual([]);

    expect(vi.getTimerCount()).toBe(0);
  });

  it('preserves external abort signals', async () => {
    mockPendingRequest();

    const controller = new AbortController();

    const pending = getProfiles(
      controller.signal,
    );

    const assertion = expect(
      pending,
    ).rejects.toMatchObject({
      name: 'AbortError',
    });

    controller.abort();

    await assertion;

    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not automatically retry a timed-out POST request', async () => {
    const fetchMock = mockPendingRequest();

    const pending = saveSwipe(
      'profile-01',
      'LIKE',
    );

    const assertion = expect(
      pending,
    ).rejects.toThrow(
      'Request timed out',
    );

    await vi.advanceTimersByTimeAsync(
      REQUEST_TIMEOUT_MS,
    );

    await assertion;

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not automatically retry a timed-out DELETE request', async () => {
    const fetchMock = mockPendingRequest();

    const pending = deleteLastSwipe(
      'action-01',
    );

    const assertion = expect(
      pending,
    ).rejects.toThrow(
      'Request timed out',
    );

    await vi.advanceTimersByTimeAsync(
      REQUEST_TIMEOUT_MS,
    );

    await assertion;

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
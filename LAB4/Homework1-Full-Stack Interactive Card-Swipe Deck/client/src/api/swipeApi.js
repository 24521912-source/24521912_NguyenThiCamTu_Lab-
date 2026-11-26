const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3001/api'
).replace(/\/+$/, '');

export const SESSION_ID = 'local-demo-session';

export const REQUEST_TIMEOUT_MS = 10000;

async function request(path, options = {}) {
  const controller = new AbortController();

  const signal = options.signal
    ? AbortSignal.any([
        options.signal,
        controller.signal,
      ])
    : controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  let response;
  let data;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        signal,
      },
    );

    data = await response.json().catch((error) => {
      if (signal.aborted) {
        throw error;
      }

      return null;
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        'Request timed out. Please reload the deck.',
        {
          cause: error,
        },
      );
    }

    if (
      options.signal?.aborted ||
      error.name === 'AbortError'
    ) {
      throw error;
    }

    throw new Error(
      'Unable to connect to the server',
      {
        cause: error,
      },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}`,
    );
  }

  if (data === null) {
    throw new Error('Invalid server response');
  }

  return data;
}

function isValidSwipe(entry) {
  return (
    entry &&
    typeof entry.id === 'string' &&
    typeof entry.profileId === 'string' &&
    typeof entry.sessionId === 'string' &&
    typeof entry.createdAt === 'string' &&
    ['LIKE', 'PASS', 'SUPER_LIKE'].includes(
      entry.action,
    )
  );
}

export async function getProfiles(signal) {
  const profiles = await request('/profiles', {
    signal,
  });

  if (
    !Array.isArray(profiles) ||
    !profiles.every(
      (profile) =>
        profile &&
        typeof profile.id === 'string' &&
        typeof profile.name === 'string' &&
        Number.isInteger(profile.age) &&
        typeof profile.bio === 'string',
    )
  ) {
    throw new Error('Invalid profile response');
  }

  return profiles;
}

export async function getHistory(signal) {
  const history = await request(
    `/swipe/history/${encodeURIComponent(SESSION_ID)}`,
    {
      signal,
    },
  );

  if (
    !Array.isArray(history) ||
    !history.every(
      (entry) =>
        isValidSwipe(entry) &&
        entry.sessionId === SESSION_ID,
    )
  ) {
    throw new Error('Invalid history response');
  }

  return history;
}

export async function saveSwipe(profileId, action) {
  const entry = await request('/swipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      profileId,
      action,
    }),
  });

  if (
    !isValidSwipe(entry) ||
    entry.sessionId !== SESSION_ID ||
    entry.profileId !== profileId ||
    entry.action !== action
  ) {
    throw new Error('Invalid saved swipe response');
  }

  return entry;
}

export async function deleteLastSwipe(expectedActionId) {
  const entry = await request(
    `/swipe/history/${encodeURIComponent(SESSION_ID)}/last`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expectedActionId,
      }),
    },
  );

  if (
    !isValidSwipe(entry) ||
    entry.sessionId !== SESSION_ID ||
    entry.id !== expectedActionId
  ) {
    throw new Error('Invalid undo response');
  }

  return entry;
}
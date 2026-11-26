const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3002/api'
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, code = '') {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function apiRequest(
  path,
  options = {}
) {
  const {
    signal,
    timeoutMs = 10000,
    ...requestOptions
  } = options

  const controller = new AbortController()

  const abortRequest = () => {
    controller.abort()
  }

  if (signal?.aborted) {
    controller.abort()
  }

  signal?.addEventListener(
    'abort',
    abortRequest,
    { once: true }
  )

  let timedOut = false

  const timeoutID = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...requestOptions,
        signal: controller.signal,
        cache: 'no-store',
      }
    )

    const body = await response
      .json()
      .catch(() => null)

    if (!response.ok) {
      if (
        response.status === 409 &&
        body?.error?.code ===
          'DUPLICATE_REQUEST' &&
        body?.appeal?.appealID
      ) {
        return body
      }

      throw new ApiError(
        body?.error?.message ||
          'The server rejected the request.',
        response.status,
        body?.error?.code
      )
    }

    if (!body) {
      throw new ApiError(
        'The server returned an invalid response.'
      )
    }

    return body
  } catch (error) {
    if (timedOut) {
      throw new ApiError(
        'The request timed out. Please try again.',
        0,
        'REQUEST_TIMEOUT'
      )
    }

    if (signal?.aborted) {
      throw error
    }

    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      'Unable to connect to the tribunal server.',
      0,
      'NETWORK_ERROR'
    )
  } finally {
    clearTimeout(timeoutID)

    signal?.removeEventListener(
      'abort',
      abortRequest
    )
  }
}

export const tribunalApi = {
  getDossier(playerID, signal) {
    return apiRequest(
      `/dossiers/${encodeURIComponent(playerID)}`,
      { signal }
    )
  },

  getClock() {
    return apiRequest('/clock')
  },

  submitAppeal(playerID, payload) {
    return apiRequest(
      `/dossiers/${encodeURIComponent(playerID)}/appeals`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      }
    )
  },

  getAppeals(playerID, signal) {
    return apiRequest(
      `/dossiers/${encodeURIComponent(playerID)}/appeals`,
      { signal }
    )
  },
}
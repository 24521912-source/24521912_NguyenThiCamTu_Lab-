import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  ApiError,
  tribunalApi,
} from '../services/tribunalApi'

function mockResponse(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  }
}

function createPendingRequest() {
  return vi.fn((url, options) => {
    return new Promise((resolve, reject) => {
      const signal = options.signal

      function handleAbort() {
        reject(
          new DOMException(
            'The request was aborted.',
            'AbortError'
          )
        )
      }

      if (signal.aborted) {
        handleAbort()
        return
      }

      signal.addEventListener(
        'abort',
        handleAbort,
        { once: true }
      )
    })
  })
}

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Tribunal API service', () => {
  it('returns successful JSON responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockResponse(200, {
        serverNowMs: 1700000000000,
      })
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(
      tribunalApi.getClock()
    ).resolves.toEqual({
      serverNowMs: 1700000000000,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/clock$/),
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      })
    )
  })

  it('preserves the HTTP status and error code', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse(404, {
          error: {
            code: 'DOSSIER_NOT_FOUND',
            message: 'The dossier does not exist.',
          },
        })
      )
    )

    await expect(
      tribunalApi.getDossier('unknown')
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      code: 'DOSSIER_NOT_FOUND',
      message: 'The dossier does not exist.',
    })
  })

  it('normalizes network failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(
        new TypeError('Failed to fetch')
      )
    )

    await expect(
      tribunalApi.getClock()
    ).rejects.toMatchObject({
      status: 0,
      code: 'NETWORK_ERROR',
    })
  })

  it('rejects invalid JSON responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => {
          throw new SyntaxError('Invalid JSON')
        },
      })
    )

    await expect(
      tribunalApi.getClock()
    ).rejects.toBeInstanceOf(ApiError)
  })

  it('aborts a request after the configured timeout', async () => {
    vi.useFakeTimers()

    const fetchMock = createPendingRequest()

    vi.stubGlobal('fetch', fetchMock)

    const request = tribunalApi.getClock()

    const assertion = expect(
      request
    ).rejects.toMatchObject({
      status: 0,
      code: 'REQUEST_TIMEOUT',
    })

    await vi.advanceTimersByTimeAsync(10000)

    await assertion

    const signal =
      fetchMock.mock.calls[0][1].signal

    expect(signal.aborted).toBe(true)

    expect(
      vi.getTimerCount()
    ).toBe(0)
  })

  it('supports cancellation through an external AbortSignal', async () => {
    const fetchMock = createPendingRequest()

    vi.stubGlobal('fetch', fetchMock)

    const controller = new AbortController()

    const request = tribunalApi.getDossier(
      'himass',
      controller.signal
    )

    const assertion = expect(
      request
    ).rejects.toMatchObject({
      name: 'AbortError',
    })

    controller.abort()

    await assertion

    expect(
      fetchMock.mock.calls[0][1].signal.aborted
    ).toBe(true)
  })

  it('returns an existing receipt for a safe duplicate retry', async () => {
    const appeal = {
      appealID: 'existing-appeal',
      playerID: 'himass',
      submittedAtMs: 1700000000000,
      status: 'received',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse(409, {
          error: {
            code: 'DUPLICATE_REQUEST',
            message: 'Request already processed.',
          },
          appeal,
        })
      )
    )

    await expect(
      tribunalApi.submitAppeal('himass', {})
    ).resolves.toMatchObject({
      appeal,
    })
  })

  it('rejects conflicting duplicate requests without a receipt', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse(409, {
          error: {
            code: 'DUPLICATE_REQUEST',
            message: 'Request identifier already used.',
          },
          appeal: null,
        })
      )
    )

    await expect(
      tribunalApi.submitAppeal('himass', {})
    ).rejects.toMatchObject({
      status: 409,
      code: 'DUPLICATE_REQUEST',
    })
  })

  it('rejects expired appeal submissions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse(409, {
          error: {
            code: 'APPEAL_WINDOW_EXPIRED',
            message: 'The appeal window has expired.',
          },
        })
      )
    )

    await expect(
      tribunalApi.submitAppeal('himass', {})
    ).rejects.toMatchObject({
      status: 409,
      code: 'APPEAL_WINDOW_EXPIRED',
    })
  })
})
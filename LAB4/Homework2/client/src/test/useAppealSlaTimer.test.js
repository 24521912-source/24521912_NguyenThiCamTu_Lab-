import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  act,
  cleanup,
  renderHook,
} from '@testing-library/react'

import {
  useAppealSlaTimer,
} from '../hooks/useAppealSlaTimer'

const START_TIME = 1700000000000

function createDeferred() {
  let resolve
  let reject

  const promise = new Promise(
    (resolvePromise, rejectPromise) => {
      resolve = resolvePromise
      reject = rejectPromise
    }
  )

  return {
    promise,
    resolve,
    reject,
  }
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve()
  })
}

function createClockProvider(offset = 0) {
  return vi.fn(async () => ({
    serverNowMs: Date.now() + offset,
  }))
}

describe('useAppealSlaTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    vi.setSystemTime(START_TIME)
  })

  afterEach(() => {
    cleanup()

    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('initializes from an absolute deadline', async () => {
    const getServerTime =
      createClockProvider()

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    await flushPromises()

    expect(
      result.current.remainingMs
    ).toBe(60000)

    expect(
      result.current.isExpired
    ).toBe(false)

    expect(
      result.current.syncStatus
    ).toBe('synchronized')
  })

  it('updates the countdown after time advances', async () => {
    const getServerTime =
      createClockProvider()

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    await flushPromises()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        5000
      )
    })

    expect(
      result.current.remainingMs
    ).toBe(55000)
  })

  it('handles a large clock jump without accumulated drift', async () => {
    const getServerTime =
      createClockProvider()

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 120000,
        getServerTime,
      })
    )

    await flushPromises()

    await act(async () => {
      vi.setSystemTime(
        START_TIME + 90000
      )

      await vi.advanceTimersByTimeAsync(
        1000
      )
    })

    expect(
      result.current.remainingMs
    ).toBe(29000)
  })

  it('marks the appeal window as expired', async () => {
    const getServerTime =
      createClockProvider()

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 3000,
        getServerTime,
      })
    )

    await flushPromises()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        5000
      )
    })

    expect(
      result.current.remainingMs
    ).toBe(0)

    expect(
      result.current.isExpired
    ).toBe(true)
  })

  it('handles an invalid deadline', () => {
    const getServerTime =
      createClockProvider()

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: null,
        getServerTime,
      })
    )

    expect(
      result.current.isInvalid
    ).toBe(true)

    expect(
      result.current.remainingMs
    ).toBeNull()

    expect(
      getServerTime
    ).not.toHaveBeenCalled()
  })

  it('applies the estimated server clock offset', async () => {
    const getServerTime =
      createClockProvider(10000)

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    await flushPromises()

    expect(
      result.current.offsetMs
    ).toBe(10000)

    expect(
      result.current.remainingMs
    ).toBe(50000)
  })

  it('resynchronizes when the document becomes visible', async () => {
    const getServerTime =
      createClockProvider()

    vi.spyOn(
      document,
      'visibilityState',
      'get'
    ).mockReturnValue('visible')

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 120000,
        getServerTime,
      })
    )

    await flushPromises()

    expect(
      getServerTime
    ).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.setSystemTime(
        START_TIME + 45000
      )

      document.dispatchEvent(
        new Event('visibilitychange')
      )
    })

    expect(
      getServerTime
    ).toHaveBeenCalledTimes(2)

    expect(
      result.current.remainingMs
    ).toBe(75000)
  })

  it('does not resynchronize when the document becomes hidden', async () => {
    const getServerTime =
      createClockProvider()

    vi.spyOn(
      document,
      'visibilityState',
      'get'
    ).mockReturnValue('hidden')

    renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    await flushPromises()

    await act(async () => {
      document.dispatchEvent(
        new Event('visibilitychange')
      )
    })

    expect(
      getServerTime
    ).toHaveBeenCalledTimes(1)
  })

  it('recalculates when the deadline changes', async () => {
    const getServerTime =
      createClockProvider()

    const { result, rerender } =
      renderHook(
        ({ deadlineMs }) =>
          useAppealSlaTimer({
            deadlineMs,
            getServerTime,
          }),
        {
          initialProps: {
            deadlineMs:
              START_TIME + 60000,
          },
        }
      )

    await flushPromises()

    rerender({
      deadlineMs: START_TIME + 120000,
    })

    await flushPromises()

    expect(
      result.current.remainingMs
    ).toBe(120000)
  })

  it('ignores stale synchronization responses', async () => {
    const first = createDeferred()
    const second = createDeferred()

    const getServerTime = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)

    vi.spyOn(
      document,
      'visibilityState',
      'get'
    ).mockReturnValue('visible')

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    await act(async () => {
      document.dispatchEvent(
        new Event('visibilitychange')
      )
    })

    await act(async () => {
      second.resolve({
        serverNowMs:
          START_TIME + 10000,
      })
    })

    expect(
      result.current.offsetMs
    ).toBe(10000)

    await act(async () => {
      first.resolve({
        serverNowMs:
          START_TIME + 30000,
      })
    })

    expect(
      result.current.offsetMs
    ).toBe(10000)
  })

  it('handles clock synchronization failure', async () => {
    const getServerTime = vi
      .fn()
      .mockRejectedValue(
        new Error('Clock unavailable')
      )

    const { result } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    await flushPromises()

    expect(
      result.current.syncStatus
    ).toBe('error')

    expect(
      result.current.remainingMs
    ).toBe(60000)
  })

  it('performs periodic clock resynchronization', async () => {
    const getServerTime =
      createClockProvider()

    renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 120000,
        getServerTime,
        resyncIntervalMs: 5000,
      })
    )

    await flushPromises()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        5000
      )
    })

    expect(
      getServerTime
    ).toHaveBeenCalledTimes(2)
  })

  it('cleans up timers and visibility listeners on unmount', async () => {
    const getServerTime =
      createClockProvider()

    vi.spyOn(
      document,
      'visibilityState',
      'get'
    ).mockReturnValue('visible')

    const { unmount } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 120000,
        getServerTime,
      })
    )

    await flushPromises()

    const initialCallCount =
      getServerTime.mock.calls.length

    unmount()

    expect(
      vi.getTimerCount()
    ).toBe(0)

    await act(async () => {
      document.dispatchEvent(
        new Event('visibilitychange')
      )

      await vi.advanceTimersByTimeAsync(
        60000
      )
    })

    expect(
      getServerTime
    ).toHaveBeenCalledTimes(
      initialCallCount
    )
  })

  it('ignores an outstanding response after unmount', async () => {
    const pending = createDeferred()

    const getServerTime = vi
      .fn()
      .mockReturnValue(pending.promise)

    const { unmount } = renderHook(() =>
      useAppealSlaTimer({
        deadlineMs: START_TIME + 60000,
        getServerTime,
      })
    )

    unmount()

    await act(async () => {
      pending.resolve({
        serverNowMs: START_TIME + 5000,
      })
    })

    expect(
      vi.getTimerCount()
    ).toBe(0)
  })
})
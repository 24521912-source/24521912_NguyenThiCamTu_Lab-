import {
  useEffect,
  useState,
} from 'react'

import {
  calculateRemainingMs,
  estimateClockOffset,
  formatRemainingTime,
} from '../utils/slaTime'

const readSystemClock = () => Date.now()

export function useAppealSlaTimer({
  deadlineMs,
  getServerTime,
  now = readSystemClock,
  tickMs = 1000,
  resyncIntervalMs = 60000,
}) {
  const [clock, setClock] = useState(() => ({
    nowMs: now(),
    offsetMs: 0,
    syncStatus: 'pending',
  }))

  useEffect(() => {
    let active = true
    let requestVersion = 0

    let previousWallTime = now()
    let previousMonotonicTime =
      performance.now()

    function updateClock() {
      if (!active) {
        return
      }

      const currentTime = now()

      setClock((previous) => ({
        ...previous,
        nowMs: currentTime,
      }))
    }

    async function synchronizeClock() {
      if (
        !active ||
        typeof getServerTime !== 'function'
      ) {
        return
      }

      const currentVersion =
        ++requestVersion

      const requestStartMs = now()

      try {
        const response =
          await getServerTime()

        const responseEndMs = now()

        if (
          !active ||
          currentVersion !== requestVersion
        ) {
          return
        }

        const offsetMs =
          estimateClockOffset(
            requestStartMs,
            responseEndMs,
            response?.serverNowMs
          )

        if (offsetMs === null) {
          throw new Error(
            'Invalid server clock response.'
          )
        }

        setClock({
          nowMs: responseEndMs,
          offsetMs,
          syncStatus: 'synchronized',
        })
      } catch {
        if (
          !active ||
          currentVersion !== requestVersion
        ) {
          return
        }

        setClock((previous) => ({
          ...previous,
          nowMs: now(),
          syncStatus: 'error',
        }))
      }
    }

    function handleTick() {
      const currentWallTime = now()

      const currentMonotonicTime =
        performance.now()

      const wallElapsed =
        currentWallTime - previousWallTime

      const monotonicElapsed =
        currentMonotonicTime -
        previousMonotonicTime

      const clockDifference = Math.abs(
        wallElapsed - monotonicElapsed
      )

      previousWallTime = currentWallTime

      previousMonotonicTime =
        currentMonotonicTime

      updateClock()

      // Detect significant system clock changes.
      if (clockDifference > 2000) {
        void synchronizeClock()
      }
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState === 'visible'
      ) {
        updateClock()

        void synchronizeClock()
      }
    }

    const validDeadline =
      calculateRemainingMs(
        deadlineMs,
        now()
      ) !== null

    if (!validDeadline) {
      return () => {
        active = false
        requestVersion += 1
      }
    }

    void synchronizeClock()

    const tickID = setInterval(
      handleTick,
      tickMs
    )

    const resyncID = setInterval(
      () => {
        void synchronizeClock()
      },
      resyncIntervalMs
    )

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      active = false

      requestVersion += 1

      clearInterval(tickID)
      clearInterval(resyncID)

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [
    deadlineMs,
    getServerTime,
    now,
    tickMs,
    resyncIntervalMs,
  ])

  const estimatedServerNowMs =
    clock.nowMs + clock.offsetMs

  const remainingMs =
    calculateRemainingMs(
      deadlineMs,
      estimatedServerNowMs
    )

  return {
    remainingMs,

    formattedTime:
      formatRemainingTime(remainingMs),

    isExpired: remainingMs === 0,

    isInvalid: remainingMs === null,

    estimatedServerNowMs,

    offsetMs: clock.offsetMs,

    syncStatus:
      remainingMs === null
        ? 'unavailable'
        : clock.syncStatus,
  }
}
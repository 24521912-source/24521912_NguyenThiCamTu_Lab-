export const SLA_DURATION_MS =
  24 * 60 * 60 * 1000

function isValidTimestamp(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0
  )
}

export function calculateRemainingMs(
  deadlineMs,
  nowMs
) {
  if (
    !isValidTimestamp(deadlineMs) ||
    !isValidTimestamp(nowMs)
  ) {
    return null
  }

  return Math.max(0, deadlineMs - nowMs)
}

export function estimateClockOffset(
  requestStartMs,
  responseEndMs,
  serverNowMs
) {
  if (
    !isValidTimestamp(requestStartMs) ||
    !isValidTimestamp(responseEndMs) ||
    !isValidTimestamp(serverNowMs) ||
    responseEndMs < requestStartMs
  ) {
    return null
  }

  const midpointMs =
    requestStartMs +
    (responseEndMs - requestStartMs) / 2

  return serverNowMs - midpointMs
}

export function formatRemainingTime(
  remainingMs
) {
  if (
    typeof remainingMs !== 'number' ||
    !Number.isFinite(remainingMs) ||
    remainingMs < 0
  ) {
    return null
  }

  const totalSeconds = Math.ceil(
    remainingMs / 1000
  )

  const hours = Math.floor(
    totalSeconds / 3600
  )

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  )

  const seconds = totalSeconds % 60

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

export function calculateRemainingPercent(
  remainingMs,
  durationMs
) {
  if (
    typeof remainingMs !== 'number' ||
    !Number.isFinite(remainingMs) ||
    typeof durationMs !== 'number' ||
    !Number.isFinite(durationMs) ||
    durationMs <= 0
  ) {
    return 0
  }

  return Math.min(
    100,
    Math.max(
      0,
      (remainingMs / durationMs) * 100
    )
  )
}
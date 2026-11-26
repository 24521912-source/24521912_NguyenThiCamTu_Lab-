import {
  SLA_DURATION_MS,
} from '../utils/slaTime'

const demoOpenedAtMs = Date.now()

const demoDeadlines = Object.freeze({
  himass:
    demoOpenedAtMs + SLA_DURATION_MS,

  tanvuu:
    demoOpenedAtMs + SLA_DURATION_MS,
})

export function getDemoDeadline(playerID) {
  return Object.hasOwn(
    demoDeadlines,
    playerID
  )
    ? demoDeadlines[playerID]
    : null
}

export async function getDemoServerTime() {
  return {
    serverNowMs: Date.now(),
  }
}
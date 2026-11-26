import { describe, expect, it } from 'vitest'
import {
  calculateRemainingMs,
  estimateClockOffset,
  formatRemainingTime,
  calculateRemainingPercent,
} from '../utils/slaTime'

describe('SLA time utilities', () => {
  it('calculates remaining time from an absolute deadline', () => {
    expect(
      calculateRemainingMs(60000, 15000)
    ).toBe(45000)
  })

  it('returns zero when the deadline is reached', () => {
    expect(
      calculateRemainingMs(60000, 60000)
    ).toBe(0)
  })

  it('never returns a negative remaining time', () => {
    expect(
      calculateRemainingMs(60000, 90000)
    ).toBe(0)
  })

  it.each([
    null,
    undefined,
    NaN,
    Infinity,
    -1,
    '60000',
  ])('rejects an invalid deadline: %s', (deadline) => {
    expect(
      calculateRemainingMs(deadline, 1000)
    ).toBeNull()
  })

  it('rejects an invalid current time', () => {
    expect(
      calculateRemainingMs(60000, NaN)
    ).toBeNull()
  })

  it('estimates a positive clock offset', () => {
    expect(
      estimateClockOffset(1000, 1200, 1600)
    ).toBe(500)
  })

  it('estimates a negative clock offset', () => {
    expect(
      estimateClockOffset(1000, 1200, 900)
    ).toBe(-200)
  })

  it('rejects reversed request timestamps', () => {
    expect(
      estimateClockOffset(1200, 1000, 1600)
    ).toBeNull()
  })

  it('rejects an invalid server timestamp', () => {
    expect(
      estimateClockOffset(1000, 1200, NaN)
    ).toBeNull()
  })

  it('formats hours, minutes and seconds', () => {
    expect(
      formatRemainingTime(3723000)
    ).toEqual({
      hours: '01',
      minutes: '02',
      seconds: '03',
    })
  })

  it('rounds a partial remaining second upward', () => {
    expect(
      formatRemainingTime(1001)
    ).toEqual({
      hours: '00',
      minutes: '00',
      seconds: '02',
    })
  })

  it('formats zero remaining time', () => {
    expect(
      formatRemainingTime(0)
    ).toEqual({
      hours: '00',
      minutes: '00',
      seconds: '00',
    })
  })

  it('handles invalid remaining time', () => {
    expect(
      formatRemainingTime(null)
    ).toBeNull()
  })

  it('calculates the remaining percentage', () => {
    expect(
      calculateRemainingPercent(30000, 60000)
    ).toBe(50)
  })

  it('limits the remaining percentage to 100', () => {
    expect(
      calculateRemainingPercent(90000, 60000)
    ).toBe(100)
  })

  it('handles a zero SLA duration', () => {
    expect(
      calculateRemainingPercent(1000, 0)
    ).toBe(0)
  })
})
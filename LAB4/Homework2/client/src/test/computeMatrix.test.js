import { describe, expect, it } from 'vitest'
import { computeMatrix } from '../utils/computeMatrix'

describe('computeMatrix', () => {
  it('calculates signed differences and absolute deviations', () => {
    const dossier = {
      criteria: [
        {
          criterion: 'procedure',
          label: 'Procedure',
          referenceScore: 80,
          observedScore: 70,
        },
        {
          criterion: 'documentation',
          label: 'Documentation',
          referenceScore: 75,
          observedScore: 90,
        },
      ],
    }

    const result = computeMatrix(dossier)

    expect(result.rows[0].difference).toBe(-10)
    expect(result.rows[0].deviation).toBe(10)

    expect(result.rows[1].difference).toBe(15)
    expect(result.rows[1].deviation).toBe(15)

    expect(result.overallDeviation).toBe(12.5)
    expect(result.validCount).toBe(2)
  })

  it('accepts zero as a valid score', () => {
    const result = computeMatrix({
      criteria: [
        {
          criterion: 'zero',
          label: 'Zero score',
          referenceScore: 0,
          observedScore: 0,
        },
      ],
    })

    expect(result.rows[0].difference).toBe(0)
    expect(result.overallDeviation).toBe(0)
    expect(result.validCount).toBe(1)
  })

  it('excludes missing scores from the overall calculation', () => {
    const result = computeMatrix({
      criteria: [
        {
          criterion: 'valid',
          referenceScore: 80,
          observedScore: 70,
        },
        {
          criterion: 'missing',
          referenceScore: null,
          observedScore: 60,
        },
      ],
    })

    expect(result.rows[1].difference).toBeNull()
    expect(result.rows[1].deviation).toBeNull()
    expect(result.overallDeviation).toBe(10)
    expect(result.validCount).toBe(1)
  })

  it.each([-1, 101, NaN, Infinity, '80'])(
    'rejects invalid score %s',
    (invalidScore) => {
      const result = computeMatrix({
        criteria: [
          {
            criterion: 'invalid',
            referenceScore: invalidScore,
            observedScore: 50,
          },
        ],
      })

      expect(result.validCount).toBe(0)
      expect(result.overallDeviation).toBeNull()
    }
  )

  it('handles an empty criteria array', () => {
    expect(computeMatrix({ criteria: [] })).toEqual({
      rows: [],
      validCount: 0,
      overallDeviation: null,
    })
  })

  it('handles missing dossier data', () => {
    expect(computeMatrix(null)).toEqual({
      rows: [],
      validCount: 0,
      overallDeviation: null,
    })
  })

  it('does not mutate the source data', () => {
    const criterion = Object.freeze({
      criterion: 'procedure',
      referenceScore: 80,
      observedScore: 70,
    })

    const dossier = Object.freeze({
      criteria: Object.freeze([criterion]),
    })

    expect(() => computeMatrix(dossier)).not.toThrow()
    expect(criterion).not.toHaveProperty('difference')
  })
})
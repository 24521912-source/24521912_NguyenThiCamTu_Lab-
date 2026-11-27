import { describe, expect, it } from 'vitest'
import {
  calculatePagination,
  normalizePage,
  normalizePageSize,
} from '../utils/pagination.js'

function createClips(count) {
  return Array.from({ length: count }, (_, index) => ({
    _id: `clip-${index + 1}`,
    title: `Demo Clip ${index + 1}`,
  }))
}

describe('normalizePageSize', () => {
  it('uses six as the default page size', () => {
    expect(normalizePageSize()).toBe(6)
  })

  it('accepts a positive integer', () => {
    expect(normalizePageSize(3)).toBe(3)
  })

  it.each([
    0,
    -1,
    2.5,
    NaN,
    Infinity,
    null,
    '6',
  ])('rejects invalid page size: %s', (value) => {
    expect(normalizePageSize(value)).toBe(6)
  })
})

describe('normalizePage', () => {
  it('accepts a valid page', () => {
    expect(normalizePage(2, 3)).toBe(2)
  })

  it('clamps a page above the maximum', () => {
    expect(normalizePage(10, 3)).toBe(3)
  })

  it.each([
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    null,
    undefined,
    '2',
  ])('normalizes invalid page: %s', (value) => {
    expect(normalizePage(value, 3)).toBe(1)
  })
})

describe('calculatePagination', () => {
  it('handles an empty collection', () => {
    const result = calculatePagination([], 1)

    expect(result).toEqual({
      pageSize: 6,
      totalPages: 1,
      effectivePage: 1,
      startIdx: 0,
      visibleItems: [],
    })
  })

  it.each([
    [1, 1, 1],
    [6, 1, 6],
    [7, 2, 6],
    [12, 2, 6],
    [13, 3, 6],
  ])(
    'calculates pagination for %i clips',
    (count, expectedPages, expectedVisibleItems) => {
      const clips = createClips(count)
      const result = calculatePagination(clips, 1)

      expect(result.totalPages).toBe(expectedPages)
      expect(result.visibleItems).toHaveLength(
        expectedVisibleItems,
      )
    },
  )

  it('uses six items per page by default', () => {
    const clips = createClips(13)
    const result = calculatePagination(clips, 1)

    expect(result.pageSize).toBe(6)
    expect(result.startIdx).toBe(0)
    expect(result.visibleItems).toEqual(
      clips.slice(0, 6),
    )
  })

  it('returns the correct second-page slice', () => {
    const clips = createClips(13)
    const result = calculatePagination(clips, 2)

    expect(result.effectivePage).toBe(2)
    expect(result.startIdx).toBe(6)
    expect(result.visibleItems).toEqual(
      clips.slice(6, 12),
    )
  })

  it('returns a partial last page', () => {
    const clips = createClips(13)
    const result = calculatePagination(clips, 3)

    expect(result.startIdx).toBe(12)
    expect(result.visibleItems).toEqual([
      clips[12],
    ])
  })

  it('does not create an extra page for exact multiples', () => {
    const clips = createClips(12)
    const result = calculatePagination(clips, 2)

    expect(result.totalPages).toBe(2)
    expect(result.visibleItems).toHaveLength(6)
  })

  it('supports a custom page size', () => {
    const clips = createClips(10)
    const result = calculatePagination(clips, 2, 3)

    expect(result.pageSize).toBe(3)
    expect(result.totalPages).toBe(4)
    expect(result.startIdx).toBe(3)
    expect(result.visibleItems).toEqual(
      clips.slice(3, 6),
    )
  })

  it('normalizes an invalid page size', () => {
    const clips = createClips(13)
    const result = calculatePagination(clips, 1, 0)

    expect(result.pageSize).toBe(6)
    expect(result.totalPages).toBe(3)
  })

  it('normalizes an invalid page', () => {
    const clips = createClips(13)
    const result = calculatePagination(clips, -2)

    expect(result.effectivePage).toBe(1)
    expect(result.startIdx).toBe(0)
  })

  it('clamps a page after the dataset shrinks', () => {
    const clips = createClips(7)
    const result = calculatePagination(clips, 3)

    expect(result.totalPages).toBe(2)
    expect(result.effectivePage).toBe(2)
    expect(result.startIdx).toBe(6)
    expect(result.visibleItems).toEqual([
      clips[6],
    ])
  })

  it('clamps an empty collection to page one', () => {
    const result = calculatePagination([], 10)

    expect(result.effectivePage).toBe(1)
    expect(result.visibleItems).toEqual([])
  })

  it('handles a non-array input safely', () => {
    const result = calculatePagination(null, 1)

    expect(result.totalPages).toBe(1)
    expect(result.visibleItems).toEqual([])
  })

  it('preserves stable evidence identifiers', () => {
    const clips = createClips(13)
    const result = calculatePagination(clips, 2)

    expect(
      result.visibleItems.map((clip) => clip._id),
    ).toEqual([
      'clip-7',
      'clip-8',
      'clip-9',
      'clip-10',
      'clip-11',
      'clip-12',
    ])
  })

  it('does not mutate the source array', () => {
    const clips = createClips(13)
    const snapshot = structuredClone(clips)

    Object.freeze(clips)

    calculatePagination(clips, 2)

    expect(clips).toEqual(snapshot)
  })

  it('returns a separate array of visible items', () => {
    const clips = createClips(3)
    const result = calculatePagination(clips, 1)

    expect(result.visibleItems).toEqual(clips)
    expect(result.visibleItems).not.toBe(clips)
  })
})
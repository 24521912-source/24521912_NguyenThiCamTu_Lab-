import { describe, expect, it } from 'vitest'
import {
  normalizeCategory,
  filterPhotos,
} from '../data/categories'

const samplePhotos = [
  {
    id: 'p01',
    category: 'nature',
  },
  {
    id: 'p02',
    category: 'urban',
  },
]

describe('Category utilities', () => {
  it('preserves valid categories', () => {
    expect(
      normalizeCategory('nature'),
    ).toBe('nature')
  })

  it('normalizes missing categories', () => {
    expect(
      normalizeCategory(null),
    ).toBe('all')
  })

  it('normalizes unknown categories', () => {
    expect(
      normalizeCategory('unknown'),
    ).toBe('all')
  })

  it('returns all photos for the all category', () => {
    expect(
      filterPhotos(samplePhotos, 'all'),
    ).toEqual(samplePhotos)
  })

  it('returns only matching photos', () => {
    expect(
      filterPhotos(samplePhotos, 'nature'),
    ).toEqual([samplePhotos[0]])
  })

  it('returns an empty array for an empty category', () => {
    expect(
      filterPhotos(samplePhotos, 'architecture'),
    ).toEqual([])
  })

  it('handles an empty photo collection', () => {
    expect(
      filterPhotos([], 'all'),
    ).toEqual([])
  })
})
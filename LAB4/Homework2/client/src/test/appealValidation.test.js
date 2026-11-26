import { describe, expect, it } from 'vitest'
import {
  createInitialValues,
  validateAppeal,
} from '../utils/appealValidation'

function createValidAppeal(overrides = {}) {
  return {
    appellantName: 'Demo Appellant',
    appealCategory: 'procedural_review',
    statement:
      'This academic appeal requests a review of the fictional case procedure.',
    requestedOutcome: 'Request an independent review.',
    evidenceUrl: '',
    acknowledged: true,
    ...overrides,
  }
}

describe('Appeal validation', () => {
  it('rejects an empty appeal', () => {
    const errors = validateAppeal(createInitialValues())

    expect(Object.keys(errors)).toHaveLength(5)
    expect(errors.appellantName).toBeDefined()
    expect(errors.appealCategory).toBeDefined()
    expect(errors.statement).toBeDefined()
    expect(errors.requestedOutcome).toBeDefined()
    expect(errors.acknowledged).toBeDefined()
  })

  it('accepts a valid appeal', () => {
    expect(validateAppeal(createValidAppeal())).toEqual({})
  })

  it('rejects a name that is too short', () => {
    const errors = validateAppeal(
      createValidAppeal({ appellantName: 'A' })
    )

    expect(errors.appellantName).toBeDefined()
  })

  it('rejects a name that is too long', () => {
    const errors = validateAppeal(
      createValidAppeal({
        appellantName: 'A'.repeat(81),
      })
    )

    expect(errors.appellantName).toBeDefined()
  })

  it('rejects whitespace-only names', () => {
    const errors = validateAppeal(
      createValidAppeal({ appellantName: '   ' })
    )

    expect(errors.appellantName).toBeDefined()
  })

  it('rejects unsupported appeal categories', () => {
    const errors = validateAppeal(
      createValidAppeal({
        appealCategory: 'invalid_category',
      })
    )

    expect(errors.appealCategory).toBeDefined()
  })

  it('rejects a statement shorter than 50 characters', () => {
    const errors = validateAppeal(
      createValidAppeal({ statement: 'Too short' })
    )

    expect(errors.statement).toBeDefined()
  })

  it('accepts a statement of exactly 50 characters', () => {
    const errors = validateAppeal(
      createValidAppeal({
        statement: 'A'.repeat(50),
      })
    )

    expect(errors.statement).toBeUndefined()
  })

  it('rejects a statement longer than 2000 characters', () => {
    const errors = validateAppeal(
      createValidAppeal({
        statement: 'A'.repeat(2001),
      })
    )

    expect(errors.statement).toBeDefined()
  })

  it('rejects an outcome shorter than 10 characters', () => {
    const errors = validateAppeal(
      createValidAppeal({
        requestedOutcome: 'Review',
      })
    )

    expect(errors.requestedOutcome).toBeDefined()
  })

  it('rejects an outcome longer than 500 characters', () => {
    const errors = validateAppeal(
      createValidAppeal({
        requestedOutcome: 'A'.repeat(501),
      })
    )

    expect(errors.requestedOutcome).toBeDefined()
  })

  it('allows an empty optional evidence URL', () => {
    const errors = validateAppeal(
      createValidAppeal({ evidenceUrl: '' })
    )

    expect(errors.evidenceUrl).toBeUndefined()
  })

  it.each([
    'invalid-url',
    'ftp://example.com/evidence',
    'javascript:alert(1)',
  ])('rejects an invalid evidence URL: %s', (url) => {
    const errors = validateAppeal(
      createValidAppeal({ evidenceUrl: url })
    )

    expect(errors.evidenceUrl).toBeDefined()
  })

  it.each([
    'https://example.com/evidence',
    'http://example.com/evidence',
  ])('accepts a valid evidence URL: %s', (url) => {
    const errors = validateAppeal(
      createValidAppeal({ evidenceUrl: url })
    )

    expect(errors.evidenceUrl).toBeUndefined()
  })

  it('requires evidence for evidence review', () => {
    const errors = validateAppeal(
      createValidAppeal({
        appealCategory: 'evidence_review',
        evidenceUrl: '',
      })
    )

    expect(errors.evidenceUrl).toBeDefined()
  })

  it('accepts evidence review with a valid URL', () => {
    const errors = validateAppeal(
      createValidAppeal({
        appealCategory: 'evidence_review',
        evidenceUrl: 'https://example.com/evidence',
      })
    )

    expect(errors).toEqual({})
  })

  it('requires explicit acknowledgment', () => {
    const errors = validateAppeal(
      createValidAppeal({ acknowledged: false })
    )

    expect(errors.acknowledged).toBeDefined()
  })

  it('does not accept a string as acknowledgment', () => {
    const errors = validateAppeal(
      createValidAppeal({ acknowledged: 'true' })
    )

    expect(errors.acknowledged).toBeDefined()
  })

  it('does not mutate the input values', () => {
    const values = Object.freeze(createValidAppeal())

    expect(() => validateAppeal(values)).not.toThrow()
  })
})
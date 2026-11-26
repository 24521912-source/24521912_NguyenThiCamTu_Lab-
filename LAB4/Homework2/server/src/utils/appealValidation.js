const allowedCategories = new Set([
  'procedural_review',
  'evidence_review',
  'proportionality_review',
  'other',
])

function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

function validLength(value, min, max) {
  return (
    value.length >= min &&
    value.length <= max
  )
}

function validEvidenceUrl(value) {
  if (!/^https?:\/\//i.test(value)) {
    return false
  }

  try {
    const url = new URL(value)

    return (
      ['http:', 'https:'].includes(
        url.protocol
      ) &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

export function validateAppealPayload(body) {
  const source =
    body &&
    typeof body === 'object' &&
    !Array.isArray(body)
      ? body
      : {}

  const values = {
    appellantName:
      normalizeText(source.appellantName),

    appealCategory:
      normalizeText(source.appealCategory),

    statement:
      normalizeText(source.statement),

    requestedOutcome:
      normalizeText(source.requestedOutcome),

    evidenceUrl:
      normalizeText(source.evidenceUrl),

    acknowledged:
      source.acknowledged === true,
  }

  const errors = {}

  const requestID =
    normalizeText(source.requestID)

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      .test(requestID)
  ) {
    errors.requestID =
      'A valid request identifier is required.'
  }

  if (
    !validLength(values.appellantName, 2, 80)
  ) {
    errors.appellantName =
      'Appellant name must contain 2–80 characters.'
  }

  if (
    !allowedCategories.has(
      values.appealCategory
    )
  ) {
    errors.appealCategory =
      'Select a valid appeal category.'
  }

  if (
    !validLength(values.statement, 50, 2000)
  ) {
    errors.statement =
      'Appeal statement must contain 50–2000 characters.'
  }

  if (
    !validLength(
      values.requestedOutcome,
      10,
      500
    )
  ) {
    errors.requestedOutcome =
      'Requested outcome must contain 10–500 characters.'
  }

  if (
    source.evidenceUrl !== undefined &&
    typeof source.evidenceUrl !== 'string'
  ) {
    errors.evidenceUrl =
      'Evidence URL must be a string.'
  } else if (
    values.appealCategory === 'evidence_review' &&
    !values.evidenceUrl
  ) {
    errors.evidenceUrl =
      'An evidence URL is required for evidence review.'
  } else if (
    values.evidenceUrl &&
    !validEvidenceUrl(values.evidenceUrl)
  ) {
    errors.evidenceUrl =
      'Enter a valid HTTP or HTTPS URL.'
  }

  if (!values.acknowledged) {
    errors.acknowledged =
      'Acknowledgment is required.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    requestID,
    values,
  }
}
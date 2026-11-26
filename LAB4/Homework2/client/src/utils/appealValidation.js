export const APPEAL_CATEGORIES = [
  {
    value: 'procedural_review',
    label: 'Procedural review',
  },
  {
    value: 'evidence_review',
    label: 'Evidence review',
  },
  {
    value: 'proportionality_review',
    label: 'Proportionality review',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

export function createInitialValues() {
  return {
    appellantName: '',
    appealCategory: '',
    statement: '',
    requestedOutcome: '',
    evidenceUrl: '',
    acknowledged: false,
  }
}

function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

function validateLength(value, label, min, max) {
  const text = normalizeText(value)

  if (text.length === 0) {
    return `${label} is required.`
  }

  if (text.length < min) {
    return `${label} must contain at least ${min} characters.`
  }

  if (text.length > max) {
    return `${label} must not exceed ${max} characters.`
  }

  return null
}

function isValidEvidenceUrl(value) {
  if (!/^https?:\/\//i.test(value)) {
    return false
  }

  try {
    const url = new URL(value)

    return (
      (url.protocol === 'http:' ||
        url.protocol === 'https:') &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

export function validateAppeal(values = {}) {
  const errors = {}

  const nameError = validateLength(
    values.appellantName,
    'Appellant name',
    2,
    80
  )

  if (nameError) {
    errors.appellantName = nameError
  }

  const validCategory = APPEAL_CATEGORIES.some(
    (category) =>
      category.value === values.appealCategory
  )

  if (!validCategory) {
    errors.appealCategory =
      'Please select a valid appeal category.'
  }

  const statementError = validateLength(
    values.statement,
    'Appeal statement',
    50,
    2000
  )

  if (statementError) {
    errors.statement = statementError
  }

  const outcomeError = validateLength(
    values.requestedOutcome,
    'Requested outcome',
    10,
    500
  )

  if (outcomeError) {
    errors.requestedOutcome = outcomeError
  }

  const evidenceUrl = normalizeText(
    values.evidenceUrl
  )

  if (
    values.appealCategory === 'evidence_review' &&
    !evidenceUrl
  ) {
    errors.evidenceUrl =
      'An evidence URL is required for evidence review.'
  } else if (
    evidenceUrl &&
    !isValidEvidenceUrl(evidenceUrl)
  ) {
    errors.evidenceUrl =
      'Enter a valid HTTP or HTTPS URL.'
  }

  if (values.acknowledged !== true) {
    errors.acknowledged =
      'You must acknowledge the academic demonstration notice.'
  }

  return errors
}
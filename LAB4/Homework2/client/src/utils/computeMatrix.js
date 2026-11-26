function isValidScore(score) {
  return (
    typeof score === 'number' &&
    Number.isFinite(score) &&
    score >= 0 &&
    score <= 100
  )
}

export function computeMatrix(dossierData) {
  const criteria = Array.isArray(dossierData?.criteria)
    ? dossierData.criteria
    : []

  const rows = criteria.map((item) => {
    const isValid =
      isValidScore(item.referenceScore) &&
      isValidScore(item.observedScore)

    const difference = isValid
      ? item.observedScore - item.referenceScore
      : null

    return {
      ...item,
      difference,
      deviation: isValid
        ? Math.abs(difference)
        : null,
    }
  })

  const validRows = rows.filter(
    (row) => row.deviation !== null
  )

  const totalDeviation = validRows.reduce(
    (total, row) => total + row.deviation,
    0
  )

  return {
    rows,
    validCount: validRows.length,
    overallDeviation:
      validRows.length > 0
        ? totalDeviation / validRows.length
        : null,
  }
}
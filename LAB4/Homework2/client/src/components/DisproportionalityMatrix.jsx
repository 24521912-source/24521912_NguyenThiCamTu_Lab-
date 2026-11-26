function formatScore(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  )
    ? value.toFixed(1)
    : 'N/A'
}

function formatDifference(value) {
  if (value === null) {
    return 'N/A'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(1)}`
}

export default function DisproportionalityMatrix({
  matrix,
}) {
  return (
    <section
      className="panel"
      aria-labelledby="matrix-heading"
    >
      <div className="panel-heading">
        <div>
          <h2 id="matrix-heading">
            Disproportionality Matrix
          </h2>

          <p className="muted">
            Comparison of fictional reference and
            observed review scores.
          </p>
        </div>
      </div>

      <div
        className="table-wrapper"
        tabIndex={0}
        role="region"
        aria-label="Scrollable review score table"
      >
        <table className="matrix-table">
          <caption className="sr-only">
            Review criteria and calculated deviations
          </caption>

          <thead>
            <tr>
              <th scope="col">Criterion</th>
              <th scope="col">Reference</th>
              <th scope="col">Observed</th>
              <th scope="col">Difference</th>
              <th scope="col">Deviation</th>
            </tr>
          </thead>

          <tbody>
            {matrix.rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  No review criteria available.
                </td>
              </tr>
            ) : (
              matrix.rows.map((row) => (
                <tr key={row.criterion}>
                  <th scope="row">{row.label}</th>

                  <td>
                    {formatScore(row.referenceScore)}
                  </td>

                  <td>
                    {formatScore(row.observedScore)}
                  </td>

                  <td className="difference">
                    {formatDifference(row.difference)}
                  </td>

                  <td>
                    {row.deviation === null
                      ? 'N/A'
                      : row.deviation.toFixed(1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="matrix-summary">
        <span>Mean absolute deviation</span>

        <strong>
          {matrix.overallDeviation === null
            ? 'N/A'
            : matrix.overallDeviation.toFixed(1)}
        </strong>
      </div>

      <p className="matrix-note">
        Scores are illustrative values, not official
        adjudication outcomes.
      </p>
    </section>
  )
}
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDossierByPlayerID } from '../data/dossiers'
import { computeMatrix } from '../utils/computeMatrix'
import DisproportionalityMatrix from '../components/DisproportionalityMatrix'
import AppealForm from '../components/AppealForm'
import NotFound from './NotFound'

export default function DossierView() {
  const { playerID } = useParams()

  const dossierData =
    getDossierByPlayerID(playerID)

  const matrix = useMemo(
    () => computeMatrix(dossierData),
    [dossierData]
  )

  if (!dossierData) {
    return (
      <NotFound
        title="Dossier not found"
        message="The requested player dossier is unavailable."
      />
    )
  }

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Overview</Link>
        <span aria-hidden="true">/</span>
        <span>{dossierData.playerName}</span>
      </div>

      <section className="dossier-header">
        <div>
          <p className="eyebrow">
            Case {dossierData.caseID}
          </p>

          <h1>{dossierData.playerName}</h1>

          <p className="muted">
            Demonstration player dossier
          </p>
        </div>

        <span className="status-badge">
          {dossierData.status}
        </span>
      </section>

      <div className="notice">
        <strong>Fictional case data</strong>

        <p>
          This dossier is for academic
          demonstration only and is not an
          official case assessment.
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <p>Case status</p>
          <strong>Demo</strong>
        </article>

        <article className="stat-card">
          <p>Valid criteria</p>
          <strong>{matrix.validCount}</strong>
        </article>

        <article className="stat-card">
          <p>Mean deviation</p>

          <strong>
            {matrix.overallDeviation === null
              ? 'N/A'
              : matrix.overallDeviation.toFixed(1)}
          </strong>
        </article>
      </div>

      <section
        className="panel"
        aria-labelledby="summary-heading"
      >
        <h2 id="summary-heading">
          Case Overview
        </h2>

        <p className="muted">
          {dossierData.summary}
        </p>
      </section>

      <DisproportionalityMatrix
        matrix={matrix}
      />

      <AppealForm
        playerID={dossierData.playerID}
        playerName={dossierData.playerName}
        caseID={dossierData.caseID}
      />
    </>
  )
}
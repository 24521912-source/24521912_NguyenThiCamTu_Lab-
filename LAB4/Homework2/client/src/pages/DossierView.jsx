import { useMemo } from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  getDossierByPlayerID,
} from '../data/dossiers'

import {
  getDemoDeadline,
  getDemoServerTime,
} from '../data/demoClock'

import {
  computeMatrix,
} from '../utils/computeMatrix'

import {
  useAppealSlaTimer,
} from '../hooks/useAppealSlaTimer'

import DisproportionalityMatrix from '../components/DisproportionalityMatrix'
import AppealForm from '../components/AppealForm'
import SlaCountdown from '../components/SlaCountdown'
import NotFound from './NotFound'

export default function DossierView() {
  const { playerID } = useParams()

  const dossierData =
    getDossierByPlayerID(playerID)

  const matrix = useMemo(
    () => computeMatrix(dossierData),
    [dossierData]
  )

  const deadlineMs =
    getDemoDeadline(playerID)

  const timer = useAppealSlaTimer({
    deadlineMs,
    getServerTime: getDemoServerTime,
  })

  if (!dossierData) {
    return (
      <NotFound
        title="Dossier not found"
        message="The requested player dossier is unavailable."
      />
    )
  }

  const canAccessAppeal =
    !timer.isExpired &&
    !timer.isInvalid

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Overview</Link>

        <span aria-hidden="true">/</span>

        <span>
          {dossierData.playerName}
        </span>
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

      <SlaCountdown
        timer={timer}
        deadlineMs={deadlineMs}
      />

      {canAccessAppeal ? (
        <AppealForm
          playerID={dossierData.playerID}
          playerName={dossierData.playerName}
          caseID={dossierData.caseID}
        />
      ) : (
        <section className="panel empty-state">
          <h2>Appeal unavailable</h2>

          <p className="muted">
            Appeals cannot be validated
            outside an available appeal
            window.
          </p>
        </section>
      )}
    </>
  )
}
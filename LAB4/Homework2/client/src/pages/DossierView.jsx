import {
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  useDossier,
} from '../hooks/useDossier'

import {
  useAppealSlaTimer,
} from '../hooks/useAppealSlaTimer'

import {
  computeMatrix,
} from '../utils/computeMatrix'

import DisproportionalityMatrix from '../components/DisproportionalityMatrix'
import AppealForm from '../components/AppealForm'
import SlaCountdown from '../components/SlaCountdown'
import NotFound from './NotFound'

function DossierContent({
  dossierData,
  api,
}) {
  const matrix = useMemo(
    () => computeMatrix(dossierData),
    [dossierData]
  )

  const deadlineMs =
    dossierData.deadlineMs

  const timer = useAppealSlaTimer({
    deadlineMs,
    getServerTime: api.getClock,
  })

  const canSubmit =
    !timer.isExpired &&
    !timer.isInvalid &&
    timer.syncStatus === 'synchronized'

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

      <SlaCountdown
        timer={timer}
        deadlineMs={deadlineMs}
        demoMode={false}
      />

      <AppealForm
        playerID={dossierData.playerID}
        playerName={dossierData.playerName}
        caseID={dossierData.caseID}
        canSubmit={canSubmit}
        sendAppeal={api.submitAppeal}
      />
    </>
  )
}

function DossierLoader({
  playerID,
  api,
  onRetry,
}) {
  const result = useDossier(
    playerID,
    api
  )

  if (result.status === 'loading') {
    return (
      <section className="panel empty-state">
        <h1>Loading dossier</h1>

        <p className="muted" role="status">
          Connecting to the tribunal server...
        </p>
      </section>
    )
  }

  if (result.status === 'not_found') {
    return (
      <NotFound
        title="Dossier not found"
        message="The requested player dossier is unavailable."
      />
    )
  }

  if (result.status === 'error') {
    return (
      <section className="panel empty-state">
        <h1>Unable to load dossier</h1>

        <p className="muted" role="alert">
          {result.error}
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={onRetry}
        >
          Retry
        </button>
      </section>
    )
  }

  return (
    <DossierContent
      dossierData={result.dossier}
      api={api}
    />
  )
}

export default function DossierView({ api }) {
  const { playerID } = useParams()

  const [attempt, setAttempt] =
    useState(0)

  return (
    <DossierLoader
      key={`${playerID}-${attempt}`}
      playerID={playerID}
      api={api}
      onRetry={() => {
        setAttempt(
          (previous) => previous + 1
        )
      }}
    />
  )
}
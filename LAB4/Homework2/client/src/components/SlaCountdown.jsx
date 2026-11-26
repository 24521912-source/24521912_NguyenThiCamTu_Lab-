import { useId } from 'react'

import {
  calculateRemainingPercent,
  SLA_DURATION_MS,
} from '../utils/slaTime'

import './SlaCountdown.css'

export default function SlaCountdown({
  timer,
  deadlineMs,
  demoMode = true,
  durationMs = SLA_DURATION_MS,
}) {
  const headingID = useId()

  const {
    remainingMs,
    formattedTime,
    isExpired,
    isInvalid,
    syncStatus,
  } = timer

  const remainingPercent =
    calculateRemainingPercent(
      remainingMs,
      durationMs
    )

  const stateLabel = isInvalid
    ? 'Unavailable'
    : isExpired
      ? 'Expired'
      : 'Active'

  const stateClass = isInvalid
    ? 'unavailable'
    : isExpired
      ? 'expired'
      : 'active'

  const syncMessage =
    syncStatus === 'synchronized'
      ? 'Clock synchronized'
      : syncStatus === 'error'
        ? 'Clock synchronization failed. Using the last available estimate.'
        : syncStatus === 'unavailable'
          ? 'Clock unavailable'
          : 'Synchronizing clock...'

  const deadlineLabel =
    typeof deadlineMs === 'number' &&
    Number.isFinite(deadlineMs) &&
    deadlineMs >= 0
      ? new Date(deadlineMs).toLocaleString(
          'en-GB'
        )
      : 'Unavailable'

  return (
    <section
      className="panel sla-panel"
      aria-labelledby={headingID}
    >
      <div className="sla-heading">
        <div>
          <p className="eyebrow">
            Appeal Window
          </p>

          <h2 id={headingID}>
            SLA Countdown
          </h2>

          <p className="muted">
            Time remaining before the
            demonstration appeal deadline.
          </p>
        </div>

        <span
          className={
            `sla-status sla-status--${stateClass}`
          }
        >
          {stateLabel}
        </span>
      </div>

      {isInvalid ? (
        <p className="sla-warning">
          The appeal deadline is unavailable.
        </p>
      ) : (
        <>
          <div
            className="sla-countdown"
            role="timer"
            aria-label="Remaining appeal time"
            aria-live="off"
          >
            {[
              ['Hours', formattedTime.hours],
              ['Minutes', formattedTime.minutes],
              ['Seconds', formattedTime.seconds],
            ].map(([label, value]) => (
              <div
                className="sla-time-block"
                key={label}
              >
                <strong>{value}</strong>

                <span>{label}</span>
              </div>
            ))}
          </div>

          <div
            className="sla-progress-track"
            role="progressbar"
            aria-label="Remaining appeal window"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              Math.round(remainingPercent)
            }
          >
            <div
              className={
                `sla-progress-fill sla-progress-fill--${stateClass}`
              }
              style={{
                width: `${remainingPercent}%`,
              }}
            />
          </div>
        </>
      )}

      <div className="sla-details">
        <p>
          <span>Deadline</span>

          <strong>{deadlineLabel}</strong>
        </p>

        <p>
          <span>Clock source</span>

          <strong>
            {demoMode
              ? 'Demo clock'
              : 'Server clock'}
          </strong>
        </p>
      </div>

      <p
        className={
          syncStatus === 'error'
            ? 'sla-sync sla-sync--error'
            : 'sla-sync'
        }
      >
        {syncMessage}
      </p>

      {isExpired && (
        <p
          className="sla-warning"
          role="alert"
        >
          The appeal window has expired.
        </p>
      )}

      {demoMode && (
        <p className="sla-disclaimer">
          Demonstration timing only.
          Server synchronization will be
          enabled in the full-stack stage.
        </p>
      )}
    </section>
  )
}
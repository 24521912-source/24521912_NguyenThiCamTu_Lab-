import { useId } from 'react'

import {
  useAppealForm,
} from '../hooks/useAppealForm'

import {
  APPEAL_CATEGORIES,
} from '../utils/appealValidation'

import './AppealForm.css'

function FormField({
  label,
  name,
  error,
  required = false,
  hint,
  children,
}) {
  const id = useId()
  const inputID = `${id}-${name}`
  const hintID = `${inputID}-hint`
  const errorID = `${inputID}-error`

  const describedBy = [
    hint ? hintID : null,
    error ? errorID : null,
  ].filter(Boolean).join(' ')

  return (
    <div className="appeal-field">
      <label htmlFor={inputID}>
        {label}

        {required && (
          <span
            className="required-mark"
            aria-hidden="true"
          >
            {' '}*
          </span>
        )}
      </label>

      {children({
        id: inputID,
        name,
        required,
        'aria-invalid': Boolean(error),
        'aria-describedby':
          describedBy || undefined,
      })}

      {hint && (
        <p id={hintID} className="field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorID} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function AppealForm({
  playerID,
  playerName,
  caseID,
  sendAppeal,
  canSubmit = true,
}) {
  const headingID = useId()
  const acknowledgmentID = useId()
  const submissionHintID = useId()

  const acknowledgmentErrorID =
    `${acknowledgmentID}-error`

  const {
    values,
    errors,
    isValid,
    validationAttempted,
    submissionStatus,
    submissionError,
    receipt,
    updateField,
    touchField,
    getFieldError,
    validateDraft,
    resetDraft,
    submitAppeal,
  } = useAppealForm(playerID)

  const isSubmitting =
    submissionStatus === 'submitting'

  const isSubmitted =
    submissionStatus === 'success'

  const acknowledgmentError =
    getFieldError('acknowledged')

  const evidenceRequired =
    values.appealCategory === 'evidence_review'

  function bindField(field) {
    return {
      value: values[field],
      disabled: isSubmitting,

      onChange: (event) => {
        updateField(field, event.target.value)
      },

      onBlur: () => {
        touchField(field)
      },
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      isSubmitting ||
      isSubmitted ||
      !canSubmit
    ) {
      return
    }

    if (!validateDraft()) {
      const firstInvalidField =
        Object.keys(errors)[0]

      if (firstInvalidField) {
        const control =
          event.currentTarget.elements.namedItem(
            firstInvalidField
          )

        control?.focus()
      }

      return
    }

    void submitAppeal(sendAppeal)
  }

  return (
    <section
      className="panel appeal-panel"
      aria-labelledby={headingID}
    >
      <div className="appeal-heading">
        <div>
          <p className="eyebrow">
            Appeal Workspace
          </p>

          <h2 id={headingID}>
            Submit an Appeal
          </h2>

          <p className="muted">
            Complete the demonstration appeal
            form for case {caseID}.
          </p>
        </div>

        <span className="status-badge">
          {isSubmitted ? 'Received' : 'Draft'}
        </span>
      </div>

      <div className="draft-notice">
        Draft for {playerName}. Changes are
        retained while navigating within the
        current session.
      </div>

      <form
        className="appeal-form"
        aria-label={`${playerName} appeal form`}
        aria-busy={isSubmitting}
        onSubmit={handleSubmit}
        noValidate
      >
        <FormField
          label="Appellant name"
          name="appellantName"
          required
          error={getFieldError('appellantName')}
          hint="Use a fictional name, 2–80 characters."
        >
          {(attributes) => (
            <input
              {...attributes}
              {...bindField('appellantName')}
              type="text"
              maxLength={80}
              autoComplete="off"
              placeholder="Demo Appellant"
            />
          )}
        </FormField>

        <FormField
          label="Appeal category"
          name="appealCategory"
          required
          error={getFieldError('appealCategory')}
        >
          {(attributes) => (
            <select
              {...attributes}
              {...bindField('appealCategory')}
            >
              <option value="">
                Select a category
              </option>

              {APPEAL_CATEGORIES.map(
                (category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                )
              )}
            </select>
          )}
        </FormField>

        <FormField
          label="Appeal statement"
          name="statement"
          required
          error={getFieldError('statement')}
          hint="Explain the reason for the appeal using 50–2000 characters."
        >
          {(attributes) => (
            <>
              <textarea
                {...attributes}
                {...bindField('statement')}
                rows={5}
                maxLength={2000}
                placeholder="Describe your appeal..."
              />

              <p className="character-count">
                {values.statement.length} / 2000
              </p>
            </>
          )}
        </FormField>

        <FormField
          label="Requested outcome"
          name="requestedOutcome"
          required
          error={getFieldError('requestedOutcome')}
          hint="Describe the expected resolution using 10–500 characters."
        >
          {(attributes) => (
            <>
              <textarea
                {...attributes}
                {...bindField('requestedOutcome')}
                rows={3}
                maxLength={500}
                placeholder="Describe the expected resolution..."
              />

              <p className="character-count">
                {values.requestedOutcome.length} / 500
              </p>
            </>
          )}
        </FormField>

        <FormField
          label="Evidence URL"
          name="evidenceUrl"
          required={evidenceRequired}
          error={getFieldError('evidenceUrl')}
          hint={
            evidenceRequired
              ? 'Required for evidence review.'
              : 'Optional HTTP or HTTPS reference.'
          }
        >
          {(attributes) => (
            <input
              {...attributes}
              {...bindField('evidenceUrl')}
              type="url"
              autoComplete="off"
              placeholder="https://example.com/evidence"
            />
          )}
        </FormField>

        <div className="acknowledgment-field">
          <div className="checkbox-row">
            <input
              id={acknowledgmentID}
              name="acknowledged"
              type="checkbox"
              checked={values.acknowledged}
              disabled={isSubmitting}
              required
              aria-invalid={Boolean(
                acknowledgmentError
              )}
              aria-describedby={
                acknowledgmentError
                  ? acknowledgmentErrorID
                  : undefined
              }
              onChange={(event) => {
                updateField(
                  'acknowledged',
                  event.target.checked
                )
              }}
              onBlur={() => {
                touchField('acknowledged')
              }}
            />

            <label htmlFor={acknowledgmentID}>
              I acknowledge that this is an
              academic demonstration and does
              not submit a real-world appeal.
            </label>
          </div>

          {acknowledgmentError && (
            <p
              id={acknowledgmentErrorID}
              className="field-error"
            >
              {acknowledgmentError}
            </p>
          )}
        </div>

        {validationAttempted && !isValid && (
          <p
            className="form-feedback form-feedback--error"
            role="alert"
          >
            Please correct the highlighted
            fields before continuing.
          </p>
        )}

        {submissionError && (
          <p
            className="form-feedback form-feedback--error"
            role="alert"
          >
            {submissionError} Your draft has
            been retained.
          </p>
        )}

        {isSubmitting && (
          <p
            className="field-hint"
            role="status"
          >
            Sending your appeal to the server.
            Please wait.
          </p>
        )}

        {isSubmitted && receipt && (
          <div
            className="form-feedback form-feedback--valid"
            role="status"
          >
            <strong>
              Appeal received successfully.
            </strong>

            <p className="receipt-id">
              Appeal ID: {receipt.appealID}
            </p>

            <p>
              Status: {receipt.status}
            </p>
          </div>
        )}

        {!canSubmit && (
          <p
            id={submissionHintID}
            className="field-hint"
          >
            Submission is unavailable.
            The appeal window may have expired
            or the server clock may not be synchronized.
            Check the SLA countdown above.
          </p>
        )}

        <div className="appeal-actions">
          <button
            type="submit"
            className="button"
            aria-describedby={
              !canSubmit
                ? submissionHintID
                : undefined
            }
            disabled={
              isSubmitting ||
              isSubmitted ||
              !canSubmit
            }
          >
            {isSubmitting
              ? 'Submitting...'
              : isSubmitted
                ? 'Appeal Received'
                : 'Submit Appeal'}
          </button>

          <button
            type="button"
            className="secondary-button"
            disabled={isSubmitting}
            onClick={resetDraft}
          >
            Reset draft
          </button>
        </div>

        <p className="appeal-disclaimer">
          Academic demonstration only.
          Do not enter real personal
          information or confidential evidence.
        </p>
      </form>
    </section>
  )
}
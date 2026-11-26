import { useContext } from 'react'
import { AppealFormContext } from '../context/AppealFormContext'
import {
  createInitialValues,
  validateAppeal,
} from '../utils/appealValidation'

const EMPTY_DRAFT = {
  values: createInitialValues(),
  touched: {},
  validationAttempted: false,
  validated: false,
}

export function useAppealForm(playerID) {
  const context = useContext(AppealFormContext)

  if (!context) {
    throw new Error(
      'useAppealForm must be used inside AppealFormProvider.'
    )
  }

  const draft =
    context.drafts[playerID] ?? EMPTY_DRAFT

  const values = draft.values

  const errors = validateAppeal(values)

  const isValid =
    Object.keys(errors).length === 0

  function updateField(field, value) {
    context.updateField(playerID, field, value)
  }

  function touchField(field) {
    context.touchField(playerID, field)
  }

  function getFieldError(field) {
    const categoryRequiresEvidence =
      field === 'evidenceUrl' &&
      values.appealCategory === 'evidence_review' &&
      draft.touched.appealCategory

    const shouldShowError =
      draft.touched[field] ||
      draft.validationAttempted ||
      categoryRequiresEvidence

    return shouldShowError
      ? errors[field] ?? null
      : null
  }

  function validateDraft() {
    context.recordValidation(playerID, isValid)

    return isValid
  }

  function resetDraft() {
    context.resetDraft(playerID)
  }

  return {
    values,
    errors,
    isValid,
    validated: draft.validated && isValid,
    validationAttempted: draft.validationAttempted,
    updateField,
    touchField,
    getFieldError,
    validateDraft,
    resetDraft,
  }
}
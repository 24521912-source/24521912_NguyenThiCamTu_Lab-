import { useState } from 'react'
import { AppealFormContext } from './AppealFormContext'
import { createInitialValues } from '../utils/appealValidation'

function createDraft() {
  return {
    values: createInitialValues(),
    touched: {},
    validationAttempted: false,
    validated: false,
  }
}

export default function AppealFormProvider({
  children,
}) {
  const [drafts, setDrafts] = useState({})

  function updateField(playerID, field, value) {
    setDrafts((previous) => {
      const draft =
        previous[playerID] ?? createDraft()

      return {
        ...previous,
        [playerID]: {
          ...draft,
          values: {
            ...draft.values,
            [field]: value,
          },
          touched: {
            ...draft.touched,
            [field]: true,
          },
          validated: false,
        },
      }
    })
  }

  function touchField(playerID, field) {
    setDrafts((previous) => {
      const draft =
        previous[playerID] ?? createDraft()

      return {
        ...previous,
        [playerID]: {
          ...draft,
          touched: {
            ...draft.touched,
            [field]: true,
          },
        },
      }
    })
  }

  function recordValidation(playerID, isValid) {
    setDrafts((previous) => {
      const draft =
        previous[playerID] ?? createDraft()

      return {
        ...previous,
        [playerID]: {
          ...draft,
          validationAttempted: true,
          validated: isValid,
        },
      }
    })
  }

  function resetDraft(playerID) {
    setDrafts((previous) => ({
      ...previous,
      [playerID]: createDraft(),
    }))
  }

  return (
    <AppealFormContext.Provider
      value={{
        drafts,
        updateField,
        touchField,
        recordValidation,
        resetDraft,
      }}
    >
      {children}
    </AppealFormContext.Provider>
  )
}
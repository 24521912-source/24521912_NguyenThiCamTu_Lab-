import {
  useRef,
  useState,
} from 'react'

import {
  AppealFormContext,
} from './AppealFormContext'

import {
  createInitialValues,
  validateAppeal,
} from '../utils/appealValidation'

function createDraft() {
  return {
    values: createInitialValues(),
    touched: {},
    validationAttempted: false,
    validated: false,
    submissionStatus: 'idle',
    submissionError: null,
    receipt: null,
  }
}

export default function AppealFormProvider({
  children,
}) {
  const [drafts, setDrafts] = useState({})

  const pendingRequests = useRef(new Set())

  const requestIdentifiers = useRef(
    new Map()
  )

  function updateField(
    playerID,
    field,
    value
  ) {
    if (
      pendingRequests.current.has(playerID)
    ) {
      return
    }

    requestIdentifiers.current.delete(
      playerID
    )

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
          submissionStatus: 'idle',
          submissionError: null,
          receipt: null,
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

  function recordValidation(
    playerID,
    isValid
  ) {
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
    if (
      pendingRequests.current.has(playerID)
    ) {
      return
    }

    requestIdentifiers.current.delete(
      playerID
    )

    setDrafts((previous) => ({
      ...previous,
      [playerID]: createDraft(),
    }))
  }

  async function submitAppeal(
    playerID,
    values,
    sendAppeal
  ) {
    if (
      pendingRequests.current.has(playerID)
    ) {
      return
    }

    const errors = validateAppeal(values)

    const isValid =
      Object.keys(errors).length === 0

    recordValidation(playerID, isValid)

    if (!isValid) {
      return
    }

    if (
      drafts[playerID]?.submissionStatus ===
      'success'
    ) {
      return
    }

    pendingRequests.current.add(playerID)

    setDrafts((previous) => ({
      ...previous,

      [playerID]: {
        ...(previous[playerID] ?? createDraft()),
        submissionStatus: 'submitting',
        submissionError: null,
      },
    }))

    try {
      let requestID =
        requestIdentifiers.current.get(
          playerID
        )

      if (!requestID) {
        requestID = crypto.randomUUID()

        requestIdentifiers.current.set(
          playerID,
          requestID
        )
      }

      const response = await sendAppeal(
        playerID,
        {
          ...values,
          requestID,
        }
      )

      const receipt = response?.appeal

      if (
        !receipt?.appealID ||
        receipt.playerID !== playerID ||
        receipt.status !== 'received' ||
        !Number.isFinite(
          receipt.submittedAtMs
        )
      ) {
        throw new Error(
          'The server did not confirm the appeal.'
        )
      }

      setDrafts((previous) => ({
        ...previous,

        [playerID]: {
          ...previous[playerID],
          submissionStatus: 'success',
          submissionError: null,
          receipt,
        },
      }))
    } catch (error) {
      setDrafts((previous) => ({
        ...previous,

        [playerID]: {
          ...previous[playerID],
          submissionStatus: 'error',

          submissionError:
            error.message ||
            'Appeal submission failed.',
        },
      }))
    } finally {
      pendingRequests.current.delete(
        playerID
      )
    }
  }

  return (
    <AppealFormContext.Provider
      value={{
        drafts,
        updateField,
        touchField,
        recordValidation,
        resetDraft,
        submitAppeal,
      }}
    >
      {children}
    </AppealFormContext.Provider>
  )
}
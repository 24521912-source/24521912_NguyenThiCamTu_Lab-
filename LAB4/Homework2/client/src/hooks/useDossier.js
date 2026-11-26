import {
  useEffect,
  useState,
} from 'react'

export function useDossier(playerID, api) {
  const [result, setResult] = useState({
    status: 'loading',
    dossier: null,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    let active = true

    async function loadDossier() {
      try {
        const response =
          await api.getDossier(
            playerID,
            controller.signal
          )

        if (!active) {
          return
        }

        if (
          response?.dossier?.playerID !== playerID
        ) {
          throw new Error(
            'The server returned an invalid dossier.'
          )
        }

        setResult({
          status: 'success',
          dossier: response.dossier,
          error: null,
        })
      } catch (error) {
        if (
          !active ||
          controller.signal.aborted
        ) {
          return
        }

        setResult({
          status:
            error.status === 404
              ? 'not_found'
              : 'error',

          dossier: null,

          error: error.message,
        })
      }
    }

    void loadDossier()

    return () => {
      active = false
      controller.abort()
    }
  }, [playerID, api])

  return result
}
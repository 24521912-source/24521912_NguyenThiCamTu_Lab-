import { vi } from 'vitest'

import {
  getDossierByPlayerID,
} from '../data/dossiers'

export function createTestApi(
  overrides = {}
) {
  return {
    getDossier: vi.fn(async (playerID) => {
      const dossier =
        getDossierByPlayerID(playerID)

      if (!dossier) {
        const error = new Error(
          'Dossier not found.'
        )

        error.status = 404

        throw error
      }

      const now = Date.now()

      return {
        dossier: {
          ...dossier,
          openedAtMs: now,
          deadlineMs:
            now + 24 * 60 * 60 * 1000,
        },

        serverNowMs: now,
      }
    }),

    getClock: vi.fn(async () => ({
      serverNowMs: Date.now(),
    })),

    submitAppeal: vi.fn(async (playerID) => ({
      appeal: {
        appealID: 'test-appeal-001',
        playerID,
        submittedAtMs: Date.now(),
        status: 'received',
      },
    })),

    getAppeals: vi.fn(async () => ({
      appeals: [],
    })),

    ...overrides,
  }
}
import { Router } from 'express'

import {
  validateAppealPayload,
} from '../utils/appealValidation.js'

function sendError(
  res,
  status,
  code,
  message,
  details
) {
  return res.status(status).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  })
}

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(
      handler(req, res, next)
    ).catch(next)
  }
}

export function createTribunalRouter(
  store,
  now = Date.now
) {
  const router = Router()

  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      serverNowMs: now(),
    })
  })

  router.get('/clock', (req, res) => {
    res.json({
      serverNowMs: now(),
    })
  })

  router.get(
    '/dossiers/:playerID',
    asyncHandler(async (req, res) => {
      const dossier = await store.getDossier(
        req.params.playerID
      )

      if (!dossier) {
        return sendError(
          res,
          404,
          'DOSSIER_NOT_FOUND',
          'The requested dossier does not exist.'
        )
      }

      res.json({
        dossier,
        serverNowMs: now(),
      })
    })
  )

  router.get(
    '/dossiers/:playerID/appeals',
    asyncHandler(async (req, res) => {
      const { playerID } = req.params

      const dossier =
        await store.getDossier(playerID)

      if (!dossier) {
        return sendError(
          res,
          404,
          'DOSSIER_NOT_FOUND',
          'The requested dossier does not exist.'
        )
      }

      const appeals =
        await store.listAppeals(playerID)

      res.json({ appeals })
    })
  )

  router.post(
    '/dossiers/:playerID/appeals',
    asyncHandler(async (req, res) => {
      const { playerID } = req.params

      const dossier =
        await store.getDossier(playerID)

      if (!dossier) {
        return sendError(
          res,
          404,
          'DOSSIER_NOT_FOUND',
          'The requested dossier does not exist.'
        )
      }

      const validation =
        validateAppealPayload(req.body)

      if (!validation.isValid) {
        return sendError(
          res,
          400,
          'VALIDATION_ERROR',
          'The appeal payload is invalid.',
          validation.errors
        )
      }

      const result =
        await store.createAppeal(
          playerID,
          validation.requestID,
          validation.values
        )

      switch (result.kind) {
        case 'not_found':
          return sendError(
            res,
            404,
            'DOSSIER_NOT_FOUND',
            'The requested dossier does not exist.'
          )

        case 'expired':
          return sendError(
            res,
            409,
            'APPEAL_WINDOW_EXPIRED',
            'The appeal window has expired.'
          )

        case 'duplicate':
          return res.status(409).json({
            error: {
              code: 'DUPLICATE_REQUEST',
              message:
                'This request identifier has already been used.',
            },
            appeal: result.appeal,
          })

        case 'created':
          return res.status(201).json({
            appeal: result.appeal,
          })

        default:
          throw new Error(
            'Unexpected storage result.'
          )
      }
    })
  )

  return router
}
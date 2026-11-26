import express from 'express'
import cors from 'cors'

import {
  createTribunalRouter,
} from './routes/tribunalRoutes.js'

export function createApp({
  store,
  now = Date.now,
  clientOrigin = 'http://localhost:5173',
}) {
  const app = express()

  app.disable('x-powered-by')

  app.use(
    cors({
      origin: clientOrigin,
    })
  )

  app.use(
    express.json({
      limit: '32kb',
    })
  )

  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(
    '/api',
    createTribunalRouter(store, now)
  )

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message:
          'The requested API route does not exist.',
      },
    })
  })

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error)
    }

    if (
      error.type === 'entity.parse.failed'
    ) {
      return res.status(400).json({
        error: {
          code: 'INVALID_JSON',
          message: 'Malformed JSON request.',
        },
      })
    }

    if (
      error.type === 'entity.too.large'
    ) {
      return res.status(413).json({
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request body is too large.',
        },
      })
    }

    console.error('API error:', error.message)

    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message:
          'An unexpected server error occurred.',
      },
    })
  })

  return app
}
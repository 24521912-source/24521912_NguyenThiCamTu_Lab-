import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

import { createApp } from './app.js'

import {
  createTribunalStore,
} from './services/tribunalStore.js'

dotenv.config({
  path: fileURLToPath(
    new URL('../../.env', import.meta.url)
  ),
})

const port = Number(
  process.env.PORT || 3001
)

const host =
  process.env.HOST || '127.0.0.1'

const clientOrigin =
  process.env.CLIENT_ORIGIN ||
  'http://localhost:5173'

const storagePath = fileURLToPath(
  new URL(
    '../storage/tribunal.json',
    import.meta.url
  )
)

const store = createTribunalStore(
  storagePath
)

async function start() {
  await store.initialize()

  const app = createApp({
    store,
    clientOrigin,
  })

  app.listen(port, host, () => {
    console.log(
      `Tribunal API running at http://${host}:${port}`
    )

    console.log(
      'Persistent storage initialized.'
    )
  })
}

start().catch((error) => {
  console.error(
    'Server startup failed:',
    error.message
  )

  process.exitCode = 1
})
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'

import request from 'supertest'

import {
  mkdtemp,
  rm,
} from 'node:fs/promises'

import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

import { createApp } from '../src/app.js'

import {
  createTribunalStore,
} from '../src/services/tribunalStore.js'

const START_TIME = 1700000000000
const DAY_MS = 24 * 60 * 60 * 1000

let directory
let filePath
let currentTime
let store
let app

const now = () => currentTime

function validAppeal(overrides = {}) {
  return {
    requestID: randomUUID(),
    appellantName: 'Demo Appellant',
    appealCategory: 'procedural_review',
    statement:
      'This academic appeal requests a review of the fictional case procedure.',
    requestedOutcome:
      'Request an independent review.',
    evidenceUrl: '',
    acknowledged: true,
    ...overrides,
  }
}

function postAppeal(payload, playerID = 'himass') {
  return request(app)
    .post(`/api/dossiers/${playerID}/appeals`)
    .send(payload)
}

beforeEach(async () => {
  directory = await mkdtemp(
    join(tmpdir(), 'tribunal-test-')
  )

  filePath = join(
    directory,
    'tribunal.json'
  )

  currentTime = START_TIME

  store = createTribunalStore(
    filePath,
    now
  )

  await store.initialize()

  app = createApp({ store, now })
})

afterEach(async () => {
  await rm(directory, {
    recursive: true,
    force: true,
  })
})

describe('Tribunal API', () => {
  it('returns the health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200)

    expect(response.body.status).toBe('ok')
  })

  it('returns the server clock', async () => {
    const response = await request(app)
      .get('/api/clock')
      .expect(200)

    expect(response.body.serverNowMs)
      .toBe(START_TIME)

    expect(response.headers['cache-control'])
      .toBe('no-store')
  })

  it.each(['himass', 'tanvuu'])(
    'returns the %s dossier',
    async (playerID) => {
      const response = await request(app)
        .get(`/api/dossiers/${playerID}`)
        .expect(200)

      expect(response.body.dossier.playerID)
        .toBe(playerID)

      expect(response.body.dossier.deadlineMs)
        .toBe(START_TIME + DAY_MS)
    }
  )

  it('rejects an unknown dossier', async () => {
    await request(app)
      .get('/api/dossiers/unknown')
      .expect(404)
  })

  it('persists a valid appeal', async () => {
    const response = await postAppeal(
      validAppeal()
    ).expect(201)

    expect(response.body.appeal.appealID)
      .toBeDefined()

    expect(response.body.appeal.status)
      .toBe('received')

    expect(response.body.appeal.submittedAtMs)
      .toBe(START_TIME)
  })

  it('rejects invalid appeal fields', async () => {
    const response = await postAppeal(
      validAppeal({
        appellantName: 'A',
        statement: '',
        acknowledged: false,
      })
    ).expect(400)

    expect(response.body.error.details)
      .toHaveProperty('appellantName')

    expect(response.body.error.details)
      .toHaveProperty('statement')

    expect(response.body.error.details)
      .toHaveProperty('acknowledged')
  })

  it('enforces cross-field validation', async () => {
    const response = await postAppeal(
      validAppeal({
        appealCategory: 'evidence_review',
        evidenceUrl: '',
      })
    ).expect(400)

    expect(response.body.error.details)
      .toHaveProperty('evidenceUrl')
  })

  it('rejects invalid URL protocols', async () => {
    await postAppeal(
      validAppeal({
        evidenceUrl: 'ftp://example.com/file',
      })
    ).expect(400)
  })

  it('rejects an invalid request identifier', async () => {
    await postAppeal(
      validAppeal({
        requestID: 'invalid',
      })
    ).expect(400)
  })

  it('rejects submissions for unknown players', async () => {
    await postAppeal(
      validAppeal(),
      'unknown'
    ).expect(404)
  })

  it('rejects an expired appeal window', async () => {
    currentTime = START_TIME + DAY_MS

    const response = await postAppeal(
      validAppeal()
    ).expect(409)

    expect(response.body.error.code)
      .toBe('APPEAL_WINDOW_EXPIRED')
  })

  it('prevents duplicate submissions', async () => {
    const payload = validAppeal()

    const first = await postAppeal(
      payload
    ).expect(201)

    const second = await postAppeal(
      payload
    ).expect(409)

    expect(second.body.error.code)
      .toBe('DUPLICATE_REQUEST')

    expect(second.body.appeal.appealID)
      .toBe(first.body.appeal.appealID)

    const list = await request(app)
      .get('/api/dossiers/himass/appeals')
      .expect(200)

    expect(list.body.appeals).toHaveLength(1)
  })

  it('rejects reuse of a request ID with changed values', async () => {
    const payload = validAppeal()

    await postAppeal(payload).expect(201)

    const response = await postAppeal({
      ...payload,
      appellantName: 'Changed Name',
    }).expect(409)

    expect(response.body.appeal).toBeNull()
  })

  it('returns only non-sensitive appeal summaries', async () => {
    await postAppeal(
      validAppeal()
    ).expect(201)

    const response = await request(app)
      .get('/api/dossiers/himass/appeals')
      .expect(200)

    const summary = response.body.appeals[0]

    expect(summary).not.toHaveProperty('values')
    expect(summary).not.toHaveProperty('appellantName')
    expect(summary).not.toHaveProperty('statement')
    expect(summary).not.toHaveProperty('evidenceUrl')
  })

  it('keeps appeals isolated by player', async () => {
    await postAppeal(
      validAppeal(),
      'himass'
    ).expect(201)

    const response = await request(app)
      .get('/api/dossiers/tanvuu/appeals')
      .expect(200)

    expect(response.body.appeals).toEqual([])
  })

  it('preserves concurrent submissions', async () => {
    const responses = await Promise.all(
      Array.from(
        { length: 5 },
        () => postAppeal(validAppeal())
      )
    )

    expect(
      responses.every(
        (response) => response.status === 201
      )
    ).toBe(true)

    const response = await request(app)
      .get('/api/dossiers/himass/appeals')
      .expect(200)

    expect(response.body.appeals).toHaveLength(5)
  })

  it('preserves appeals and deadlines after reopening storage', async () => {
    await postAppeal(
      validAppeal()
    ).expect(201)

    currentTime += 60000

    const restartedStore =
      createTribunalStore(filePath, now)

    await restartedStore.initialize()

    const restartedApp = createApp({
      store: restartedStore,
      now,
    })

    const dossier = await request(
      restartedApp
    )
      .get('/api/dossiers/himass')
      .expect(200)

    const appeals = await request(
      restartedApp
    )
      .get('/api/dossiers/himass/appeals')
      .expect(200)

    expect(dossier.body.dossier.deadlineMs)
      .toBe(START_TIME + DAY_MS)

    expect(appeals.body.appeals)
      .toHaveLength(1)
  })

  it('rejects malformed JSON', async () => {
    const response = await request(app)
      .post('/api/dossiers/himass/appeals')
      .set('Content-Type', 'application/json')
      .send('{"invalid":')
      .expect(400)

    expect(response.body.error.code)
      .toBe('INVALID_JSON')
  })

  it('returns a boundary for unknown API routes', async () => {
    await request(app)
      .get('/api/unknown')
      .expect(404)
  })
})
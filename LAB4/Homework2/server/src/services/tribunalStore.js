import {
  mkdir,
  readFile,
  writeFile,
  rename,
} from 'node:fs/promises'

import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createInitialStore } from '../data/dossiers.js'

export function createTribunalStore(
  filePath,
  now = Date.now
) {
  let queue = Promise.resolve()

  function runExclusive(operation) {
    const result = queue.then(operation)

    queue = result.catch(() => {})

    return result
  }

  async function writeStore(data) {
    await mkdir(dirname(filePath), {
      recursive: true,
    })

    const temporaryPath = `${filePath}.tmp`

    await writeFile(
      temporaryPath,
      JSON.stringify(data, null, 2),
      'utf8'
    )

    await rename(temporaryPath, filePath)
  }

  async function readStore() {
    try {
      const content = await readFile(
        filePath,
        'utf8'
      )

      return JSON.parse(content)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }

      const initialData =
        createInitialStore(now())

      await writeStore(initialData)

      return initialData
    }
  }

  function initialize() {
    return runExclusive(async () => {
      await readStore()
    })
  }

  function getDossier(playerID) {
    return runExclusive(async () => {
      const data = await readStore()

      return data.dossiers.find(
        (item) => item.playerID === playerID
      ) ?? null
    })
  }

  function listAppeals(playerID) {
    return runExclusive(async () => {
      const data = await readStore()

      return data.appeals
        .filter(
          (item) => item.playerID === playerID
        )
        .map(toAppealSummary)
    })
  }

  function createAppeal(
    playerID,
    requestID,
    values
  ) {
    return runExclusive(async () => {
      const data = await readStore()

      const dossier = data.dossiers.find(
        (item) => item.playerID === playerID
      )

      if (!dossier) {
        return { kind: 'not_found' }
      }

      const existing = data.appeals.find(
        (item) =>
          item.playerID === playerID &&
          item.requestID === requestID
      )

      if (existing) {
        const samePayload = Object.keys(
          values
        ).every(
          (key) =>
            existing.values[key] === values[key]
        )

        return {
          kind: 'duplicate',
          appeal: samePayload
            ? toAppealSummary(existing)
            : null,
        }
      }

      const submittedAtMs = now()

      if (
        submittedAtMs >= dossier.deadlineMs
      ) {
        return { kind: 'expired' }
      }

      const appeal = {
        appealID: randomUUID(),
        requestID,
        playerID,
        values,
        submittedAtMs,
        status: 'received',
      }

      data.appeals.push(appeal)

      await writeStore(data)

      return {
        kind: 'created',
        appeal: toAppealSummary(appeal),
      }
    })
  }

  return {
    initialize,
    getDossier,
    listAppeals,
    createAppeal,
  }
}

function toAppealSummary(appeal) {
  return {
    appealID: appeal.appealID,
    playerID: appeal.playerID,
    appealCategory:
      appeal.values.appealCategory,
    submittedAtMs: appeal.submittedAtMs,
    status: appeal.status,
  }
}
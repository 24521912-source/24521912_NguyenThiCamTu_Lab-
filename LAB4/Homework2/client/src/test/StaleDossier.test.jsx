import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  act,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import FairPlayAppealPortal from '../FairPlayAppealPortal'
import { createTestApi } from './portalTestApi'
import { getDossierByPlayerID } from '../data/dossiers'

function createDeferred() {
  let resolve
  let reject

  const promise = new Promise(
    (resolvePromise, rejectPromise) => {
      resolve = resolvePromise
      reject = rejectPromise
    }
  )

  return {
    promise,
    resolve,
    reject,
  }
}

function createDossierResponse(playerID) {
  const now = Date.now()

  return {
    dossier: {
      ...getDossierByPlayerID(playerID),
      openedAtMs: now,
      deadlineMs: now + 86400000,
    },

    serverNowMs: now,
  }
}

function renderPortal(api) {
  return render(
    <MemoryRouter
      initialEntries={['/dossier/himass']}
    >
      <FairPlayAppealPortal api={api} />
    </MemoryRouter>
  )
}

describe('Dossier request lifecycle', () => {
  it('ignores a stale response after switching dossiers', async () => {
    const user = userEvent.setup()

    const pending = createDeferred()

    const api = createTestApi()

    api.getDossier.mockReturnValueOnce(
      pending.promise
    )

    renderPortal(api)

    await screen.findByRole('heading', {
      name: 'Loading dossier',
    })

    const originalSignal =
      api.getDossier.mock.calls[0][1]

    await user.click(
      screen.getByRole('link', {
        name: 'TanVuu',
        exact: true,
      })
    )

    await screen.findByRole('heading', {
      name: 'TanVuu',
      level: 1,
    })

    expect(originalSignal.aborted)
      .toBe(true)

    await act(async () => {
      pending.resolve(
        createDossierResponse('himass')
      )
    })

    expect(
      screen.getByRole('heading', {
        name: 'TanVuu',
        level: 1,
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Himass',
        level: 1,
      })
    ).not.toBeInTheDocument()
  })

  it('ignores a stale request error after navigation', async () => {
    const user = userEvent.setup()

    const pending = createDeferred()

    const api = createTestApi()

    api.getDossier.mockReturnValueOnce(
      pending.promise
    )

    renderPortal(api)

    await screen.findByRole('heading', {
      name: 'Loading dossier',
    })

    await user.click(
      screen.getByRole('link', {
        name: 'TanVuu',
        exact: true,
      })
    )

    await screen.findByRole('heading', {
      name: 'TanVuu',
      level: 1,
    })

    await act(async () => {
      pending.reject(
        new Error('Late network error')
      )
    })

    expect(
      screen.queryByText('Late network error')
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'TanVuu',
        level: 1,
      })
    ).toBeInTheDocument()
  })

  it('aborts an outstanding request on unmount', async () => {
    const pending = createDeferred()

    const api = createTestApi()

    api.getDossier.mockReturnValueOnce(
      pending.promise
    )

    const { unmount } = renderPortal(api)

    await waitFor(() => {
      expect(api.getDossier)
        .toHaveBeenCalledTimes(1)
    })

    const signal =
      api.getDossier.mock.calls[0][1]

    unmount()

    expect(signal.aborted).toBe(true)

    await act(async () => {
      pending.resolve(
        createDossierResponse('himass')
      )
    })
  })
})
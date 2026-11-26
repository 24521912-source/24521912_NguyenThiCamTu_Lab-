import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {
  MemoryRouter,
} from 'react-router-dom'

import FairPlayAppealPortal from '../FairPlayAppealPortal'

import {
  createTestApi,
} from './portalTestApi'

function renderPortal(api) {
  return render(
    <MemoryRouter
      initialEntries={['/dossier/himass']}
    >
      <FairPlayAppealPortal api={api} />
    </MemoryRouter>
  )
}

async function fillForm() {
  await screen.findByRole('form', {
    name: 'Himass appeal form',
  })

  fireEvent.change(
    screen.getByRole('textbox', {
      name: /appellant name/i,
    }),
    {
      target: {
        value: 'Demo Appellant',
      },
    }
  )

  fireEvent.change(
    screen.getByRole('combobox', {
      name: /appeal category/i,
    }),
    {
      target: {
        value: 'procedural_review',
      },
    }
  )

  fireEvent.change(
    screen.getByRole('textbox', {
      name: /appeal statement/i,
    }),
    {
      target: {
        value:
          'This academic appeal requests a review of the fictional case procedure.',
      },
    }
  )

  fireEvent.change(
    screen.getByRole('textbox', {
      name: /requested outcome/i,
    }),
    {
      target: {
        value:
          'Request an independent review.',
      },
    }
  )

  fireEvent.click(
    screen.getByRole('checkbox')
  )

  const button = screen.getByRole(
    'button',
    { name: 'Submit Appeal' }
  )

  await waitFor(() => {
    expect(button).toBeEnabled()
  })

  return button
}

function createDeferred() {
  let resolve

  const promise = new Promise(
    (resolvePromise) => {
      resolve = resolvePromise
    }
  )

  return { promise, resolve }
}

describe('Tribunal frontend integration', () => {
  it('loads the dossier through the API', async () => {
    const api = createTestApi()

    renderPortal(api)

    expect(
      await screen.findByRole('heading', {
        name: 'Himass',
        level: 1,
      })
    ).toBeInTheDocument()

    expect(api.getDossier)
      .toHaveBeenCalledWith(
        'himass',
        expect.any(AbortSignal)
      )
  })

  it('uses the server clock provider', async () => {
    const api = createTestApi()

    renderPortal(api)

    expect(
      await screen.findByText('Server clock')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(api.getClock)
        .toHaveBeenCalled()

      expect(
        screen.getByText(
          'Clock synchronized'
        )
      ).toBeInTheDocument()
    })
  })

  it('recovers from a failed dossier request', async () => {
    const user = userEvent.setup()

    const api = createTestApi()

    api.getDossier.mockRejectedValueOnce(
      new Error('Server unavailable.')
    )

    renderPortal(api)

    expect(
      await screen.findByText(
        'Server unavailable.'
      )
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Retry',
      })
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Himass',
        level: 1,
      })
    ).toBeInTheDocument()
  })

  it('preserves the draft and request ID after a failed submission', async () => {
    const user = userEvent.setup()

    const api = createTestApi()

    api.submitAppeal.mockRejectedValueOnce(
      new Error('Network unavailable.')
    )

    renderPortal(api)

    const button = await fillForm()

    await user.click(button)

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Your draft has been retained.'
    )

    expect(
      screen.getByRole('textbox', {
        name: /appellant name/i,
      })
    ).toHaveValue('Demo Appellant')

    const firstRequestID =
      api.submitAppeal.mock.calls[0][1]
        .requestID

    await user.click(
      screen.getByRole('button', {
        name: 'Submit Appeal',
      })
    )

    await screen.findByText(
      'Appeal received successfully.'
    )

    const secondRequestID =
      api.submitAppeal.mock.calls[1][1]
        .requestID

    expect(secondRequestID)
      .toBe(firstRequestID)
  })

  it('prevents duplicate clicks while a request is pending', async () => {
    const user = userEvent.setup()

    const pending = createDeferred()

    const api = createTestApi({
      submitAppeal: vi.fn(
        () => pending.promise
      ),
    })

    renderPortal(api)

    const button = await fillForm()

    await user.dblClick(button)

    expect(api.submitAppeal)
      .toHaveBeenCalledTimes(1)

    expect(
      screen.getByRole('button', {
        name: 'Submitting...',
      })
    ).toBeDisabled()

    expect(
      screen.queryByText(
        'Appeal received successfully.'
      )
    ).not.toBeInTheDocument()

    await act(async () => {
      pending.resolve({
        appeal: {
          appealID: 'test-receipt',
          playerID: 'himass',
          submittedAtMs: Date.now(),
          status: 'received',
        },
      })
    })

    expect(
      await screen.findByText(
        'Appeal received successfully.'
      )
    ).toBeInTheDocument()
  })

  it('does not show success without a valid receipt', async () => {
    const user = userEvent.setup()

    const api = createTestApi({
      submitAppeal: vi.fn(async () => ({})),
    })

    renderPortal(api)

    await user.click(
      await fillForm()
    )

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'The server did not confirm the appeal.'
    )

    expect(
      screen.queryByText(
        'Appeal received successfully.'
      )
    ).not.toBeInTheDocument()
  })

  it('disables submission for an expired deadline', async () => {
    const api = createTestApi()

    api.getDossier.mockResolvedValueOnce({
      dossier: {
        playerID: 'himass',
        playerName: 'Himass',
        caseID: 'FP-001',
        status: 'Demonstration',
        summary: 'Fictional case.',
        criteria: [],
        deadlineMs: Date.now() - 1000,
      },

      serverNowMs: Date.now(),
    })

    renderPortal(api)

    expect(
      await screen.findByText(
        'The appeal window has expired.'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Submit Appeal',
      })
    ).toBeDisabled()

    expect(api.submitAppeal)
      .not.toHaveBeenCalled()
  })

  it('disables submission when clock synchronization fails', async () => {
    const api = createTestApi({
      getClock: vi.fn().mockRejectedValue(
        new Error('Clock unavailable.')
      ),
    })

    renderPortal(api)

    await screen.findByText(
      /clock synchronization failed/i
    )

    expect(
      screen.getByRole('button', {
        name: 'Submit Appeal',
      })
    ).toBeDisabled()
  })
})
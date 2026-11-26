import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import FairPlayAppealPortal from '../FairPlayAppealPortal'
import { createTestApi } from './portalTestApi'

function renderPortal(path = '/', api = createTestApi()) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FairPlayAppealPortal api={api} />
    </MemoryRouter>
  )
}

async function waitForAppealForm() {
  await screen.findByRole('form', {
    name: 'Himass appeal form',
  })

  await waitFor(() => {
    expect(
      screen.getByRole('button', {
        name: 'Submit Appeal',
      })
    ).toBeEnabled()
  })
}

describe('Portal accessibility', () => {
  it('provides a keyboard-accessible skip link', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.tab()

    expect(
      screen.getByRole('link', {
        name: 'Skip to main content',
      })
    ).toHaveFocus()
  })

  it('moves focus to main content when activating the skip link', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.tab()
    await user.keyboard('{Enter}')

    expect(
      screen.getByRole('main')
    ).toHaveFocus()
  })

  it('moves focus to main content after route navigation', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.click(
      screen.getByRole('link', {
        name: 'Himass',
        exact: true,
      })
    )

    await screen.findByRole('heading', {
      name: 'Himass',
      level: 1,
    })

    expect(
      screen.getByRole('main')
    ).toHaveFocus()
  })

  it('focuses the first invalid field after submission', async () => {
    const user = userEvent.setup()

    renderPortal('/dossier/himass')

    await waitForAppealForm()

    await user.click(
      screen.getByRole('button', {
        name: 'Submit Appeal',
      })
    )

    expect(
      screen.getByRole('textbox', {
        name: /appellant name/i,
      })
    ).toHaveFocus()
  })

  it('associates validation messages with their input', async () => {
    const user = userEvent.setup()

    renderPortal('/dossier/himass')

    await waitForAppealForm()

    const input = screen.getByRole(
      'textbox',
      {
        name: /appellant name/i,
      }
    )

    await user.type(input, 'A')

    const error = screen.getByText(
      'Appellant name must contain at least 2 characters.'
    )

    expect(input).toHaveAttribute(
      'aria-invalid',
      'true'
    )

    const descriptionIDs = input
      .getAttribute('aria-describedby')
      .split(' ')

    expect(descriptionIDs).toContain(error.id)
  })

  it('does not announce every countdown update', async () => {
    renderPortal('/dossier/himass')

    const timer = await screen.findByRole(
      'timer',
      {
        name: 'Remaining appeal time',
      }
    )

    expect(timer).toHaveAttribute(
      'aria-live',
      'off'
    )
  })
})
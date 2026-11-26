import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  render,
  screen,
  within,
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {
  MemoryRouter,
} from 'react-router-dom'

import FairPlayAppealPortal from '../FairPlayAppealPortal'

import {
  createTestApi,
} from './portalTestApi'

function renderPortal(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FairPlayAppealPortal
        api={createTestApi()}
      />
    </MemoryRouter>
  )
}

describe('Dossier routing', () => {
  it('renders the tribunal overview', () => {
    renderPortal()

    expect(
      screen.getByRole('heading', {
        name: 'Appeal Tribunal',
        level: 1,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'View Himass dossier',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'View TanVuu dossier',
      })
    ).toBeInTheDocument()
  })

  it.each([
    ['himass', 'Himass'],
    ['tanvuu', 'TanVuu'],
  ])(
    'renders the %s dossier through a direct route',
    async (playerID, playerName) => {
      renderPortal(`/dossier/${playerID}`)

      expect(
        await screen.findByRole('heading', {
          name: playerName,
          level: 1,
        })
      ).toBeInTheDocument()

      expect(
        screen.getByRole('heading', {
          name: 'Disproportionality Matrix',
        })
      ).toBeInTheDocument()
    }
  )

  it('navigates between player dossiers', async () => {
    const user = userEvent.setup()

    renderPortal('/dossier/himass')

    await screen.findByRole('heading', {
      name: 'Himass',
      level: 1,
    })

    const navigation = screen.getByRole(
      'navigation',
      { name: 'Main navigation' }
    )

    await user.click(
      within(navigation).getByRole('link', {
        name: 'TanVuu',
      })
    )

    expect(
      await screen.findByRole('heading', {
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

  it('marks the current dossier navigation link', async () => {
    renderPortal('/dossier/himass')

    await screen.findByRole('heading', {
      name: 'Himass',
      level: 1,
    })

    expect(
      screen.getByRole('link', {
        name: 'Himass',
        exact: true,
      })
    ).toHaveAttribute('aria-current', 'page')
  })

  it('shows a boundary for unknown player identifiers', async () => {
    renderPortal('/dossier/unknown-player')

    expect(
      await screen.findByRole('heading', {
        name: 'Dossier not found',
      })
    ).toBeInTheDocument()
  })

  it('shows a boundary for unknown routes', () => {
    renderPortal('/unknown-page')

    expect(
      screen.getByRole('heading', {
        name: 'Page not found',
      })
    ).toBeInTheDocument()
  })

  it('allows navigation back from the not-found page', async () => {
    const user = userEvent.setup()

    renderPortal('/dossier/unknown-player')

    await user.click(
      await screen.findByRole('link', {
        name: 'Back to overview',
      })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Appeal Tribunal',
        level: 1,
      })
    ).toBeInTheDocument()
  })

  it('displays fictional data notices', async () => {
    renderPortal('/dossier/tanvuu')

    expect(
      await screen.findByText(
        'Fictional case data'
      )
    ).toBeInTheDocument()
  })

  it('updates the derived matrix when switching dossiers', async () => {
    const user = userEvent.setup()

    renderPortal('/dossier/himass')

    const table = await screen.findByRole(
      'table',
      {
        name:
          'Review criteria and calculated deviations',
      }
    )

    expect(
      within(table).getByRole('row', {
        name: /Procedural Review/i,
      })
    ).toHaveTextContent('-10.0')

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

    const updatedTable = screen.getByRole(
      'table',
      {
        name:
          'Review criteria and calculated deviations',
      }
    )

    expect(
      within(updatedTable).getByRole(
        'row',
        {
          name: /Procedural Review/i,
        }
      )
    ).toHaveTextContent('-15.0')
  })
})
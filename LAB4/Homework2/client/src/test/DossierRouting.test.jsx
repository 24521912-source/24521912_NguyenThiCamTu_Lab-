import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import FairPlayAppealPortal from '../FairPlayAppealPortal'

function renderPortal(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FairPlayAppealPortal />
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
    (playerID, playerName) => {
      renderPortal(`/dossier/${playerID}`)

      expect(
        screen.getByRole('heading', {
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

  it('marks the current dossier navigation link', () => {
    renderPortal('/dossier/himass')

    expect(
      screen.getByRole('link', {
        name: 'Himass',
        exact: true,
      })
    ).toHaveAttribute('aria-current', 'page')
  })

  it('shows a boundary for unknown player identifiers', () => {
    renderPortal('/dossier/unknown-player')

    expect(
      screen.getByRole('heading', {
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
      screen.getByRole('link', {
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

  it('displays fictional data notices', () => {
    renderPortal('/dossier/tanvuu')

    expect(
      screen.getByText('Fictional case data')
    ).toBeInTheDocument()
  })

  it('updates the derived matrix when switching dossiers', async () => {
    const user = userEvent.setup()

    renderPortal('/dossier/himass')

    const table = screen.getByRole('table', {
      name: 'Review criteria and calculated deviations',
    })

    const procedureRow = within(table).getByRole(
      'row',
      { name: /Procedural Review/i }
    )

    expect(
      within(procedureRow).getByText('-10.0')
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', {
        name: 'TanVuu',
        exact: true,
      })
    )

    const updatedTable = screen.getByRole('table', {
      name: 'Review criteria and calculated deviations',
    })

    const updatedRow = within(updatedTable).getByRole(
      'row',
      { name: /Procedural Review/i }
    )

    expect(
      within(updatedRow).getByText('-15.0')
    ).toBeInTheDocument()
  })
})
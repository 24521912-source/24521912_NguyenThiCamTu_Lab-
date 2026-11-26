import { describe, expect, it } from 'vitest'
import {
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import FairPlayAppealPortal from '../FairPlayAppealPortal'

function renderPortal(
  path = '/dossier/himass'
) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FairPlayAppealPortal />
    </MemoryRouter>
  )
}

function getNameInput() {
  return screen.getByRole('textbox', {
    name: /appellant name/i,
  })
}

function getCategoryInput() {
  return screen.getByRole('combobox', {
    name: /appeal category/i,
  })
}

function getEvidenceInput() {
  return screen.getByRole('textbox', {
    name: /evidence url/i,
  })
}

async function fillValidAppeal(user) {
  await user.type(
    getNameInput(),
    'Demo Appellant'
  )

  await user.selectOptions(
    getCategoryInput(),
    'procedural_review'
  )

  await user.type(
    screen.getByRole('textbox', {
      name: /appeal statement/i,
    }),
    'This academic appeal requests a review of the fictional case procedure.'
  )

  await user.type(
    screen.getByRole('textbox', {
      name: /requested outcome/i,
    }),
    'Request an independent review.'
  )

  await user.click(
    screen.getByRole('checkbox', {
      name: /i acknowledge/i,
    })
  )
}

async function navigateTo(user, playerName) {
  const navigation = screen.getByRole(
    'navigation',
    { name: 'Main navigation' }
  )

  await user.click(
    within(navigation).getByRole('link', {
      name: playerName,
      exact: true,
    })
  )
}

describe('Appeal form', () => {
  it('renders an empty appeal form', () => {
    renderPortal()

    expect(
      screen.getByRole('form', {
        name: 'Himass appeal form',
      })
    ).toBeInTheDocument()

    expect(getNameInput()).toHaveValue('')

    expect(
      screen.getByRole('checkbox')
    ).not.toBeChecked()
  })

  it('does not display initial validation errors', () => {
    renderPortal()

    expect(
      screen.queryByText(
        'Appellant name is required.'
      )
    ).not.toBeInTheDocument()
  })

  it('validates a name while the user types', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.type(getNameInput(), 'A')

    expect(
      screen.getByText(
        'Appellant name must contain at least 2 characters.'
      )
    ).toBeInTheDocument()

    expect(getNameInput()).toHaveAttribute(
      'aria-invalid',
      'true'
    )

    await user.type(getNameInput(), 'lex')

    expect(
      screen.queryByText(
        'Appellant name must contain at least 2 characters.'
      )
    ).not.toBeInTheDocument()

    expect(getNameInput()).toHaveAttribute(
      'aria-invalid',
      'false'
    )
  })

  it('shows a required error after an empty field loses focus', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.click(getNameInput())

    await user.tab()

    expect(
      screen.getByText(
        'Appellant name is required.'
      )
    ).toBeInTheDocument()
  })

  it('requires evidence when evidence review is selected', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.selectOptions(
      getCategoryInput(),
      'evidence_review'
    )

    expect(getEvidenceInput()).toBeRequired()

    expect(
      screen.getByText(
        'An evidence URL is required for evidence review.'
      )
    ).toBeInTheDocument()
  })

  it('removes the evidence requirement when the category changes', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.selectOptions(
      getCategoryInput(),
      'evidence_review'
    )

    await user.selectOptions(
      getCategoryInput(),
      'procedural_review'
    )

    expect(
      getEvidenceInput()
    ).not.toBeRequired()

    expect(
      screen.queryByText(
        'An evidence URL is required for evidence review.'
      )
    ).not.toBeInTheDocument()
  })

  it('blocks invalid appeal validation', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.click(
      screen.getByRole('button', {
        name: 'Validate Appeal',
      })
    )

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent(
      'Please correct the highlighted fields'
    )

    expect(
      screen.queryByRole('status')
    ).not.toBeInTheDocument()
  })

  it('validates a complete appeal without claiming server submission', async () => {
    const user = userEvent.setup()

    renderPortal()

    await fillValidAppeal(user)

    await user.click(
      screen.getByRole('button', {
        name: 'Validate Appeal',
      })
    )

    expect(
      screen.getByRole('status')
    ).toHaveTextContent(
      'All fields are valid.'
    )

    expect(
      screen.getByRole('status')
    ).toHaveTextContent(
      'Server submission is not available yet.'
    )
  })

  it('clears the validated status after editing the draft', async () => {
    const user = userEvent.setup()

    renderPortal()

    await fillValidAppeal(user)

    await user.click(
      screen.getByRole('button', {
        name: 'Validate Appeal',
      })
    )

    expect(
      screen.getByRole('status')
    ).toBeInTheDocument()

    await user.type(getNameInput(), ' A')

    expect(
      screen.queryByRole('status')
    ).not.toBeInTheDocument()
  })

  it('keeps independent drafts for each player', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.type(
      getNameInput(),
      'Himass Draft'
    )

    await navigateTo(user, 'TanVuu')

    expect(getNameInput()).toHaveValue('')

    await user.type(
      getNameInput(),
      'TanVuu Draft'
    )

    await navigateTo(user, 'Himass')

    expect(getNameInput()).toHaveValue(
      'Himass Draft'
    )

    await navigateTo(user, 'TanVuu')

    expect(getNameInput()).toHaveValue(
      'TanVuu Draft'
    )
  })

  it('preserves the draft after visiting the overview', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.type(
      getNameInput(),
      'Saved Draft'
    )

    await navigateTo(user, 'Overview')

    expect(
      screen.queryByRole('form')
    ).not.toBeInTheDocument()

    await navigateTo(user, 'Himass')

    expect(getNameInput()).toHaveValue(
      'Saved Draft'
    )
  })

  it('resets the current draft and its validation state', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.type(
      getNameInput(),
      'Demo Appellant'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Validate Appeal',
      })
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Reset draft',
      })
    )

    expect(getNameInput()).toHaveValue('')

    expect(
      screen.queryByRole('alert')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(
        'Appellant name is required.'
      )
    ).not.toBeInTheDocument()
  })

  it('does not reset the other player draft', async () => {
    const user = userEvent.setup()

    renderPortal()

    await user.type(
      getNameInput(),
      'Himass Draft'
    )

    await navigateTo(user, 'TanVuu')

    await user.type(
      getNameInput(),
      'TanVuu Draft'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Reset draft',
      })
    )

    expect(getNameInput()).toHaveValue('')

    await navigateTo(user, 'Himass')

    expect(getNameInput()).toHaveValue(
      'Himass Draft'
    )
  })
})
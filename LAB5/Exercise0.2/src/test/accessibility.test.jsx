import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

describe('Evidence Explorer accessibility', () => {
  it('provides a main landmark', () => {
    render(<App />)

    expect(
      screen.getByRole('main'),
    ).toBeInTheDocument()
  })

  it('provides a named evidence region', () => {
    render(<App />)

    expect(
      screen.getByRole('region', {
        name: 'Evidence clips',
      }),
    ).toBeInTheDocument()
  })

  it('provides accessible pagination buttons', () => {
    render(<App />)

    const navigation = screen.getByRole('navigation', {
      name: 'Evidence pagination',
    })

    expect(
      within(navigation).getByRole('button', {
        name: 'Previous',
      }),
    ).toBeInTheDocument()

    expect(
      within(navigation).getByRole('button', {
        name: 'Next',
      }),
    ).toBeInTheDocument()
  })

  it('skips disabled Previous during keyboard navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.tab()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toHaveFocus()
  })

  it('supports pagination using the keyboard', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.tab()
    await user.keyboard('{Enter}')

    expect(
      screen.getByText('Page 2 of 3'),
    ).toBeInTheDocument()
  })

  it('announces changes to the current page', async () => {
    const user = userEvent.setup()

    render(<App />)

    const indicator = screen.getByText('Page 1 of 3')

    expect(indicator).toHaveAttribute(
      'aria-live',
      'polite',
    )

    expect(indicator).toHaveAttribute(
      'aria-atomic',
      'true',
    )

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    expect(indicator).toHaveTextContent('Page 2 of 3')
  })

  it('provides an accessible empty state', () => {
    render(<App clips={[]} />)

    expect(
      screen.getByRole('status'),
    ).toHaveTextContent(
      'No evidence clips available.',
    )

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeDisabled()
  })

  it('keeps clip duration accessible', () => {
    render(<App />)

    const firstCard = screen.getAllByRole('article')[0]

    const duration = within(firstCard).getByText('00:42')

    expect(duration).toBeInTheDocument()

    expect(
      duration.closest('[aria-hidden="true"]'),
    ).toBeNull()
  })

  it('hides decorative thumbnail icons from assistive technology', () => {
    render(<App />)

    const firstCard = screen.getAllByRole('article')[0]

    const icon = within(firstCard).getByText('▶')

    expect(icon).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})
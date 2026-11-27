import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

describe('Evidence Explorer pagination', () => {
  it('starts on the first page', () => {
    render(<App />)

    expect(
      screen.getByText('Page 1 of 3'),
    ).toBeInTheDocument()

    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  it('disables Previous on the first page', () => {
    render(<App />)

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeEnabled()
  })

  it('navigates to the second page', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    expect(
      screen.getByText('Page 2 of 3'),
    ).toBeInTheDocument()

    expect(screen.getAllByRole('article')).toHaveLength(6)

    expect(
      screen.getAllByRole('article')[0],
    ).toHaveAttribute('data-clip-id', 'clip-007')
  })

  it('navigates to the last page', async () => {
    const user = userEvent.setup()

    render(<App />)

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    })

    await user.click(nextButton)
    await user.click(nextButton)

    expect(
      screen.getByText('Page 3 of 3'),
    ).toBeInTheDocument()

    expect(screen.getAllByRole('article')).toHaveLength(1)

    expect(
      screen.getByRole('article'),
    ).toHaveAttribute('data-clip-id', 'clip-013')

    expect(nextButton).toBeDisabled()
  })

  it('navigates back to the previous page', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    await user.click(
      screen.getByRole('button', { name: 'Previous' }),
    )

    expect(
      screen.getByText('Page 1 of 3'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled()
  })

  it('prevents navigation beyond the last page', async () => {
    const user = userEvent.setup()

    render(<App />)

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    })

    await user.click(nextButton)
    await user.click(nextButton)
    await user.click(nextButton)

    expect(
      screen.getByText('Page 3 of 3'),
    ).toBeInTheDocument()

    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('prevents navigation before the first page', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: 'Previous' }),
    )

    expect(
      screen.getByText('Page 1 of 3'),
    ).toBeInTheDocument()
  })

  it('provides an accessible pagination navigation landmark', () => {
    render(<App />)

    expect(
      screen.getByRole('navigation', {
        name: 'Evidence pagination',
      }),
    ).toBeInTheDocument()
  })
})
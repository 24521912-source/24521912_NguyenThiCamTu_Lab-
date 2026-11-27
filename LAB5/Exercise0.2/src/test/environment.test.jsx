import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('Project environment', () => {
  it('renders the application heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Evidence Explorer',
        level: 1,
      }),
    ).toBeInTheDocument()
  })

  it('displays the exercise description', () => {
    render(<App />)

    expect(
      screen.getByText(
        'Zero-Effect Pagination & Container Queries',
      ),
    ).toBeInTheDocument()
  })

  it('renders the evidence collection', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Evidence Collection',
      }),
    ).toBeInTheDocument()
  })
})
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import App from '../App'

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Application routing', () => {
  it('renders the home page', () => {
    renderApp()

    expect(
      screen.getByRole('heading', {
        name: 'Discover moments through images',
      }),
    ).toBeInTheDocument()
  })

  it('navigates to the gallery page', async () => {
    const user = userEvent.setup()

    renderApp()

    const galleryLink = screen.getByRole('link', {
      name: 'Gallery',
    })

    await user.click(galleryLink)

    expect(
      screen.getByRole('heading', {
        name: 'Explore the gallery',
      }),
    ).toBeInTheDocument()

    expect(galleryLink).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders six gallery images', () => {
    renderApp('/gallery')

    expect(screen.getAllByRole('img')).toHaveLength(6)
  })

  it('provides alternative text for every image', () => {
    renderApp('/gallery')

    const images = screen.getAllByRole('img')

    images.forEach((image) => {
      expect(image.getAttribute('alt')?.trim()).toBeTruthy()
    })
  })

  it('renders the about page', () => {
    renderApp('/about')

    expect(
      screen.getByRole('heading', {
        name: 'About this project',
      }),
    ).toBeInTheDocument()
  })

  it('renders a not found page for unknown routes', () => {
    renderApp('/unknown-page')

    expect(
      screen.getByRole('heading', {
        name: 'Page not found',
      }),
    ).toBeInTheDocument()
  })
})
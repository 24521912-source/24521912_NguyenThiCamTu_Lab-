import { describe, expect, it } from 'vitest'
import {
  render,
  screen,
  within,
} from '@testing-library/react'
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

describe('Application accessibility', () => {
  it('provides a named main navigation landmark', () => {
    renderApp()

    expect(
      screen.getByRole('navigation', {
        name: 'Main navigation',
      }),
    ).toBeInTheDocument()
  })

  it('provides a main content landmark', () => {
    renderApp()

    expect(
      screen.getByRole('main'),
    ).toHaveAttribute('id', 'main-content')
  })

  it('provides a working keyboard skip link', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.tab()

    const skipLink = screen.getByRole('link', {
      name: 'Skip to main content',
    })

    expect(skipLink).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByRole('main'),
    ).toHaveFocus()
  })

  it.each([
    ['/', 'Home | FrameGallery'],
    ['/gallery', 'Gallery | FrameGallery'],
    ['/about', 'About | FrameGallery'],
    ['/unknown-page', 'Page not found | FrameGallery'],
  ])('sets the document title for %s', (path, title) => {
    renderApp(path)

    expect(document.title).toBe(title)
  })

  it('updates the document title after navigation', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.click(
      screen.getByRole('link', {
        name: 'Gallery',
      }),
    )

    expect(document.title).toBe(
      'Gallery | FrameGallery',
    )
  })

  it('moves focus to main content after route navigation', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.click(
      screen.getByRole('link', {
        name: 'Gallery',
      }),
    )

    expect(
      screen.getByRole('main'),
    ).toHaveFocus()
  })

  it('preserves filter button focus after filtering', async () => {
    const user = userEvent.setup()

    renderApp('/gallery')

    const natureButton = screen.getByRole('button', {
      name: 'Nature',
    })

    await user.click(natureButton)

    expect(natureButton).toHaveFocus()

    expect(natureButton).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('provides descriptive alternative text for gallery images', () => {
    renderApp('/gallery')

    const images = within(
      screen.getByRole('main'),
    ).getAllByRole('img')

    expect(images).toHaveLength(6)

    images.forEach((image) => {
      expect(image.getAttribute('alt')?.trim()).toBeTruthy()
    })
  })

  it('supports keyboard activation of a photo', async () => {
    const user = userEvent.setup()

    renderApp('/gallery')

    const photoButton = screen.getByRole('button', {
      name: 'View Mountain Landscape',
    })

    photoButton.focus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByRole('dialog', {
        name: 'Mountain Landscape',
      }),
    ).toHaveAttribute('open')
  })

  it('moves focus into the photo dialog', async () => {
    const user = userEvent.setup()

    renderApp('/gallery')

    await user.click(
      screen.getByRole('button', {
        name: 'View Mountain Landscape',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: 'Close photo',
      }),
    ).toHaveFocus()
  })

  it('restores focus to the photo button after closing', async () => {
    const user = userEvent.setup()

    renderApp('/gallery')

    const photoButton = screen.getByRole('button', {
      name: 'View Mountain Landscape',
    })

    await user.click(photoButton)

    await user.click(
      screen.getByRole('button', {
        name: 'Close photo',
      }),
    )

    expect(photoButton).toHaveFocus()
  })

  it('restores focus to the heading after closing a direct photo URL', async () => {
    const user = userEvent.setup()

    renderApp('/gallery?photoId=p01')

    await user.click(
      screen.getByRole('button', {
        name: 'Close photo',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Explore the gallery',
      }),
    ).toHaveFocus()
  })
})
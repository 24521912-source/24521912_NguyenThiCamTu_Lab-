import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  useLocation,
  useNavigate,
} from 'react-router'
import App from '../App'

function RouterControls() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div>
      <output data-testid="current-url">
        {location.pathname + location.search}
      </output>

      <button onClick={() => navigate(-1)}>
        Test Back
      </button>

      <button onClick={() => navigate(1)}>
        Test Forward
      </button>
    </div>
  )
}

function renderGallery(path = '/gallery') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <RouterControls />
    </MemoryRouter>,
  )
}

function getGalleryImages() {
  return within(
    screen.getByRole('main'),
  ).getAllByRole('img')
}

describe('URL-based category filtering', () => {
  it('displays all images by default', () => {
    renderGallery()

    expect(getGalleryImages()).toHaveLength(6)

    expect(
      screen.getByRole('button', { name: 'All' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it.each([
    ['nature', 3],
    ['urban', 2],
    ['architecture', 1],
  ])(
    'filters the gallery using category=%s',
    (category, count) => {
      renderGallery(`/gallery?category=${category}`)

      expect(getGalleryImages()).toHaveLength(count)

      expect(
        screen.getByRole('button', {
          name: new RegExp(`^${category}$`, 'i'),
        }),
      ).toHaveAttribute('aria-pressed', 'true')
    },
  )

  it.each([
    '/gallery?category=unknown',
    '/gallery?category=',
    '/gallery?category=all',
  ])('falls back to all images for %s', (path) => {
    renderGallery(path)

    expect(getGalleryImages()).toHaveLength(6)

    expect(
      screen.getByRole('button', { name: 'All' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates the URL when a category is selected', async () => {
    const user = userEvent.setup()

    renderGallery()

    await user.click(
      screen.getByRole('button', { name: 'Nature' }),
    )

    expect(
      screen.getByTestId('current-url'),
    ).toHaveTextContent('/gallery?category=nature')

    expect(getGalleryImages()).toHaveLength(3)
  })

  it('removes the category when All is selected', async () => {
    const user = userEvent.setup()

    renderGallery('/gallery?category=nature')

    await user.click(
      screen.getByRole('button', { name: 'All' }),
    )

    expect(
      screen.getByTestId('current-url').textContent,
    ).toBe('/gallery')

    expect(getGalleryImages()).toHaveLength(6)
  })

  it('preserves unrelated query parameters', async () => {
    const user = userEvent.setup()

    renderGallery('/gallery?source=demo&photoId=p01')

    await user.click(
      screen.getByRole('button', { name: 'Urban' }),
    )

    const url = new URL(
      screen.getByTestId('current-url').textContent,
      'http://localhost',
    )

    expect(url.searchParams.get('category')).toBe('urban')
    expect(url.searchParams.get('source')).toBe('demo')
    expect(url.searchParams.get('photoId')).toBe('p01')
  })

  it('restores filters using Back and Forward', async () => {
    const user = userEvent.setup()

    renderGallery()

    await user.click(
      screen.getByRole('button', { name: 'Nature' }),
    )

    await user.click(
      screen.getByRole('button', { name: 'Urban' }),
    )

    expect(getGalleryImages()).toHaveLength(2)

    await user.click(
      screen.getByRole('button', { name: 'Test Back' }),
    )

    expect(getGalleryImages()).toHaveLength(3)

    await user.click(
      screen.getByRole('button', { name: 'Test Forward' }),
    )

    expect(getGalleryImages()).toHaveLength(2)
  })

  it('avoids duplicate history entries', async () => {
    const user = userEvent.setup()

    renderGallery()

    const natureButton = screen.getByRole('button', {
      name: 'Nature',
    })

    await user.click(natureButton)
    await user.click(natureButton)

    await user.click(
      screen.getByRole('button', { name: 'Test Back' }),
    )

    expect(
      screen.getByTestId('current-url').textContent,
    ).toBe('/gallery')

    expect(getGalleryImages()).toHaveLength(6)
  })
})
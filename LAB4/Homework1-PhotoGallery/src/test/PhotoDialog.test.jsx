import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('URL-driven photo dialog', () => {
  it('keeps the dialog closed by default', () => {
    renderGallery()

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument()
  })

  it('opens a photo when its button is clicked', async () => {
    const user = userEvent.setup()

    renderGallery()

    await user.click(
      screen.getByRole('button', {
        name: 'View Mountain Landscape',
      }),
    )

    expect(
      screen.getByRole('dialog', {
        name: 'Mountain Landscape',
      }),
    ).toHaveAttribute('open')

    expect(
      screen.getByTestId('current-url'),
    ).toHaveTextContent('photoId=p01')
  })

  it('opens a photo from a direct URL', () => {
    renderGallery('/gallery?photoId=p06')

    expect(
      screen.getByRole('dialog', {
        name: 'City Street',
      }),
    ).toHaveAttribute('open')
  })

  it.each([
    '/gallery?photoId=invalid',
    '/gallery?photoId=',
  ])('ignores invalid photo IDs in %s', (path) => {
    renderGallery(path)

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument()
  })

  it('preserves category when opening a photo', async () => {
    const user = userEvent.setup()

    renderGallery('/gallery?category=nature')

    await user.click(
      screen.getByRole('button', {
        name: 'View Mountain Landscape',
      }),
    )

    const url = new URL(
      screen.getByTestId('current-url').textContent,
      'http://localhost',
    )

    expect(url.searchParams.get('category')).toBe('nature')
    expect(url.searchParams.get('photoId')).toBe('p01')
  })

  it('removes only photoId when closing the dialog', async () => {
    const user = userEvent.setup()

    renderGallery(
      '/gallery?category=nature&photoId=p01&source=demo',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Close photo',
      }),
    )

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument()

    const url = new URL(
      screen.getByTestId('current-url').textContent,
      'http://localhost',
    )

    expect(url.searchParams.has('photoId')).toBe(false)
    expect(url.searchParams.get('category')).toBe('nature')
    expect(url.searchParams.get('source')).toBe('demo')
  })

  it('supports a photo outside the active category', () => {
    renderGallery(
      '/gallery?category=urban&photoId=p01',
    )

    expect(
      screen.getByRole('dialog', {
        name: 'Mountain Landscape',
      }),
    ).toHaveAttribute('open')
  })

  it('restores the dialog using Back and Forward', async () => {
    const user = userEvent.setup()

    renderGallery()

    await user.click(
      screen.getByRole('button', {
        name: 'View Mountain Landscape',
      }),
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Test Back',
      }),
    )

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Test Forward',
      }),
    )

    expect(
      screen.getByRole('dialog', {
        name: 'Mountain Landscape',
      }),
    ).toHaveAttribute('open')
  })
})
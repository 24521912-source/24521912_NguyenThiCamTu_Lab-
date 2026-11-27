import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'
import EvidenceGrid from '../components/EvidenceGrid.jsx'

function createClips(count) {
  return Array.from({ length: count }, (_, index) => ({
    _id: `regression-${index + 1}`,
    title: `Regression Clip ${index + 1}`,
    description: 'Fictional regression test data.',
    category: 'Demonstration',
    duration: '00:30',
  }))
}

describe('Pagination regression tests', () => {
  it.each([
    [0, 1, 0],
    [1, 1, 1],
    [6, 1, 6],
    [7, 2, 6],
    [12, 2, 6],
    [13, 3, 6],
  ])(
    'renders the correct first page for %i clips',
    (count, totalPages, visibleCount) => {
      render(<App clips={createClips(count)} />)

      expect(
        screen.getByText(`Page 1 of ${totalPages}`),
      ).toBeInTheDocument()

      expect(
        screen.queryAllByRole('article'),
      ).toHaveLength(visibleCount)

      expect(
        screen.getByRole('button', { name: 'Previous' }),
      ).toBeDisabled()

      const nextButton = screen.getByRole('button', {
        name: 'Next',
      })

      if (totalPages === 1) {
        expect(nextButton).toBeDisabled()
      } else {
        expect(nextButton).toBeEnabled()
      }
    },
  )

  it.each([
    [1, 1],
    [6, 6],
    [7, 1],
    [12, 6],
    [13, 1],
  ])(
    'renders the correct last-page size for %i clips',
    async (count, expectedLastPageSize) => {
      const user = userEvent.setup()

      render(<App clips={createClips(count)} />)

      const totalPages = Math.ceil(count / 6)

      const nextButton = screen.getByRole('button', {
        name: 'Next',
      })

      for (let page = 1; page < totalPages; page += 1) {
        await user.click(nextButton)
      }

      expect(
        screen.getByText(
          `Page ${totalPages} of ${totalPages}`,
        ),
      ).toBeInTheDocument()

      expect(
        screen.getAllByRole('article'),
      ).toHaveLength(expectedLastPageSize)

      expect(nextButton).toBeDisabled()
    },
  )

  it('keeps the summary correct across page changes', async () => {
    const user = userEvent.setup()

    render(<App clips={createClips(13)} />)

    expect(
      screen.getByText('Showing 1–6 of 13 clips'),
    ).toBeInTheDocument()

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    })

    await user.click(nextButton)

    expect(
      screen.getByText('Showing 7–12 of 13 clips'),
    ).toBeInTheDocument()

    await user.click(nextButton)

    expect(
      screen.getByText('Showing 13–13 of 13 clips'),
    ).toBeInTheDocument()
  })

  it('keeps the grid and controls synchronized after data shrink', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <App clips={createClips(13)} />,
    )

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    })

    await user.click(nextButton)
    await user.click(nextButton)

    expect(
      screen.getByText('Page 3 of 3'),
    ).toBeInTheDocument()

    rerender(<App clips={createClips(7)} />)

    expect(
      screen.getByText('Page 2 of 2'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Showing 7–7 of 7 clips'),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('article'),
    ).toHaveLength(1)

    expect(
      screen.getByRole('heading', {
        name: 'Regression Clip 7',
      }),
    ).toBeInTheDocument()

    expect(nextButton).toBeDisabled()
  })

  it('navigates correctly after the effective page is clamped', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <App clips={createClips(13)} />,
    )

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    })

    await user.click(nextButton)
    await user.click(nextButton)

    rerender(<App clips={createClips(7)} />)

    await user.click(
      screen.getByRole('button', { name: 'Previous' }),
    )

    expect(
      screen.getByText('Page 1 of 2'),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('article'),
    ).toHaveLength(6)
  })

  it('handles data becoming empty on a later page', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <App clips={createClips(13)} />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    rerender(<App clips={[]} />)

    expect(
      screen.getByText('Page 1 of 1'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Showing 0–0 of 0 clips'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('No evidence clips available.'),
    ).toBeInTheDocument()

    expect(
      screen.queryAllByRole('article'),
    ).toHaveLength(0)

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeDisabled()
  })

  it('clamps an out-of-range page to the last page', () => {
    render(
      <EvidenceGrid
        clips={createClips(13)}
        page={100}
      />,
    )

    expect(
      screen.getAllByRole('article'),
    ).toHaveLength(1)

    expect(
      screen.getByRole('heading', {
        name: 'Regression Clip 13',
      }),
    ).toBeInTheDocument()
  })

  it.each([
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    null,
    '2',
  ])('normalizes an invalid page: %s', (page) => {
    render(
      <EvidenceGrid
        clips={createClips(13)}
        page={page}
      />,
    )

    expect(
      screen.getAllByRole('article'),
    ).toHaveLength(6)

    expect(
      screen.getByRole('heading', {
        name: 'Regression Clip 1',
      }),
    ).toBeInTheDocument()
  })

  it.each([
    0,
    -1,
    2.5,
    NaN,
    Infinity,
    null,
    '3',
  ])('normalizes an invalid page size: %s', (pageSize) => {
    render(
      <EvidenceGrid
        clips={createClips(13)}
        page={1}
        pageSize={pageSize}
      />,
    )

    expect(
      screen.getAllByRole('article'),
    ).toHaveLength(6)
  })

  it('handles a non-array source safely', () => {
    render(<App clips={null} />)

    expect(
      screen.getByText('Page 1 of 1'),
    ).toBeInTheDocument()

    expect(
      screen.queryAllByRole('article'),
    ).toHaveLength(0)
  })

  it('preserves DOM identity when clips are reordered', () => {
    const clips = createClips(6)

    const { rerender } = render(
      <EvidenceGrid clips={clips} page={1} />,
    )

    const originalCards = screen.getAllByRole('article')

    const originalNodes = new Map(
      originalCards.map((card) => [
        card.dataset.clipId,
        card,
      ]),
    )

    const reversedClips = [...clips].reverse()

    rerender(
      <EvidenceGrid
        clips={reversedClips}
        page={1}
      />,
    )

    const reorderedCards = screen.getAllByRole('article')

    expect(
      reorderedCards.map((card) => card.dataset.clipId),
    ).toEqual(
      reversedClips.map((clip) => clip._id),
    )

    reorderedCards.forEach((card) => {
      expect(card).toBe(
        originalNodes.get(card.dataset.clipId),
      )
    })
  })

  it('does not mutate source clips during navigation', async () => {
    const user = userEvent.setup()

    const clips = Object.freeze(
      createClips(13).map((clip) => Object.freeze(clip)),
    )

    const snapshot = structuredClone(clips)

    render(<App clips={clips} />)

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    await user.click(
      screen.getByRole('button', { name: 'Previous' }),
    )

    expect(clips).toEqual(snapshot)
  })
})
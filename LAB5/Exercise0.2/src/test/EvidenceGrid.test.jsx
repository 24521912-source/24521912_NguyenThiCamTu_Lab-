import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import EvidenceGrid from '../components/EvidenceGrid.jsx'

function createClips(count) {
  return Array.from({ length: count }, (_, index) => ({
    _id: `clip-${index + 1}`,
    title: `Demo Clip ${index + 1}`,
    description: `Fictional description ${index + 1}`,
    category: 'Demonstration',
    duration: '00:30',
  }))
}

describe('EvidenceGrid', () => {
  it('renders six cards by default', () => {
    render(
      <EvidenceGrid clips={createClips(13)} page={1} />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  it('renders the correct items on the first page', () => {
    render(
      <EvidenceGrid clips={createClips(13)} page={1} />,
    )

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 1' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 6' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Demo Clip 7' }),
    ).not.toBeInTheDocument()
  })

  it('renders the correct items on the second page', () => {
    render(
      <EvidenceGrid clips={createClips(13)} page={2} />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(6)

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 7' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 12' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Demo Clip 1' }),
    ).not.toBeInTheDocument()
  })

  it('renders a partial last page', () => {
    render(
      <EvidenceGrid clips={createClips(13)} page={3} />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(1)

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 13' }),
    ).toBeInTheDocument()
  })

  it('renders an empty state when there are no clips', () => {
    render(<EvidenceGrid clips={[]} page={1} />)

    expect(
      screen.getByText('No evidence clips available.'),
    ).toBeInTheDocument()

    expect(
      screen.queryAllByRole('article'),
    ).toHaveLength(0)
  })

  it('supports a custom page size', () => {
    render(
      <EvidenceGrid
        clips={createClips(10)}
        page={2}
        pageSize={3}
      />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(3)

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 4' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 6' }),
    ).toBeInTheDocument()
  })

  it('updates visible items when the page prop changes', () => {
    const clips = createClips(13)

    const { rerender } = render(
      <EvidenceGrid clips={clips} page={1} />,
    )

    rerender(
      <EvidenceGrid clips={clips} page={2} />,
    )

    expect(
      screen.queryByRole('heading', { name: 'Demo Clip 1' }),
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 7' }),
    ).toBeInTheDocument()
  })

  it('clamps the page when the source data shrinks', () => {
    const { rerender } = render(
      <EvidenceGrid clips={createClips(13)} page={3} />,
    )

    rerender(
      <EvidenceGrid clips={createClips(7)} page={3} />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(1)

    expect(
      screen.getByRole('heading', { name: 'Demo Clip 7' }),
    ).toBeInTheDocument()
  })

  it('preserves card identifiers', () => {
    render(
      <EvidenceGrid clips={createClips(13)} page={2} />,
    )

    const cards = screen.getAllByRole('article')

    expect(
      cards.map((card) => card.dataset.clipId),
    ).toEqual([
      'clip-7',
      'clip-8',
      'clip-9',
      'clip-10',
      'clip-11',
      'clip-12',
    ])
  })
})
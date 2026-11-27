import { useState } from 'react'
import EvidenceGrid from './components/EvidenceGrid.jsx'
import PaginationControls from './components/PaginationControls.jsx'
import { demoClips } from './data/demoClips.js'
import { calculatePagination } from './utils/pagination.js'

const PAGE_SIZE = 6

export default function App({
  clips = demoClips,
}) {
  const [page, setPage] = useState(1)

  const sourceClips = Array.isArray(clips) ? clips : []

  const {
    totalPages,
    effectivePage,
    visibleItems,
    startIdx,
  } = calculatePagination(
    sourceClips,
    page,
    PAGE_SIZE,
  )

  const firstVisibleItem =
    visibleItems.length === 0 ? 0 : startIdx + 1

  const lastVisibleItem =
    startIdx + visibleItems.length

  function handlePageChange(nextPage) {
    setPage(nextPage)
  }

  return (
    <main className="app-shell">
      <div className="app-content">
        <header className="app-header">
          <p className="eyebrow">
            Lab 5 / Exercise 0.2
          </p>

          <h1>Evidence Explorer</h1>

          <p className="description">
            Zero-Effect Pagination &amp; Container Queries
          </p>

          <p className="demo-notice">
            Fictional demonstration data
          </p>
        </header>

        <section
          className="evidence-panel"
          aria-labelledby="collection-heading"
        >
          <div className="collection-header">
            <h2 id="collection-heading">
              Evidence Collection
            </h2>

            <span className="collection-count">
              {sourceClips.length} clips
            </span>
          </div>

          <p
            className="collection-summary"
            aria-live="polite"
          >
            Showing {firstVisibleItem}–{lastVisibleItem} of{' '}
            {sourceClips.length} clips
          </p>

          <EvidenceGrid
            clips={sourceClips}
            page={effectivePage}
            pageSize={PAGE_SIZE}
          />

          <PaginationControls
            page={effectivePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>

        <footer className="app-footer">
          Zero-effect pagination demonstration
        </footer>
      </div>
    </main>
  )
}
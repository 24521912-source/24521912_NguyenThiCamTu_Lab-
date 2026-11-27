import EvidenceCard from './EvidenceCard.jsx'
import { calculatePagination } from '../utils/pagination.js'

export default function EvidenceGrid({
  clips,
  page,
  pageSize = 6,
}) {
  const { visibleItems } = calculatePagination(
    clips,
    page,
    pageSize,
  )

  return (
    <section
      className="evidence-grid-container"
      aria-label="Evidence clips"
    >
      {visibleItems.length === 0 ? (
        <p className="empty-state" role="status">
          No evidence clips available.
        </p>
      ) : (
        <div className="evidence-grid">
          {visibleItems.map((clip) => (
            <EvidenceCard
              key={clip._id}
              clip={clip}
            />
          ))}
        </div>
      )}
    </section>
  )
}
export default function EvidenceCard({ clip }) {
  return (
    <article
      className="evidence-card"
      data-clip-id={clip._id}
    >
      <div
        className="evidence-thumbnail"
        aria-hidden="true"
      >
        <span className="thumbnail-icon">▶</span>

        <span className="evidence-duration">
          {clip.duration}
        </span>
      </div>

      <div className="evidence-card-content">
        <span className="evidence-category">
          {clip.category}
        </span>

        <h3 className="evidence-title">
          {clip.title}
        </h3>

        <p className="evidence-description">
          {clip.description}
        </p>

        <p className="evidence-id">
          ID: {clip._id}
        </p>
      </div>
    </article>
  )
}
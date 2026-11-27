export default function EvidenceCard({ clip }) {
  return (
    <article
      className="evidence-card"
      data-clip-id={clip._id}
    >
      <div className="evidence-thumbnail">
        <span
          className="thumbnail-icon"
          aria-hidden="true"
        >
          ▶
        </span>

        <span className="evidence-duration">
          <span className="sr-only">Duration: </span>
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
import { Link } from 'react-router'

export default function HomePage() {
  return (
    <section className="hero">
      <p className="eyebrow">
        PHOTO COLLECTION / 01
      </p>

      <h1>Discover moments through images</h1>

      <p className="page-description">
        Explore a collection of visual scenes featuring
        nature, urban environments and architecture.
      </p>

      <Link to="/gallery" className="primary-link">
        Explore gallery
      </Link>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>Nature</h2>
          <p>
            Mountains, forests and coastal landscapes.
          </p>
        </article>

        <article className="feature-card">
          <h2>Urban</h2>
          <p>
            City skylines and everyday street scenes.
          </p>
        </article>

        <article className="feature-card">
          <h2>Architecture</h2>
          <p>
            Buildings, structures and modern design.
          </p>
        </article>
      </div>
    </section>
  )
}
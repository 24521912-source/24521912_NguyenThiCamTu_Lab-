import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="information-page">
      <p className="eyebrow">ERROR 404</p>

      <h1>Page not found</h1>

      <p className="page-description">
        The requested page does not exist.
      </p>

      <Link to="/" className="primary-link">
        Return home
      </Link>
    </section>
  )
}
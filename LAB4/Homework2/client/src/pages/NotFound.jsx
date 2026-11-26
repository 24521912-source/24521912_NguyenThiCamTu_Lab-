import { Link } from 'react-router-dom'

export default function NotFound({
  title = 'Page not found',
  message = 'The requested page does not exist.',
}) {
  return (
    <section className="panel empty-state">
      <span className="eyebrow">404</span>

      <h1>{title}</h1>

      <p className="muted">{message}</p>

      <Link to="/" className="button">
        Back to overview
      </Link>
    </section>
  )
}
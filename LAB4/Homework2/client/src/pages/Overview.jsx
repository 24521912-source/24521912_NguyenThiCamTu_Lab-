import { Link } from 'react-router-dom'
import { dossiers } from '../data/dossiers'

export default function Overview() {
  return (
    <>
      <section className="overview-hero">
        <p className="eyebrow">
          Fair-Play Review System
        </p>

        <h1>Appeal Tribunal</h1>

        <p>
          Explore demonstration dossiers and review
          illustrative evaluation criteria through a
          structured academic appeal portal.
        </p>
      </section>

      <div className="notice">
        <strong>Academic demonstration</strong>

        <p>
          All case records and scores are fictional.
          They do not represent actual allegations,
          evidence, penalties, or official decisions.
        </p>
      </div>

      <section aria-labelledby="dossiers-heading">
        <div className="section-heading">
          <h2 id="dossiers-heading">
            Available Dossiers
          </h2>

          <span className="muted">
            {dossiers.length} demonstration cases
          </span>
        </div>

        <div className="dossier-grid">
          {dossiers.map((dossier) => (
            <article
              key={dossier.playerID}
              className="panel dossier-card"
            >
              <div className="dossier-card-top">
                <span className="player-avatar">
                  {dossier.playerName.slice(0, 2).toUpperCase()}
                </span>

                <span className="status-badge">
                  Demo
                </span>
              </div>

              <p className="eyebrow">
                {dossier.caseID}
              </p>

              <h3>{dossier.playerName}</h3>

              <p className="muted">
                {dossier.summary}
              </p>

              <Link
                className="button"
                to={`/dossier/${dossier.playerID}`}
              >
                View {dossier.playerName} dossier
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
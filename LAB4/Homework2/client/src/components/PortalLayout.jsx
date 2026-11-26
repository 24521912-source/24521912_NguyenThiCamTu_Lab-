import { NavLink, Outlet } from 'react-router-dom'
import { dossiers } from '../data/dossiers'
import { useRouteFocus } from '../hooks/useRouteFocus'
import './Accessibility.css'

function getNavClass({ isActive }) {
  return isActive
    ? 'nav-link nav-link--active'
    : 'nav-link'
}

export default function PortalLayout() {
  const mainRef = useRouteFocus()

  return (
    <div className="portal">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current?.focus()
        }}
      >
        Skip to main content
      </a>

      <header className="portal-header">
        <div className="brand">
          <span
            className="brand-icon"
            aria-hidden="true"
          >
            FP
          </span>

          <div>
            <p className="brand-title">
              Fair-Play Tribunal
            </p>

            <p className="brand-subtitle">
              Esports Appeal Portal
            </p>
          </div>
        </div>

        <span className="demo-badge">
          Academic Demo
        </span>
      </header>

      <div className="portal-body">
        <aside className="sidebar">
          <nav aria-label="Main navigation">
            <p className="nav-heading">
              Workspace
            </p>

            <NavLink
              to="/"
              end
              className={getNavClass}
            >
              Overview
            </NavLink>

            <p className="nav-heading">
              Case Dossiers
            </p>

            {dossiers.map((dossier) => (
              <NavLink
                key={dossier.playerID}
                to={`/dossier/${dossier.playerID}`}
                className={getNavClass}
              >
                {dossier.playerName}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main
          ref={mainRef}
          id="main-content"
          className="main-content"
          tabIndex={-1}
        >
          <Outlet />

          <footer className="portal-footer">
            Academic demonstration · Lab 4 Homework 2
          </footer>
        </main>
      </div>
    </div>
  )
}
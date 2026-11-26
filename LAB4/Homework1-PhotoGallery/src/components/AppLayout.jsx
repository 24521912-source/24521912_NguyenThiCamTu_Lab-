import { NavLink, Outlet } from 'react-router'
import RouteAccessibility from './RouteAccessibility'
import '../styles/accessibility.css'

export default function AppLayout() {
  function handleSkipNavigation(event) {
    event.preventDefault()

    const mainContent =
      document.getElementById('main-content')

    mainContent?.focus()
  }

  return (
    <div className="app-shell">
      <RouteAccessibility />

      <a
        className="skip-link"
        href="#main-content"
        onClick={handleSkipNavigation}
      >
        Skip to main content
      </a>

      <header className="site-header">
        <div className="container header-content">
          <NavLink
            to="/"
            className="brand"
          >
            FrameGallery
          </NavLink>

          <nav aria-label="Main navigation">
            <ul className="navigation">
              <li>
                <NavLink to="/" end>
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/gallery">
                  Gallery
                </NavLink>
              </li>

              <li>
                <NavLink to="/about">
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className="container main-content"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            FrameGallery — Demonstration photo collection.
          </p>
        </div>
      </footer>
    </div>
  )
}
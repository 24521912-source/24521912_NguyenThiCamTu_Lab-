export default function AboutPage() {
  return (
    <section className="information-page">
      <p className="eyebrow">PROJECT INFORMATION</p>

      <h1>About this project</h1>

      <p className="page-description">
        FrameGallery is a multi-route gallery application
        developed for Lab 4 of the Web Application
        Development course.
      </p>

      <h2>Project purpose</h2>

      <p>
        The project demonstrates client-side routing,
        responsive layouts and reusable React components.
      </p>

      <h2>Demonstration assets</h2>

      <p>
        The gallery contains original demonstration
        illustrations. These assets do not represent
        real-world evidence.
      </p>

      <h2>Technology</h2>

      <ul className="technology-list">
        <li>React 19</li>
        <li>React Router v7</li>
        <li>Vite</li>
        <li>Semantic HTML and CSS</li>
      </ul>
    </section>
  )
}
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page empty-state">
      <h1>Page not found</h1>
      <p className="muted">The listing or page you opened does not exist.</p>
      <Link className="primary-button" to="/">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound

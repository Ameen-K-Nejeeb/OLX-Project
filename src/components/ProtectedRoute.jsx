import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <div className="page-message">Checking your session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

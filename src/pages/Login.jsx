import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthForm from '../components/AuthForm'
import { loginWithEmail } from '../firebase/authService'
import { setCredentials } from '../redux/slices/authSlice'
import { loadCartForUser } from '../redux/slices/cartSlice'
import { loadWishlistForUser } from '../redux/slices/wishlistSlice'
import { getFriendlyFirebaseError } from '../utils/formatters'
import { validateAuth } from '../utils/validation'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'
  const [values, setValues] = useState({ email: '', password: '' })
  const [touchedFields, setTouchedFields] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = useMemo(() => validateAuth(values), [values])
  const visibleErrors = submitted
    ? errors
    : Object.fromEntries(Object.entries(errors).filter(([field]) => touchedFields[field]))

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleBlur(event) {
    setTouchedFields((current) => ({ ...current, [event.target.name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setServerError('')

    if (Object.keys(errors).length > 0) return

    try {
      setLoading(true)
      const credentials = await loginWithEmail(values.email, values.password)
      dispatch(setCredentials(credentials))
      dispatch(loadCartForUser(credentials.user.uid))
      dispatch(loadWishlistForUser(credentials.user.uid))
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setServerError(getFriendlyFirebaseError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to sell products, manage your cart, and keep your session active."
      values={values}
      errors={visibleErrors}
      serverError={serverError}
      loading={loading}
      submitLabel="Login"
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      footer={
        <p className="form-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      }
    />
  )
}

export default Login

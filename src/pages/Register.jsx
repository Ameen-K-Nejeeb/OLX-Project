import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthForm from '../components/AuthForm'
import { registerWithEmail } from '../firebase/authService'
import { setCredentials } from '../redux/slices/authSlice'
import { loadCartForUser } from '../redux/slices/cartSlice'
import { loadWishlistForUser } from '../redux/slices/wishlistSlice'
import { getFriendlyFirebaseError } from '../utils/formatters'
import { validateAuth } from '../utils/validation'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '', confirmPassword: '' })
  const [touchedFields, setTouchedFields] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = useMemo(() => validateAuth(values, 'register'), [values])
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
      const credentials = await registerWithEmail(values.email, values.password)
      dispatch(setCredentials(credentials))
      dispatch(loadCartForUser(credentials.user.uid))
      dispatch(loadWishlistForUser(credentials.user.uid))
      navigate('/sell')
    } catch (error) {
      setServerError(getFriendlyFirebaseError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Create your account"
      subtitle="Register with Firebase Authentication and start posting listings."
      values={values}
      errors={visibleErrors}
      serverError={serverError}
      loading={loading}
      submitLabel="Register"
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      showConfirmPassword
      footer={
        <p className="form-footer">
          Already registered? <Link to="/login">Login instead</Link>
        </p>
      }
    />
  )
}

export default Register

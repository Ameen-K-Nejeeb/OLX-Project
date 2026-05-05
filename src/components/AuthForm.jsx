function AuthForm({
  title,
  subtitle,
  values,
  errors,
  serverError,
  loading,
  submitLabel,
  footer,
  onChange,
  onBlur,
  onSubmit,
  showConfirmPassword = false,
}) {
  return (
    <section className="auth-page">
      <form className="form-panel auth-form" onSubmit={onSubmit} noValidate>
        <div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>

        {serverError && <p className="alert">{serverError}</p>}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="you@example.com"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Minimum 6 characters"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        {showConfirmPassword && (
          <label>
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Repeat password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </label>
        )}

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : submitLabel}
        </button>

        {footer}
      </form>
    </section>
  )
}

export default AuthForm

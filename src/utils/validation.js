const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlPattern = /^https?:\/\/.+\..+/

export function validateAuth(values, mode = 'login') {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  if (mode === 'register' && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function validateProduct(values) {
  const errors = {}

  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.description.trim()) errors.description = 'Description is required.'
  if (!values.location.trim()) errors.location = 'Location is required.'
  if (!values.category) errors.category = 'Category is required.'
  if (!values.price) {
    errors.price = 'Price is required.'
  } else if (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = 'Enter a valid price greater than zero.'
  }
  if (!values.imageUrl.trim()) {
    errors.imageUrl = 'Image URL is required.'
  } else if (!urlPattern.test(values.imageUrl.trim())) {
    errors.imageUrl = 'Enter a valid image URL starting with http:// or https://.'
  }

  return errors
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export function getFriendlyFirebaseError(error) {
  const message = error?.code || error?.message || ''

  if (message.includes('auth/email-already-in-use')) return 'This email is already registered.'
  if (message.includes('auth/invalid-email')) return 'Please enter a valid email address.'
  if (message.includes('auth/invalid-credential')) return 'Incorrect email or password.'
  if (message.includes('auth/weak-password')) return 'Password should be at least 6 characters.'
  if (message.includes('permission-denied')) return 'You do not have permission for this action.'
  if (message.includes('Failed to fetch')) return 'Network error. Please check your connection.'
  if (message.includes('taking too long')) return message

  return error?.message || 'Something went wrong. Please try again.'
}

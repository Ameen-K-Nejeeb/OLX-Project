import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
    },
    clearUser(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
    },
    setAuthLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { clearUser, setAuthLoading, setCredentials } = authSlice.actions
export default authSlice.reducer

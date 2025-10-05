import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  username: string | null
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  username: localStorage.getItem('username'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string
        refreshToken?: string
        username?: string
      }>
    ) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      state.username = action.payload.username || state.username
      state.isAuthenticated = true

      // Persist to localStorage
      localStorage.setItem('access_token', action.payload.accessToken)
      if (action.payload.refreshToken) {
        localStorage.setItem('refresh_token', action.payload.refreshToken)
      }
      if (action.payload.username) {
        localStorage.setItem('username', action.payload.username)
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.username = null

      // Clear localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('username')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshTokenMutation } from '@/store/authApi'
import { setCredentials, logout } from '@/store/authSlice'

export function TokenRefresh() {
  const dispatch = useDispatch()
  const refreshToken = useSelector((state: any) => state.auth.refreshToken)
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const [refreshTokenMutation] = useRefreshTokenMutation()

  useEffect(() => {
    if (!isAuthenticated || !refreshToken) {
      return
    }

    // Refresh token every 4 minutes (1 minute before 5-minute expiry)
    const REFRESH_INTERVAL = 4 * 60 * 1000 // 4 minutes in milliseconds

    const refreshAccessToken = async () => {
      try {
        const response = await refreshTokenMutation({ refresh: refreshToken }).unwrap()

        // Update Redux state with new access token
        dispatch(
          setCredentials({
            accessToken: response.access,
            refreshToken: response.refresh || refreshToken,
          })
        )

        console.log('Token refreshed successfully')
      } catch (error) {
        console.error('Failed to refresh token:', error)
        // If refresh fails, logout user
        dispatch(logout())
      }
    }

    // Initial refresh on mount (if needed)
    // refreshAccessToken()

    // Set up interval for automatic refresh
    const intervalId = setInterval(refreshAccessToken, REFRESH_INTERVAL)

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [isAuthenticated, refreshToken, refreshTokenMutation, dispatch])

  // This component doesn't render anything
  return null
}

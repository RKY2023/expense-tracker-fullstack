import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { logout } from './authSlice'
import CryptoJS from 'crypto-js'
import { env } from '@/config/env'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  msg: string
  username?: string
  token: {
    refresh: string
    access: string
  }
}

interface RegisterRequest {
  email: string
  username: string
  password: string
  password2: string
}

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  mobile: string
  date_of_birth: string | null
  address: string
}

interface RegisterResponse {
  message: string
  user: User
  tokens: {
    refresh: string
    access: string
  }
}

interface RefreshTokenRequest {
  refresh: string
}

interface RefreshTokenResponse {
  access: string
  refresh?: string
}

// Encryption function for payload
const encryptPayload = (username: string, password: string) => {
  const encryptedUsername = CryptoJS.AES.encrypt(username, env.encryptionKey).toString()
  const encryptedPassword = CryptoJS.AES.encrypt(password, env.encryptionKey).toString()

  return {
    username: encryptedUsername,
    password: encryptedPassword,
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: env.apiHost,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions)

  // Check if the error is a 401 (Unauthorized) or token expired error
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any
    if (
      errorData?.code === 'token_not_valid' ||
      errorData?.detail?.includes('expired') ||
      errorData?.detail?.includes('token')
    ) {
      // Dispatch logout action
      api.dispatch(logout())
    }
  }

  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithLogout,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: '/user/login/',
        method: 'POST',
        body: { email, password },
      }),
      transformResponse: (response: LoginResponse) => {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.token.access)
        localStorage.setItem('refresh_token', response.token.refresh)
        return response
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: ({ email, username, password, password2 }) => ({
        url: '/user/register/',
        method: 'POST',
        body: { email, username, password, password2 },
      }),
      transformResponse: (response: RegisterResponse) => {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.tokens.access)
        localStorage.setItem('refresh_token', response.tokens.refresh)
        return response
      },
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: ({ refresh }) => ({
        url: '/user/token/refresh/',
        method: 'POST',
        body: { refresh },
      }),
      transformResponse: (response: RefreshTokenResponse) => {
        // Update access token in localStorage
        localStorage.setItem('access_token', response.access)
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh)
        }
        return response
      },
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = authApi

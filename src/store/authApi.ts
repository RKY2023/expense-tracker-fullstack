import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import CryptoJS from 'crypto-js'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  msg: string
  token: {
    refresh: string
    access: string
  }
}

interface RegisterRequest {
  username: string
  password: string
}

interface RegisterResponse {
  msg: string
  token: {
    refresh: string
    access: string
  }
}

// Encryption function for payload
const encryptPayload = (username: string, password: string) => {
  // Use a consistent encryption key - you may want to store this in env
  const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key'

  const encryptedUsername = CryptoJS.AES.encrypt(username, encryptionKey).toString()
  const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString()

  return {
    username: encryptedUsername,
    password: encryptedPassword,
  }
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_HOST,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ username, password }) => ({
        url: '/user/login/',
        method: 'POST',
        body: { username, password },
      }),
      transformResponse: (response: LoginResponse) => {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.token.access)
        localStorage.setItem('refresh_token', response.token.refresh)
        return response
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: ({ username, password }) => ({
        url: '/user/register/',
        method: 'POST',
        body: { username, password },
      }),
      transformResponse: (response: RegisterResponse) => {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.token.access)
        localStorage.setItem('refresh_token', response.token.refresh)
        return response
      },
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = authApi

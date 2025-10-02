import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Country {
  id: number
  country_name: string
  country_code: string
  country_slug: string
  country_description: string
  continent: string
}

interface State {
  id: number
  state_name: string
  state_code: string
  state_slug: string
  state_description: string
  country_id: number
}

interface Region {
  id: number
  region_name: string
  region_code: string
  region_slug: string
  region_description: string
  state_id: number
}

interface ApiResponse<T> {
  message: string
  data: T[]
}

interface BankStatementUploadRequest {
  file: string
  original_filename: string
}

interface BankStatementUploadResponse {
  message: string
  data: any
}

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_HOST,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as any).auth.accessToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')
      return headers
    },
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<Country>, void>({
      query: () => '/country/?format=json',
    }),
    getStates: builder.query<ApiResponse<State>, number | void>({
      query: (countryId) => countryId ? `/state/?country_id=${countryId}` : '/state/',
    }),
    getRegions: builder.query<ApiResponse<Region>, number | void>({
      query: (stateId) => stateId ? `/region/?state_id=${stateId}` : '/region/',
    }),
    uploadBankStatement: builder.mutation<BankStatementUploadResponse, BankStatementUploadRequest>({
      query: (body) => ({
        url: '/expenses/bank-statements/',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetRegionsQuery,
  useUploadBankStatementMutation
} = locationApi

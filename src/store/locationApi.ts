import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { logout } from './authSlice'

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

interface CategoryResponse {
  id: number
  name: string
  color: string
  created_at: string
}

interface CategoriesApiResponse {
  message: string
  data: CategoryResponse[]
}

interface ExpenseCategory {
  id: number
  name: string
  color: string
}

interface ExpenseResponse {
  id: number
  amount: string
  description: string
  category_id: number
  date: string
  created_at: string
  updated_at: string
  categories: ExpenseCategory
}

interface ExpensesApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: ExpenseResponse[]
}

const baseQuery = fetchBaseQuery({
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

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: baseQueryWithLogout,
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
        url: '/expenses/bank-statements/upload',
        method: 'POST',
        body,
      }),
    }),
    exportExpensesExcel: builder.mutation<Blob, void>({
      query: () => ({
        url: '/expenses/expenses/export_excel/',
        method: 'GET',
        responseHandler: async (response) => response.blob(),
      }),
    }),
    exportExpensesCsv: builder.mutation<Blob, void>({
      query: () => ({
        url: '/expenses/expenses/export_csv/',
        method: 'GET',
        responseHandler: async (response) => response.blob(),
      }),
    }),
    getCategories: builder.query<CategoriesApiResponse, void>({
      query: () => '/expenses/categories/all/',
    }),
    getExpenses: builder.query<ExpensesApiResponse, void>({
      query: () => '/expenses/expenses/',
    }),
  }),
})

export const {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetRegionsQuery,
  useUploadBankStatementMutation,
  useExportExpensesExcelMutation,
  useExportExpensesCsvMutation,
  useGetCategoriesQuery,
  useGetExpensesQuery
} = locationApi

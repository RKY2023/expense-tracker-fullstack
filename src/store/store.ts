import { configureStore } from '@reduxjs/toolkit'
import { locationApi } from './locationApi'
import { authApi } from './authApi'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    [locationApi.reducerPath]: locationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(locationApi.middleware)
      .concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

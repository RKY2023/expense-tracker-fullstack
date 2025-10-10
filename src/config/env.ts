/**
 * Centralized environment configuration
 * All environment variables from import.meta.env are exported here
 */

export const env = {
  // Supabase Configuration
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,

  // API Configuration
  apiHost: import.meta.env.VITE_API_HOST as string,

  // Encryption Configuration
  encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY as string || 'default-secret-key',

  // Development/Production mode
  isDevelopment: import.meta.env.DEV as boolean,
  isProduction: import.meta.env.PROD as boolean,

  // Base URL
  baseUrl: import.meta.env.BASE_URL as string,
} as const

// Type-safe helper to check if all required env vars are present
export function validateEnv() {
  const required = ['apiHost'] as const
  const missing = required.filter(key => !env[key])

  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing)
  }

  return missing.length === 0
}

// Validate on import in development
if (env.isDevelopment) {
  validateEnv()
}

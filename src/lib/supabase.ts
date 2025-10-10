import { createClient } from "@supabase/supabase-js"
import { env } from "@/config/env"

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey)

export type Expense = {
  id: number
  amount: number | string
  description: string
  category_id: number
  date: string
  created_at: string
  updated_at: string
  categories?: {
    id: number
    name: string
    color: string
  }
}

export type Category = {
  id: number
  name: string
  color: string
  created_at: string
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
console.log("Supabase URL:", import.meta, supabaseUrl);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

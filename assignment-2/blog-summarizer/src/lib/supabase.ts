import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogSummary {
  id: string
  url: string
  title: string
  summary: string
  urdu_summary: string
  word_count: number
  summary_method: "static" | "gemini"
  processing_time: number
  created_at: string
}
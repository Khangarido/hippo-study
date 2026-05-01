import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string
          question: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: 'A' | 'B' | 'C' | 'D'
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: 'A' | 'B' | 'C' | 'D'
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          correct_answer?: 'A' | 'B' | 'C' | 'D'
          category?: string
          created_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          score: number
          total: number
          taken_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          total: number
          taken_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          total?: number
          taken_at?: string
        }
      }
      attempt_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_answer: 'A' | 'B' | 'C' | 'D' | null
          is_correct: boolean
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_answer?: 'A' | 'B' | 'C' | 'D' | null
          is_correct: boolean
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_answer?: 'A' | 'B' | 'C' | 'D' | null
          is_correct?: boolean
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role: string
        }
        Insert: {
          user_id: string
          role?: string
        }
        Update: {
          user_id?: string
          role?: string
        }
      }
    }
  }
}

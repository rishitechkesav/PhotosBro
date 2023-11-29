export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      photos: {
        Row: {
          created_at: string | null
          id: number
          name: string
          uid: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          uid: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          uid?: string
        }
      }
      predictions: {
        Row: {
          completed_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id: string
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
      }
      user_info: {
        Row: {
          counter: number
          created_at: string | null
          end_training: string | null
          id: string
          in_training: boolean
          instance_class: string | null
          paid: boolean
          replicate_model_id: string | null
          replicate_train_status: string | null
          replicate_version_id: string | null
          start_training: string | null
          trained: boolean
        }
        Insert: {
          counter?: number
          created_at?: string | null
          end_training?: string | null
          id: string
          in_training?: boolean
          instance_class?: string | null
          paid?: boolean
          replicate_model_id?: string | null
          replicate_train_status?: string | null
          replicate_version_id?: string | null
          start_training?: string | null
          trained?: boolean
        }
        Update: {
          counter?: number
          created_at?: string | null
          end_training?: string | null
          id?: string
          in_training?: boolean
          instance_class?: string | null
          paid?: boolean
          replicate_model_id?: string | null
          replicate_train_status?: string | null
          replicate_version_id?: string | null
          start_training?: string | null
          trained?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

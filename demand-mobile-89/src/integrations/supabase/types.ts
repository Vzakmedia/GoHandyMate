export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_verification_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["account_status_enum"]
          previous_status:
            | Database["public"]["Enums"]["account_status_enum"]
            | null
          reason: string | null
          user_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["account_status_enum"]
          previous_status?:
            | Database["public"]["Enums"]["account_status_enum"]
            | null
          reason?: string | null
          user_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["account_status_enum"]
          previous_status?:
            | Database["public"]["Enums"]["account_status_enum"]
            | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_verification_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_verification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_interactions: {
        Row: {
          advertisement_id: number
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          advertisement_id: number
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: number
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          ad_description: string
          ad_title: string
          auto_renew: boolean | null
          bookings_count: number | null
          clicks_count: number | null
          comments_count: number | null
          content: string
          cost: number
          created_at: string | null
          end_date: string
          id: number
          image_url: string | null
          likes_count: number | null
          plan_type: string
          schedule: string
          shares_count: number | null
          start_date: string | null
          status: string
          target_audience: string | null
          target_zip_codes: string[] | null
          updated_at: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          ad_description?: string
          ad_title?: string
          auto_renew?: boolean | null
          bookings_count?: number | null
          clicks_count?: number | null
          comments_count?: number | null
          content: string
          cost: number
          created_at?: string | null
          end_date?: string
          id?: never
          image_url?: string | null
          likes_count?: number | null
          plan_type?: string
          schedule: string
          shares_count?: number | null
          start_date?: string | null
          status: string
          target_audience?: string | null
          target_zip_codes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          ad_description?: string
          ad_title?: string
          auto_renew?: boolean | null
          bookings_count?: number | null
          clicks_count?: number | null
          comments_count?: number | null
          content?: string
          cost?: number
          created_at?: string | null
          end_date?: string
          id?: never
          image_url?: string | null
          likes_count?: number | null
          plan_type?: string
          schedule?: string
          shares_count?: number | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          target_zip_codes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      api_sync_config: {
        Row: {
          api_endpoint: string
          created_at: string
          id: string
          last_sync_at: string | null
          max_retries: number | null
          sync_enabled: boolean | null
          sync_interval_minutes: number | null
          sync_type: string
          updated_at: string
        }
        Insert: {
          api_endpoint: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          max_retries?: number | null
          sync_enabled?: boolean | null
          sync_interval_minutes?: number | null
          sync_type: string
          updated_at?: string
        }
        Update: {
          api_endpoint?: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          max_retries?: number | null
          sync_enabled?: boolean | null
          sync_interval_minutes?: number | null
          sync_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_sync_logs: {
        Row: {
          created_at: string
          error_message: string | null
          external_api_id: string | null
          id: string
          local_record_id: string | null
          operation: string
          request_payload: Json | null
          response_data: Json | null
          retry_count: number | null
          status: string
          sync_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          external_api_id?: string | null
          id?: string
          local_record_id?: string | null
          operation: string
          request_payload?: Json | null
          response_data?: Json | null
          retry_count?: number | null
          status?: string
          sync_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          external_api_id?: string | null
          id?: string
          local_record_id?: string | null
          operation?: string
          request_payload?: Json | null
          response_data?: Json | null
          retry_count?: number | null
          status?: string
          sync_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          address: string | null
          business_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          insurance_verified: boolean | null
          license_number: string | null
          rating: number | null
          services_offered: string[] | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          years_in_business: number | null
        }
        Insert: {
          address?: string | null
          business_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          insurance_verified?: boolean | null
          license_number?: string | null
          rating?: number | null
          services_offered?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          years_in_business?: number | null
        }
        Update: {
          address?: string | null
          business_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          insurance_verified?: boolean | null
          license_number?: string | null
          rating?: number | null
          services_offered?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          auto_quote_expiry_days: number | null
          business_address: string | null
          business_email: string | null
          business_logo_url: string | null
          business_name: string
          business_phone: string | null
          business_website: string | null
          created_at: string
          default_labor_rate: number | null
          default_markup_percentage: number | null
          id: string
          insurance_number: string | null
          license_number: string | null
          payment_terms: string | null
          quote_footer: string | null
          tax_id: string | null
          terms_conditions: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_quote_expiry_days?: number | null
          business_address?: string | null
          business_email?: string | null
          business_logo_url?: string | null
          business_name?: string
          business_phone?: string | null
          business_website?: string | null
          created_at?: string
          default_labor_rate?: number | null
          default_markup_percentage?: number | null
          id?: string
          insurance_number?: string | null
          license_number?: string | null
          payment_terms?: string | null
          quote_footer?: string | null
          tax_id?: string | null
          terms_conditions?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_quote_expiry_days?: number | null
          business_address?: string | null
          business_email?: string | null
          business_logo_url?: string | null
          business_name?: string
          business_phone?: string | null
          business_website?: string | null
          created_at?: string
          default_labor_rate?: number | null
          default_markup_percentage?: number | null
          id?: string
          insurance_number?: string | null
          license_number?: string | null
          payment_terms?: string | null
          quote_footer?: string | null
          tax_id?: string | null
          terms_conditions?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_agents: {
        Row: {
          created_at: string
          current_chat_count: number
          departments: string[] | null
          id: string
          is_active: boolean
          is_online: boolean
          last_activity: string | null
          max_concurrent_chats: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_chat_count?: number
          departments?: string[] | null
          id?: string
          is_active?: boolean
          is_online?: boolean
          last_activity?: string | null
          max_concurrent_chats?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_chat_count?: number
          departments?: string[] | null
          id?: string
          is_active?: boolean
          is_online?: boolean
          last_activity?: string | null
          max_concurrent_chats?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          sender_id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          sender_id: string
          session_id: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          sender_id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          agent_id: string | null
          closed_at: string | null
          created_at: string
          customer_id: string
          department: string | null
          id: string
          metadata: Json | null
          priority: number | null
          satisfaction_feedback: string | null
          satisfaction_rating: number | null
          status: Database["public"]["Enums"]["chat_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          closed_at?: string | null
          created_at?: string
          customer_id: string
          department?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          satisfaction_feedback?: string | null
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["chat_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          closed_at?: string | null
          created_at?: string
          customer_id?: string
          department?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          satisfaction_feedback?: string | null
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["chat_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country_id: number
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          country_id: number
          created_at?: string
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          country_id?: number
          created_at?: string
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_records: {
        Row: {
          collected_at: string | null
          commission_amount: number
          commission_rate: number
          created_at: string | null
          escrow_payment_id: string | null
          id: string
          job_request_id: string | null
          metadata: Json | null
          provider_id: string | null
        }
        Insert: {
          collected_at?: string | null
          commission_amount: number
          commission_rate: number
          created_at?: string | null
          escrow_payment_id?: string | null
          id?: string
          job_request_id?: string | null
          metadata?: Json | null
          provider_id?: string | null
        }
        Update: {
          collected_at?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          escrow_payment_id?: string | null
          id?: string
          job_request_id?: string | null
          metadata?: Json | null
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_records_escrow_payment_id_fkey"
            columns: ["escrow_payment_id"]
            isOneToOne: false
            referencedRelation: "escrow_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_records_job_request_id_fkey"
            columns: ["job_request_id"]
            isOneToOne: false
            referencedRelation: "job_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          location: string | null
          member_count: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location?: string | null
          member_count?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location?: string | null
          member_count?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_message_likes: {
        Row: {
          created_at: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_message_likes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "community_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      community_messages: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          likes_count: number
          location: string
          message: string
          replies_count: number
          reply_to_id: string | null
          reply_to_message: string | null
          reply_to_user: string | null
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          location: string
          message: string
          replies_count?: number
          reply_to_id?: string | null
          reply_to_message?: string | null
          reply_to_user?: string | null
          updated_at?: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          location?: string
          message?: string
          replies_count?: number
          reply_to_id?: string | null
          reply_to_message?: string | null
          reply_to_user?: string | null
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "community_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_automation_settings: {
        Row: {
          auto_expiration: boolean
          auto_follow_up: boolean
          auto_template_population: boolean
          contractor_id: string
          created_at: string
          expiration_days: number
          follow_up_days: number
          id: string
          reminder_days: number[]
          smart_pricing: boolean
          updated_at: string
        }
        Insert: {
          auto_expiration?: boolean
          auto_follow_up?: boolean
          auto_template_population?: boolean
          contractor_id: string
          created_at?: string
          expiration_days?: number
          follow_up_days?: number
          id?: string
          reminder_days?: number[]
          smart_pricing?: boolean
          updated_at?: string
        }
        Update: {
          auto_expiration?: boolean
          auto_follow_up?: boolean
          auto_template_population?: boolean
          contractor_id?: string
          created_at?: string
          expiration_days?: number
          follow_up_days?: number
          id?: string
          reminder_days?: number[]
          smart_pricing?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      contractor_metrics: {
        Row: {
          average_response_time_hours: number | null
          contractor_id: string
          created_at: string
          customer_satisfaction_rating: number | null
          id: string
          monthly_revenue: number | null
          overdue_invoices: number | null
          paid_invoices: number | null
          quotes_accepted: number | null
          quotes_rejected: number | null
          total_invoices_sent: number | null
          total_quotes_sent: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          average_response_time_hours?: number | null
          contractor_id: string
          created_at?: string
          customer_satisfaction_rating?: number | null
          id?: string
          monthly_revenue?: number | null
          overdue_invoices?: number | null
          paid_invoices?: number | null
          quotes_accepted?: number | null
          quotes_rejected?: number | null
          total_invoices_sent?: number | null
          total_quotes_sent?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          average_response_time_hours?: number | null
          contractor_id?: string
          created_at?: string
          customer_satisfaction_rating?: number | null
          id?: string
          monthly_revenue?: number | null
          overdue_invoices?: number | null
          paid_invoices?: number | null
          quotes_accepted?: number | null
          quotes_rejected?: number | null
          total_invoices_sent?: number | null
          total_quotes_sent?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      contractor_projects: {
        Row: {
          assigned_team: string[] | null
          client: string
          contractor_id: string
          created_at: string
          end_date: string | null
          id: string
          location: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_team?: string[] | null
          client: string
          contractor_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_team?: string[] | null
          client?: string
          contractor_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contractor_quote_requests: {
        Row: {
          accepted_quote_id: string | null
          budget_range: string | null
          contractor_id: string
          created_at: string
          customer_id: string
          id: string
          location: string
          preferred_date: string | null
          quote_type: string | null
          service_description: string
          service_name: string
          status: string | null
          updated_at: string
          urgency: string | null
        }
        Insert: {
          accepted_quote_id?: string | null
          budget_range?: string | null
          contractor_id: string
          created_at?: string
          customer_id: string
          id?: string
          location: string
          preferred_date?: string | null
          quote_type?: string | null
          service_description: string
          service_name: string
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          accepted_quote_id?: string | null
          budget_range?: string | null
          contractor_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          location?: string
          preferred_date?: string | null
          quote_type?: string | null
          service_description?: string
          service_name?: string
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      contractor_quote_submissions: {
        Row: {
          availability_note: string | null
          created_at: string
          customer_id: string
          description: string
          estimated_hours: number | null
          id: string
          materials_cost: number | null
          materials_included: boolean | null
          notes: string | null
          payment_terms: string | null
          quote_number: string | null
          quote_request_id: string
          quoted_price: number
          status: string | null
          terms_conditions: string | null
          travel_fee: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          availability_note?: string | null
          created_at?: string
          customer_id: string
          description: string
          estimated_hours?: number | null
          id?: string
          materials_cost?: number | null
          materials_included?: boolean | null
          notes?: string | null
          payment_terms?: string | null
          quote_number?: string | null
          quote_request_id: string
          quoted_price: number
          status?: string | null
          terms_conditions?: string | null
          travel_fee?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          availability_note?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          estimated_hours?: number | null
          id?: string
          materials_cost?: number | null
          materials_included?: boolean | null
          notes?: string | null
          payment_terms?: string | null
          quote_number?: string | null
          quote_request_id?: string
          quoted_price?: number
          status?: string | null
          terms_conditions?: string | null
          travel_fee?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_quote_submissions_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "contractor_quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cron_job_logs: {
        Row: {
          created_at: string
          details: Json | null
          execution_time: string
          id: string
          job_name: string
          status: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          execution_time?: string
          id?: string
          job_name: string
          status: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          execution_time?: string
          id?: string
          job_name?: string
          status?: string
        }
        Relationships: []
      }
      custom_quote_requests: {
        Row: {
          accepted_quote_id: string | null
          budget_range: string | null
          created_at: string
          customer_id: string
          id: string
          location: string
          preferred_date: string | null
          quote_type: string | null
          service_description: string
          service_name: string
          status: string | null
          updated_at: string
          urgency: string | null
        }
        Insert: {
          accepted_quote_id?: string | null
          budget_range?: string | null
          created_at?: string
          customer_id: string
          id?: string
          location: string
          preferred_date?: string | null
          quote_type?: string | null
          service_description: string
          service_name: string
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          accepted_quote_id?: string | null
          budget_range?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          location?: string
          preferred_date?: string | null
          quote_type?: string | null
          service_description?: string
          service_name?: string
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      emergency_reports: {
        Row: {
          contact_phone: string | null
          created_at: string
          description: string
          emergency_type: string
          follow_up_required: boolean | null
          id: string
          location_details: string | null
          notes: string | null
          property_id: string | null
          reporter_id: string
          resolved_at: string | null
          responder_id: string | null
          response_time_minutes: number | null
          severity: string
          status: string
          title: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          description: string
          emergency_type: string
          follow_up_required?: boolean | null
          id?: string
          location_details?: string | null
          notes?: string | null
          property_id?: string | null
          reporter_id: string
          resolved_at?: string | null
          responder_id?: string | null
          response_time_minutes?: number | null
          severity?: string
          status?: string
          title: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          description?: string
          emergency_type?: string
          follow_up_required?: boolean | null
          id?: string
          location_details?: string | null
          notes?: string | null
          property_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          responder_id?: string | null
          response_time_minutes?: number | null
          severity?: string
          status?: string
          title?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_reports_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_reports_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_payments: {
        Row: {
          amount_provider: number
          amount_total: number
          commission_amount: number
          commission_rate: number | null
          created_at: string | null
          customer_id: string | null
          escrow_released_at: string | null
          id: string
          job_request_id: string | null
          metadata: Json | null
          provider_id: string | null
          status: string | null
          stripe_payment_intent_id: string
          updated_at: string | null
        }
        Insert: {
          amount_provider: number
          amount_total: number
          commission_amount: number
          commission_rate?: number | null
          created_at?: string | null
          customer_id?: string | null
          escrow_released_at?: string | null
          id?: string
          job_request_id?: string | null
          metadata?: Json | null
          provider_id?: string | null
          status?: string | null
          stripe_payment_intent_id: string
          updated_at?: string | null
        }
        Update: {
          amount_provider?: number
          amount_total?: number
          commission_amount?: number
          commission_rate?: number | null
          created_at?: string | null
          customer_id?: string | null
          escrow_released_at?: string | null
          id?: string
          job_request_id?: string | null
          metadata?: Json | null
          provider_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_payments_job_request_id_fkey"
            columns: ["job_request_id"]
            isOneToOne: false
            referencedRelation: "job_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      external_integrations: {
        Row: {
          created_at: string
          external_user_id: string
          id: string
          integration_data: Json
          last_sync_at: string | null
          provider: string
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          external_user_id: string
          id?: string
          integration_data?: Json
          last_sync_at?: string | null
          provider: string
          sync_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          external_user_id?: string
          id?: string
          integration_data?: Json
          last_sync_at?: string | null
          provider?: string
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      handyman: {
        Row: {
          availability: string | null
          created_at: string
          email: string | null
          full_name: string | null
          hourly_rate: number | null
          id: number
          phone: string | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: number
          phone?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: number
          phone?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      handyman_availability_slots: {
        Row: {
          booking_id: string | null
          created_at: string | null
          date: string
          end_time: string
          id: string
          is_booked: boolean | null
          notes: string | null
          price_multiplier: number | null
          slot_type: string
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          is_booked?: boolean | null
          notes?: string | null
          price_multiplier?: number | null
          slot_type: string
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          is_booked?: boolean | null
          notes?: string | null
          price_multiplier?: number | null
          slot_type?: string
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      handyman_locations: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          is_active: boolean
          is_real_time: boolean | null
          last_updated: string
          latitude: number
          longitude: number
          session_started: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_real_time?: boolean | null
          last_updated?: string
          latitude: number
          longitude: number
          session_started?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_real_time?: boolean | null
          last_updated?: string
          latitude?: number
          longitude?: number
          session_started?: string | null
          user_id?: string
        }
        Relationships: []
      }
      handyman_schedule: {
        Row: {
          created_at: string
          day_of_week: string
          end_time: string
          id: string
          is_available: boolean
          notes: string | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          end_time: string
          id?: string
          is_available?: boolean
          notes?: string | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          end_time?: string
          id?: string
          is_available?: boolean
          notes?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      handyman_service_pricing: {
        Row: {
          base_price: number
          category_id: string
          created_at: string
          custom_price: number | null
          emergency_multiplier: number
          id: string
          is_active: boolean
          same_day_multiplier: number
          subcategory_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          base_price?: number
          category_id: string
          created_at?: string
          custom_price?: number | null
          emergency_multiplier?: number
          id?: string
          is_active?: boolean
          same_day_multiplier?: number
          subcategory_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          base_price?: number
          category_id?: string
          created_at?: string
          custom_price?: number | null
          emergency_multiplier?: number
          id?: string
          is_active?: boolean
          same_day_multiplier?: number
          subcategory_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      handyman_skill_rates: {
        Row: {
          created_at: string | null
          emergency_rate_multiplier: number | null
          experience_level: string | null
          hourly_rate: number
          id: string
          is_active: boolean | null
          minimum_hours: number | null
          same_day_rate_multiplier: number | null
          skill_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emergency_rate_multiplier?: number | null
          experience_level?: string | null
          hourly_rate: number
          id?: string
          is_active?: boolean | null
          minimum_hours?: number | null
          same_day_rate_multiplier?: number | null
          skill_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emergency_rate_multiplier?: number | null
          experience_level?: string | null
          hourly_rate?: number
          id?: string
          is_active?: boolean | null
          minimum_hours?: number | null
          same_day_rate_multiplier?: number | null
          skill_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      handyman_work_areas: {
        Row: {
          additional_travel_fee: number | null
          area_name: string
          center_latitude: number
          center_longitude: number
          created_at: string | null
          formatted_address: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          priority_order: number | null
          radius_miles: number
          travel_time_minutes: number | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          additional_travel_fee?: number | null
          area_name: string
          center_latitude: number
          center_longitude: number
          created_at?: string | null
          formatted_address?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          priority_order?: number | null
          radius_miles: number
          travel_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          additional_travel_fee?: number | null
          area_name?: string
          center_latitude?: number
          center_longitude?: number
          created_at?: string | null
          formatted_address?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          priority_order?: number | null
          radius_miles?: number
          travel_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      handyman_work_settings: {
        Row: {
          advance_booking_days: number | null
          blackout_dates: string[] | null
          center_latitude: number | null
          center_longitude: number | null
          created_at: string | null
          emergency_available: boolean | null
          id: string
          instant_booking: boolean | null
          minimum_job_amount: number | null
          preferred_job_types: string[] | null
          same_day_available: boolean | null
          travel_fee_enabled: boolean | null
          travel_fee_per_mile: number | null
          updated_at: string | null
          user_id: string
          work_radius_miles: number | null
        }
        Insert: {
          advance_booking_days?: number | null
          blackout_dates?: string[] | null
          center_latitude?: number | null
          center_longitude?: number | null
          created_at?: string | null
          emergency_available?: boolean | null
          id?: string
          instant_booking?: boolean | null
          minimum_job_amount?: number | null
          preferred_job_types?: string[] | null
          same_day_available?: boolean | null
          travel_fee_enabled?: boolean | null
          travel_fee_per_mile?: number | null
          updated_at?: string | null
          user_id: string
          work_radius_miles?: number | null
        }
        Update: {
          advance_booking_days?: number | null
          blackout_dates?: string[] | null
          center_latitude?: number | null
          center_longitude?: number | null
          created_at?: string | null
          emergency_available?: boolean | null
          id?: string
          instant_booking?: boolean | null
          minimum_job_amount?: number | null
          preferred_job_types?: string[] | null
          same_day_available?: boolean | null
          travel_fee_enabled?: boolean | null
          travel_fee_per_mile?: number | null
          updated_at?: string | null
          user_id?: string
          work_radius_miles?: number | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          contractor_id: string
          created_at: string
          customer_id: string
          description: string
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          paid_at: string | null
          quote_request_id: string | null
          quote_submission_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          contractor_id: string
          created_at?: string
          customer_id: string
          description: string
          due_date?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          paid_at?: string | null
          quote_request_id?: string | null
          quote_submission_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          contractor_id?: string
          created_at?: string
          customer_id?: string
          description?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          paid_at?: string | null
          quote_request_id?: string | null
          quote_submission_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "contractor_quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_submission_id_fkey"
            columns: ["quote_submission_id"]
            isOneToOne: false
            referencedRelation: "contractor_quote_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_messages: {
        Row: {
          attachment_url: string | null
          created_at: string
          id: string
          is_read: boolean
          job_id: string
          message_text: string
          message_type: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          job_id: string
          message_text: string
          message_type?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          job_id?: string
          message_text?: string
          message_type?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      job_ratings: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          job_id: string
          provider_id: string
          rating: number
          review_text: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          job_id: string
          provider_id: string
          rating: number
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          job_id?: string
          provider_id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_requests: {
        Row: {
          assigned_to_user_id: string | null
          budget: number | null
          category: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          images: string[] | null
          job_type: string | null
          location: string | null
          manager_id: string | null
          preferred_schedule: string | null
          priority: string | null
          status: string | null
          title: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          budget?: number | null
          category?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          job_type?: string | null
          location?: string | null
          manager_id?: string | null
          preferred_schedule?: string | null
          priority?: string | null
          status?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          budget?: number | null
          category?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          job_type?: string | null
          location?: string | null
          manager_id?: string | null
          preferred_schedule?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          contractor_id: string | null
          estimated_time_hours: number | null
          id: number
          is_after_hours: boolean | null
          job_description: string | null
          material_costs: number | null
          rate_type: string | null
          rate_value: number | null
          service_category: string | null
          zip_code: string | null
        }
        Insert: {
          contractor_id?: string | null
          estimated_time_hours?: number | null
          id?: never
          is_after_hours?: boolean | null
          job_description?: string | null
          material_costs?: number | null
          rate_type?: string | null
          rate_value?: number | null
          service_category?: string | null
          zip_code?: string | null
        }
        Update: {
          contractor_id?: string | null
          estimated_time_hours?: number | null
          id?: never
          is_after_hours?: boolean | null
          job_description?: string | null
          material_costs?: number | null
          rate_type?: string | null
          rate_value?: number | null
          service_category?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      location_settings: {
        Row: {
          accuracy_threshold: number
          created_at: string
          id: string
          sharing_enabled: boolean
          tracking_enabled: boolean
          update_interval: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_threshold?: number
          created_at?: string
          id?: string
          sharing_enabled?: boolean
          tracking_enabled?: boolean
          update_interval?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_threshold?: number
          created_at?: string
          id?: string
          sharing_enabled?: boolean
          tracking_enabled?: boolean
          update_interval?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          assigned_to_user_id: string | null
          completed_at: string | null
          created_at: string
          description: string
          estimated_cost: number | null
          frequency: string | null
          id: string
          manager_id: string
          next_scheduled: string | null
          notes: string | null
          priority: string
          property_id: string | null
          scheduled_date: string | null
          status: string
          title: string
          type: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          assigned_to_user_id?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          estimated_cost?: number | null
          frequency?: string | null
          id?: string
          manager_id: string
          next_scheduled?: string | null
          notes?: string | null
          priority?: string
          property_id?: string | null
          scheduled_date?: string | null
          status?: string
          title: string
          type?: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          assigned_to_user_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          estimated_cost?: number | null
          frequency?: string | null
          id?: string
          manager_id?: string
          next_scheduled?: string | null
          notes?: string | null
          priority?: string
          property_id?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string
          type?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          audio_enabled: boolean
          created_at: string
          emergency_notifications: boolean
          id: string
          job_notifications: boolean
          maintenance_notifications: boolean
          message_notifications: boolean
          payment_notifications: boolean
          quote_notifications: boolean
          system_notifications: boolean
          updated_at: string
          user_id: string
          volume: number
        }
        Insert: {
          audio_enabled?: boolean
          created_at?: string
          emergency_notifications?: boolean
          id?: string
          job_notifications?: boolean
          maintenance_notifications?: boolean
          message_notifications?: boolean
          payment_notifications?: boolean
          quote_notifications?: boolean
          system_notifications?: boolean
          updated_at?: string
          user_id: string
          volume?: number
        }
        Update: {
          audio_enabled?: boolean
          created_at?: string
          emergency_notifications?: boolean
          id?: string
          job_notifications?: boolean
          maintenance_notifications?: boolean
          message_notifications?: boolean
          payment_notifications?: boolean
          quote_notifications?: boolean
          system_notifications?: boolean
          updated_at?: string
          user_id?: string
          volume?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          job_id: string | null
          message: string | null
          recipient_role: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          job_id?: string | null
          message?: string | null
          recipient_role?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          job_id?: string | null
          message?: string | null
          recipient_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      post_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          message_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          message_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          message_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_interactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "community_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status:
            | Database["public"]["Enums"]["account_status_enum"]
            | null
          address: string | null
          avatar_url: string | null
          average_rating: number | null
          city: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_trial_used: boolean | null
          jobs_this_month: number | null
          phone: string | null
          rejection_reason: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          total_ratings: number | null
          trial_end_date: string | null
          trial_plan: string | null
          trial_start_date: string | null
          updated_at: string
          user_role: string
          verified_at: string | null
          verified_by_admin_id: string | null
          zip_code: string | null
        }
        Insert: {
          account_status?:
            | Database["public"]["Enums"]["account_status_enum"]
            | null
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_trial_used?: boolean | null
          jobs_this_month?: number | null
          phone?: string | null
          rejection_reason?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          total_ratings?: number | null
          trial_end_date?: string | null
          trial_plan?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_role: string
          verified_at?: string | null
          verified_by_admin_id?: string | null
          zip_code?: string | null
        }
        Update: {
          account_status?:
            | Database["public"]["Enums"]["account_status_enum"]
            | null
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_trial_used?: boolean | null
          jobs_this_month?: number | null
          phone?: string | null
          rejection_reason?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          total_ratings?: number | null
          trial_end_date?: string | null
          trial_plan?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_role?: string
          verified_at?: string | null
          verified_by_admin_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      project_photos: {
        Row: {
          contractor_id: string
          created_at: string
          description: string | null
          file_size: number | null
          id: string
          location: string | null
          mime_type: string | null
          photo_type: string
          photo_url: string
          project_id: string | null
          taken_date: string
          title: string
          updated_at: string
        }
        Insert: {
          contractor_id: string
          created_at?: string
          description?: string | null
          file_size?: number | null
          id?: string
          location?: string | null
          mime_type?: string | null
          photo_type: string
          photo_url: string
          project_id?: string | null
          taken_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          contractor_id?: string
          created_at?: string
          description?: string | null
          file_size?: number | null
          id?: string
          location?: string | null
          mime_type?: string | null
          photo_type?: string
          photo_url?: string
          project_id?: string | null
          taken_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string | null
          created_at: string
          created_by: string
          description: string
          end_date: string
          id: string
          is_active: boolean
          maximum_discount_amount: number | null
          minimum_order_amount: number | null
          promotion_type: string
          start_date: string
          target_audience: string
          title: string
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
          value_amount: number | null
          value_type: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          created_by: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          promotion_type: string
          start_date: string
          target_audience: string
          title: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value_amount?: number | null
          value_type: string
        }
        Update: {
          code?: string | null
          created_at?: string
          created_by?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          promotion_type?: string
          start_date?: string
          target_audience?: string
          title?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value_amount?: number | null
          value_type?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          city: string | null
          created_at: string
          id: string
          manager_id: string
          property_address: string
          property_name: string
          property_type: string
          state: string | null
          status: string
          total_units: number
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          created_at?: string
          id?: string
          manager_id: string
          property_address: string
          property_name: string
          property_type?: string
          state?: string | null
          status?: string
          total_units?: number
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          created_at?: string
          id?: string
          manager_id?: string
          property_address?: string
          property_name?: string
          property_type?: string
          state?: string | null
          status?: string
          total_units?: number
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      provider_payouts: {
        Row: {
          amount: number
          arrival_date: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          provider_id: string | null
          status: string
          stripe_account_id: string
          stripe_payout_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          arrival_date?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          provider_id?: string | null
          status: string
          stripe_account_id: string
          stripe_payout_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          arrival_date?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          provider_id?: string | null
          status?: string
          stripe_account_id?: string
          stripe_payout_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          item_type: string
          notes: string | null
          quantity: number
          quote_submission_id: string
          total_price: number | null
          unit_measure: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          item_type: string
          notes?: string | null
          quantity?: number
          quote_submission_id: string
          total_price?: number | null
          unit_measure?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          item_type?: string
          notes?: string | null
          quantity?: number
          quote_submission_id?: string
          total_price?: number | null
          unit_measure?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_quote_submission_id_fkey"
            columns: ["quote_submission_id"]
            isOneToOne: false
            referencedRelation: "contractor_quote_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          quote_request_id: string | null
          quote_submission_id: string | null
          recipient_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          quote_request_id?: string | null
          quote_submission_id?: string | null
          recipient_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          quote_request_id?: string | null
          quote_submission_id?: string | null
          recipient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_notifications_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "custom_quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_notifications_quote_submission_id_fkey"
            columns: ["quote_submission_id"]
            isOneToOne: false
            referencedRelation: "quote_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_reminders: {
        Row: {
          client_email: string | null
          contractor_id: string
          created_at: string
          id: string
          message: string
          quote_id: string
          reminder_type: string
          scheduled_date: string
          status: string
          updated_at: string
        }
        Insert: {
          client_email?: string | null
          contractor_id: string
          created_at?: string
          id?: string
          message: string
          quote_id: string
          reminder_type: string
          scheduled_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_email?: string | null
          contractor_id?: string
          created_at?: string
          id?: string
          message?: string
          quote_id?: string
          reminder_type?: string
          scheduled_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          business_id: string | null
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          estimated_budget: string | null
          id: string
          location: string
          preferred_date: string | null
          project_description: string
          service_required: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          estimated_budget?: string | null
          id?: string
          location: string
          preferred_date?: string | null
          project_description: string
          service_required: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          estimated_budget?: string | null
          id?: string
          location?: string
          preferred_date?: string | null
          project_description?: string
          service_required?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_submissions: {
        Row: {
          availability_note: string | null
          created_at: string
          description: string
          estimated_hours: number | null
          handyman_id: string
          id: string
          materials_cost: number | null
          materials_included: boolean | null
          quote_request_id: string
          quoted_price: number
          status: string | null
          travel_fee: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          availability_note?: string | null
          created_at?: string
          description: string
          estimated_hours?: number | null
          handyman_id: string
          id?: string
          materials_cost?: number | null
          materials_included?: boolean | null
          quote_request_id: string
          quoted_price: number
          status?: string | null
          travel_fee?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          availability_note?: string | null
          created_at?: string
          description?: string
          estimated_hours?: number | null
          handyman_id?: string
          id?: string
          materials_cost?: number | null
          materials_included?: boolean | null
          quote_request_id?: string
          quoted_price?: number
          status?: string | null
          travel_fee?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_submissions_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "custom_quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_templates: {
        Row: {
          contractor_id: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          labor_rate: number | null
          markup_percentage: number | null
          project_size: string
          service_type: string
          template_name: string
          terms: string | null
          title: string
          updated_at: string
          warranty_terms: string | null
        }
        Insert: {
          contractor_id: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          labor_rate?: number | null
          markup_percentage?: number | null
          project_size: string
          service_type: string
          template_name: string
          terms?: string | null
          title: string
          updated_at?: string
          warranty_terms?: string | null
        }
        Update: {
          contractor_id?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          labor_rate?: number | null
          markup_percentage?: number | null
          project_size?: string
          service_type?: string
          template_name?: string
          terms?: string | null
          title?: string
          updated_at?: string
          warranty_terms?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          badge_icon: string | null
          cash_value: number | null
          created_at: string
          created_by: string
          description: string
          expiry_days: number | null
          id: string
          is_active: boolean
          points_required: number | null
          requirements: Json
          reward_type: string
          title: string
          updated_at: string
        }
        Insert: {
          badge_icon?: string | null
          cash_value?: number | null
          created_at?: string
          created_by: string
          description: string
          expiry_days?: number | null
          id?: string
          is_active?: boolean
          points_required?: number | null
          requirements?: Json
          reward_type: string
          title: string
          updated_at?: string
        }
        Update: {
          badge_icon?: string | null
          cash_value?: number | null
          created_at?: string
          created_by?: string
          description?: string
          expiry_days?: number | null
          id?: string
          is_active?: boolean
          points_required?: number | null
          requirements?: Json
          reward_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      safety_checklists: {
        Row: {
          category: string
          completed_at: string | null
          contractor_id: string
          created_at: string
          id: string
          items: Json
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          contractor_id: string
          created_at?: string
          id?: string
          items?: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          contractor_id?: string
          created_at?: string
          id?: string
          items?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      safety_incidents: {
        Row: {
          contractor_id: string
          created_at: string
          description: string
          id: string
          incident_date: string
          location: string
          reported_by: string | null
          status: string | null
          type: string
          updated_at: string
        }
        Insert: {
          contractor_id: string
          created_at?: string
          description: string
          id?: string
          incident_date: string
          location: string
          reported_by?: string | null
          status?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          contractor_id?: string
          created_at?: string
          description?: string
          id?: string
          incident_date?: string
          location?: string
          reported_by?: string | null
          status?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          access_level: number
          created_at: string
          department: string
          hired_date: string
          id: string
          is_active: boolean
          manager_id: string | null
          notes: string | null
          permissions: Database["public"]["Enums"]["permission_type"][]
          staff_role: Database["public"]["Enums"]["staff_role_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level?: number
          created_at?: string
          department?: string
          hired_date?: string
          id?: string
          is_active?: boolean
          manager_id?: string | null
          notes?: string | null
          permissions?: Database["public"]["Enums"]["permission_type"][]
          staff_role?: Database["public"]["Enums"]["staff_role_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level?: number
          created_at?: string
          department?: string
          hired_date?: string
          id?: string
          is_active?: boolean
          manager_id?: string | null
          notes?: string | null
          permissions?: Database["public"]["Enums"]["permission_type"][]
          staff_role?: Database["public"]["Enums"]["staff_role_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connect_accounts: {
        Row: {
          account_type: string
          charges_enabled: boolean | null
          created_at: string | null
          details_submitted: boolean | null
          id: string
          onboarding_completed: boolean | null
          payouts_enabled: boolean | null
          requirements: Json | null
          stripe_account_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_type?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          details_submitted?: boolean | null
          id?: string
          onboarding_completed?: boolean | null
          payouts_enabled?: boolean | null
          requirements?: Json | null
          stripe_account_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_type?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          details_submitted?: boolean | null
          id?: string
          onboarding_completed?: boolean | null
          payouts_enabled?: boolean | null
          requirements?: Json | null
          stripe_account_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_logs: {
        Row: {
          amount: number
          created_at: string
          id: string
          plan_name: string
          status: string
          stripe_invoice_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          plan_name: string
          status: string
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          plan_name?: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          config_key: string
          config_value: Json
          description: string | null
          id: string
          is_public: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          description?: string | null
          id?: string
          is_public?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          description?: string | null
          id?: string
          is_public?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          availability: string | null
          contractor_id: string
          created_at: string
          email: string | null
          hourly_rate: number | null
          id: string
          join_date: string | null
          name: string
          phone: string | null
          role: string
          skills: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          availability?: string | null
          contractor_id: string
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          join_date?: string | null
          name: string
          phone?: string | null
          role: string
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          availability?: string | null
          contractor_id?: string
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          join_date?: string | null
          name?: string
          phone?: string | null
          role?: string
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      training_resources: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: number
          level: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: number
          level: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: number
          level?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      units: {
        Row: {
          created_at: string | null
          id: string
          lease_end: string | null
          lease_start: string | null
          manager_id: string
          notes: string | null
          property_address: string
          property_id: string
          rent_amount: number | null
          status: string | null
          tags: string[] | null
          tenant_email: string | null
          tenant_name: string | null
          tenant_phone: string | null
          unit_name: string | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          manager_id: string
          notes?: string | null
          property_address: string
          property_id: string
          rent_amount?: number | null
          status?: string | null
          tags?: string[] | null
          tenant_email?: string | null
          tenant_name?: string | null
          tenant_phone?: string | null
          unit_name?: string | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          manager_id?: string
          notes?: string | null
          property_address?: string
          property_id?: string
          rent_amount?: number | null
          status?: string | null
          tags?: string[] | null
          tenant_email?: string | null
          tenant_name?: string | null
          tenant_phone?: string | null
          unit_name?: string | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          id: string
          requested_by: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          id?: string
          requested_by: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          id?: string
          requested_by?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          available_points: number
          id: string
          lifetime_points: number
          tier_level: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_points?: number
          id?: string
          lifetime_points?: number
          tier_level?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_points?: number
          id?: string
          lifetime_points?: number
          tier_level?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          review_text: string | null
          reviewed_user_id: string
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          review_text?: string | null
          reviewed_user_id: string
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          reviewed_user_id?: string
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          earned_at: string
          expires_at: string | null
          id: string
          is_redeemed: boolean
          redeemed_at: string | null
          redemption_code: string | null
          reward_id: string
          user_id: string
        }
        Insert: {
          earned_at?: string
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redemption_code?: string | null
          reward_id: string
          user_id: string
        }
        Update: {
          earned_at?: string
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redemption_code?: string | null
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user: {
        Args: { user_id_to_delete: string }
        Returns: boolean
      }
      admin_verify_account: {
        Args:
          | Record<PropertyKey, never>
          | {
              user_id_to_verify: string
              new_status: Database["public"]["Enums"]["account_status_enum"]
              reason?: string
            }
        Returns: boolean
      }
      can_accept_job: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      decrement_ad_likes: {
        Args: { ad_id: number }
        Returns: undefined
      }
      decrement_message_likes: {
        Args: { message_id: string }
        Returns: undefined
      }
      find_nearby_handymen: {
        Args:
          | { user_lat: number; user_lng: number; search_radius?: number }
          | { user_lat: number; user_lng: number; search_radius?: number }
        Returns: {
          id: string
          full_name: string
          email: string
          subscription_plan: string
          distance: number
          coordinates: Json
          last_seen: string
          is_online: boolean
        }[]
      }
      get_business_contact_info: {
        Args: { business_profile_id: string }
        Returns: {
          contact_email: string
          contact_phone: string
        }[]
      }
      get_community_messages_safe: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          message: string
          location: string
          image_url: string
          likes_count: number
          replies_count: number
          reply_to_id: string
          reply_to_message: string
          reply_to_user: string
          user_name: string
          user_id_display: string
          is_own_message: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_pending_verification_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          pending_handymen: number
          pending_contractors: number
          total_pending: number
        }[]
      }
      get_provider_rating_summary: {
        Args: { provider_user_id: string }
        Returns: {
          provider_id: string
          average_rating: number
          total_ratings: number
          rating_distribution: Json
        }[]
      }
      get_provider_ratings_detailed: {
        Args: { provider_user_id: string }
        Returns: {
          id: string
          rating: number
          review_text: string
          created_at: string
          customer_initial: string
        }[]
      }
      get_public_business_directory: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          business_name: string
          description: string
          services_offered: string[]
          address: string
          website: string
          years_in_business: number
          license_number: string
          insurance_verified: boolean
          rating: number
          created_at: string
          updated_at: string
        }[]
      }
      get_public_handyman_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          user_id: string
          full_name: string
          hourly_rate: number
          availability: string
          skills: string[]
          status: string
          created_at: string
          updated_at: string
        }[]
      }
      get_public_ratings_summary: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          rating: number
          review_text: string
          created_at: string
          customer_initial: string
          provider_name: string
        }[]
      }
      increment_ad_bookings: {
        Args: { ad_id: number }
        Returns: undefined
      }
      increment_ad_comments: {
        Args: { ad_id: number }
        Returns: undefined
      }
      increment_ad_likes: {
        Args: { ad_id: number }
        Returns: undefined
      }
      increment_ad_shares: {
        Args: { ad_id: number }
        Returns: undefined
      }
      increment_message_likes: {
        Args: { message_id: string }
        Returns: undefined
      }
      increment_message_replies: {
        Args: { message_id: string }
        Returns: undefined
      }
      reset_monthly_job_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_user_account: {
        Args:
          | Record<PropertyKey, never>
          | {
              user_id_to_verify: string
              admin_id: string
              new_status: Database["public"]["Enums"]["account_status_enum"]
              reason?: string
            }
        Returns: boolean
      }
    }
    Enums: {
      account_status_enum: "pending" | "active" | "rejected" | "suspended"
      chat_role: "customer" | "agent" | "admin"
      chat_status: "waiting" | "active" | "closed" | "transferred"
      message_type: "text" | "image" | "file" | "system"
      permission_type:
        | "user_management"
        | "content_moderation"
        | "financial_access"
        | "system_settings"
        | "analytics_view"
        | "promotion_management"
        | "reward_management"
        | "staff_management"
        | "verification_access"
        | "support_access"
      staff_role_type:
        | "super_admin"
        | "admin"
        | "manager"
        | "supervisor"
        | "support_agent"
        | "moderator"
        | "analyst"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status_enum: ["pending", "active", "rejected", "suspended"],
      chat_role: ["customer", "agent", "admin"],
      chat_status: ["waiting", "active", "closed", "transferred"],
      message_type: ["text", "image", "file", "system"],
      permission_type: [
        "user_management",
        "content_moderation",
        "financial_access",
        "system_settings",
        "analytics_view",
        "promotion_management",
        "reward_management",
        "staff_management",
        "verification_access",
        "support_access",
      ],
      staff_role_type: [
        "super_admin",
        "admin",
        "manager",
        "supervisor",
        "support_agent",
        "moderator",
        "analyst",
      ],
    },
  },
} as const

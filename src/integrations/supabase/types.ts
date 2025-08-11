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
      addresses: {
        Row: {
          address_type: string
          city: string
          created_at: string
          id: string
          postal_code: string
          province: string
          street_address: string
          suburb: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_type: string
          city: string
          created_at?: string
          id?: string
          postal_code: string
          province: string
          street_address: string
          suburb: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_type?: string
          city?: string
          created_at?: string
          id?: string
          postal_code?: string
          province?: string
          street_address?: string
          suburb?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_stats: {
        Row: {
          active_consultations: number | null
          created_at: string | null
          date: string
          document_errors: number | null
          paid_users: number | null
          signups: number | null
          transactions_count: number | null
        }
        Insert: {
          active_consultations?: number | null
          created_at?: string | null
          date: string
          document_errors?: number | null
          paid_users?: number | null
          signups?: number | null
          transactions_count?: number | null
        }
        Update: {
          active_consultations?: number | null
          created_at?: string | null
          date?: string
          document_errors?: number | null
          paid_users?: number | null
          signups?: number | null
          transactions_count?: number | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          event_name: string
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          properties: Json | null
          referrer: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_name: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      application_analytics: {
        Row: {
          applications_by_program: Json | null
          applications_by_status: Json | null
          average_completion_time: number | null
          conversion_funnel: Json | null
          created_at: string | null
          id: string
          top_programs: Json | null
          total_applications: number | null
          updated_at: string | null
        }
        Insert: {
          applications_by_program?: Json | null
          applications_by_status?: Json | null
          average_completion_time?: number | null
          conversion_funnel?: Json | null
          created_at?: string | null
          id?: string
          top_programs?: Json | null
          total_applications?: number | null
          updated_at?: string | null
        }
        Update: {
          applications_by_program?: Json | null
          applications_by_status?: Json | null
          average_completion_time?: number | null
          conversion_funnel?: Json | null
          created_at?: string | null
          id?: string
          top_programs?: Json | null
          total_applications?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      application_fee_sponsorships: {
        Row: {
          created_at: string
          id: string
          paid_at: string | null
          payment_reference: string | null
          payment_status: string
          sponsor_application_id: string
          sponsor_id: string
          sponsored_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_reference?: string | null
          payment_status?: string
          sponsor_application_id: string
          sponsor_id: string
          sponsored_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_reference?: string | null
          payment_status?: string
          sponsor_application_id?: string
          sponsor_id?: string
          sponsored_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_fee_sponsorships_sponsor_application_id_fkey"
            columns: ["sponsor_application_id"]
            isOneToOne: false
            referencedRelation: "sponsor_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_fee_sponsorships_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string | null
          grade12_results: string | null
          id: string
          institution_id: string | null
          program: string | null
          program_id: string | null
          sponsor_id: string | null
          status: string | null
          university: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          grade12_results?: string | null
          id?: string
          institution_id?: string | null
          program?: string | null
          program_id?: string | null
          sponsor_id?: string | null
          status?: string | null
          university?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          grade12_results?: string | null
          id?: string
          institution_id?: string | null
          program?: string | null
          program_id?: string | null
          sponsor_id?: string | null
          status?: string | null
          university?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      career_assessments: {
        Row: {
          assessment_type: string
          completed_at: string | null
          created_at: string
          id: string
          questions: Json
          responses: Json
          results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string | null
          created_at?: string
          id?: string
          questions?: Json
          responses?: Json
          results?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          questions?: Json
          responses?: Json
          results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_guidance: {
        Row: {
          action_plan: Json | null
          assessment_date: string
          assessment_id: string | null
          assessment_type: string
          created_at: string
          id: string
          is_premium: boolean
          recommendations: Json | null
          results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          action_plan?: Json | null
          assessment_date: string
          assessment_id?: string | null
          assessment_type: string
          created_at?: string
          id?: string
          is_premium?: boolean
          recommendations?: Json | null
          results?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          action_plan?: Json | null
          assessment_date?: string
          assessment_id?: string | null
          assessment_type?: string
          created_at?: string
          id?: string
          is_premium?: boolean
          recommendations?: Json | null
          results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_guidance_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "career_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          active: boolean | null
          assigned_region: string | null
          created_at: string | null
          full_name: string | null
          id: string
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          assigned_region?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          assigned_region?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          consultant_notes: string | null
          created_at: string | null
          id: string
          requested_date: string
          status: string | null
          topic: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          consultant_notes?: string | null
          created_at?: string | null
          id?: string
          requested_date: string
          status?: string | null
          topic: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          consultant_notes?: string | null
          created_at?: string | null
          id?: string
          requested_date?: string
          status?: string | null
          topic?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_verification_logs: {
        Row: {
          completed_at: string | null
          confidence_score: number | null
          created_at: string
          document_id: string
          document_type: string
          failure_reason: string | null
          id: string
          status: string
          user_id: string
          verification_details: Json | null
          verification_method: string | null
        }
        Insert: {
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          document_id: string
          document_type: string
          failure_reason?: string | null
          id?: string
          status?: string
          user_id: string
          verification_details?: Json | null
          verification_method?: string | null
        }
        Update: {
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          document_id?: string
          document_type?: string
          failure_reason?: string | null
          id?: string
          status?: string
          user_id?: string
          verification_details?: Json | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_verification_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          application_id: string
          created_at: string | null
          document_type: string | null
          extracted_text: string | null
          file_path: string
          id: string
          rejection_reason: string | null
          user_id: string | null
          verification_confidence: number | null
          verification_details: Json | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          document_type?: string | null
          extracted_text?: string | null
          file_path: string
          id?: string
          rejection_reason?: string | null
          user_id?: string | null
          verification_confidence?: number | null
          verification_details?: Json | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          document_type?: string | null
          extracted_text?: string | null
          file_path?: string
          id?: string
          rejection_reason?: string | null
          user_id?: string | null
          verification_confidence?: number | null
          verification_details?: Json | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_application_id"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      education_records: {
        Row: {
          completion_year: number
          created_at: string
          id: string
          province: string
          school_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_year: number
          created_at?: string
          id?: string
          province: string
          school_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_year?: number
          created_at?: string
          id?: string
          province?: string
          school_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_verification_logs: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          status: string | null
          user_id: string | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          province: string | null
          short_name: string | null
          type: string
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          province?: string | null
          short_name?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          province?: string | null
          short_name?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          interest_area: string | null
          name: string
          phone: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          interest_area?: string | null
          name: string
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          interest_area?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string | null
          related_document_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type?: string | null
          related_document_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string | null
          related_document_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_document_id_fkey"
            columns: ["related_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      nsfas_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          department: string | null
          employee_number: string | null
          id: string
          position: string | null
          region: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          department?: string | null
          employee_number?: string | null
          id?: string
          position?: string | null
          region?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          department?: string | null
          employee_number?: string | null
          id?: string
          position?: string | null
          region?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nsfas_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_inquiries: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          institution_name: string
          institution_type: string
          interested_tier: string | null
          message: string | null
          status: string | null
          student_count: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          institution_name: string
          institution_type: string
          interested_tier?: string | null
          message?: string | null
          status?: string | null
          student_count?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          institution_name?: string
          institution_type?: string
          interested_tier?: string | null
          message?: string | null
          status?: string | null
          student_count?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      partner_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          note_type: string | null
          partner_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          note_type?: string | null
          partner_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          note_type?: string | null
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_notes_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          partner_id: string
          payment_date: string
          payment_method: string | null
          reference_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          partner_id: string
          payment_date: string
          payment_method?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          partner_id?: string
          payment_date?: string
          payment_method?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_payments_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_tier_config: {
        Row: {
          active: boolean | null
          annual_fee: number
          api_rate_limit: number | null
          created_at: string
          features: Json | null
          id: string
          max_applications: number | null
          name: string
          support_level: string | null
          tier: Database["public"]["Enums"]["partner_tier"]
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          annual_fee: number
          api_rate_limit?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          max_applications?: number | null
          name: string
          support_level?: string | null
          tier: Database["public"]["Enums"]["partner_tier"]
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          annual_fee?: number
          api_rate_limit?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          max_applications?: number | null
          name?: string
          support_level?: string | null
          tier?: Database["public"]["Enums"]["partner_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          address: string | null
          annual_investment: number | null
          api_key: string | null
          city: string | null
          contact_email: string | null
          contact_person: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          integration_status: string | null
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          status: Database["public"]["Enums"]["partner_status"]
          tier: Database["public"]["Enums"]["partner_tier"]
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          annual_investment?: number | null
          api_key?: string | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          integration_status?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tier?: Database["public"]["Enums"]["partner_tier"]
          type: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          annual_investment?: number | null
          api_key?: string | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          integration_status?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tier?: Database["public"]["Enums"]["partner_tier"]
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      payment_audit_logs: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          payment_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          payment_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          payment_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          actual_payment_method: string | null
          amount: number
          created_at: string | null
          gateway_provider: string | null
          id: string
          ipn_verified: boolean | null
          last_webhook_attempt: string | null
          merchant_reference: string | null
          payfast_payment_id: string | null
          payfast_signature: string | null
          payment_expiry: string | null
          payment_method: string
          payment_reference: string | null
          payment_url: string | null
          plan: string
          preferred_payment_method: string | null
          retry_count: number | null
          status: string
          tier: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
          webhook_data: Json | null
        }
        Insert: {
          actual_payment_method?: string | null
          amount: number
          created_at?: string | null
          gateway_provider?: string | null
          id?: string
          ipn_verified?: boolean | null
          last_webhook_attempt?: string | null
          merchant_reference?: string | null
          payfast_payment_id?: string | null
          payfast_signature?: string | null
          payment_expiry?: string | null
          payment_method: string
          payment_reference?: string | null
          payment_url?: string | null
          plan: string
          preferred_payment_method?: string | null
          retry_count?: number | null
          status: string
          tier?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
          webhook_data?: Json | null
        }
        Update: {
          actual_payment_method?: string | null
          amount?: number
          created_at?: string | null
          gateway_provider?: string | null
          id?: string
          ipn_verified?: boolean | null
          last_webhook_attempt?: string | null
          merchant_reference?: string | null
          payfast_payment_id?: string | null
          payfast_signature?: string | null
          payment_expiry?: string | null
          payment_method?: string
          payment_reference?: string | null
          payment_url?: string | null
          plan?: string
          preferred_payment_method?: string | null
          retry_count?: number | null
          status?: string
          tier?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_data?: Json | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          features: string[] | null
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          active: boolean | null
          code: string | null
          created_at: string | null
          faculty: string | null
          id: string
          institution_id: string
          name: string
          qualification_type: string | null
          study_mode: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code?: string | null
          created_at?: string | null
          faculty?: string | null
          id?: string
          institution_id: string
          name: string
          qualification_type?: string | null
          study_mode?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string | null
          created_at?: string | null
          faculty?: string | null
          id?: string
          institution_id?: string
          name?: string
          qualification_type?: string | null
          study_mode?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_analytics: {
        Row: {
          average_order_value: number | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          revenue_by_month: Json | null
          revenue_by_tier: Json | null
          top_revenue_sources: Json | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          average_order_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          revenue_by_month?: Json | null
          revenue_by_tier?: Json | null
          top_revenue_sources?: Json | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          average_order_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          revenue_by_month?: Json | null
          revenue_by_tier?: Json | null
          top_revenue_sources?: Json | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rls_policy_registry: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          policy_name: string
          policy_type: string
          table_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          policy_name: string
          policy_type: string
          table_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          policy_name?: string
          policy_type?: string
          table_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      rls_policy_test_results: {
        Row: {
          created_at: string | null
          details: string | null
          id: string
          operation: string
          policy_name: string
          scenario: string | null
          success: boolean
          table_name: string
          test_session_id: string
          tested_as: string
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string
          operation: string
          policy_name: string
          scenario?: string | null
          success: boolean
          table_name: string
          test_session_id?: string
          tested_as: string
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string
          operation?: string
          policy_name?: string
          scenario?: string | null
          success?: boolean
          table_name?: string
          test_session_id?: string
          tested_as?: string
        }
        Relationships: []
      }
      sponsor_allocations: {
        Row: {
          allocated_on: string
          created_at: string
          expires_on: string | null
          id: string
          notes: string | null
          plan: string
          sponsor_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          allocated_on?: string
          created_at?: string
          expires_on?: string | null
          id?: string
          notes?: string | null
          plan: string
          sponsor_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          allocated_on?: string
          created_at?: string
          expires_on?: string | null
          id?: string
          notes?: string | null
          plan?: string
          sponsor_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_allocations_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_applications: {
        Row: {
          application_id: string
          created_at: string
          id: string
          purpose: string | null
          requested_amount: number
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          purpose?: string | null
          requested_amount: number
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          purpose?: string | null
          requested_amount?: number
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_matching_results: {
        Row: {
          created_at: string | null
          id: string
          match_score: number
          sponsor_id: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_score: number
          sponsor_id: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_score?: number
          sponsor_id?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_matching_results_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_profiles: {
        Row: {
          created_at: string | null
          description: string | null
          funding_amount_range: Json | null
          funding_capacity: number | null
          funding_frequency: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          preferred_academic_levels: string[] | null
          preferred_fields: string[] | null
          sponsor_id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          funding_amount_range?: Json | null
          funding_capacity?: number | null
          funding_frequency?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          preferred_academic_levels?: string[] | null
          preferred_fields?: string[] | null
          sponsor_id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          funding_amount_range?: Json | null
          funding_capacity?: number | null
          funding_frequency?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          preferred_academic_levels?: string[] | null
          preferred_fields?: string[] | null
          sponsor_id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_profiles_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          organization_type: string | null
          password_hash: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
          verified_status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          organization_type?: string | null
          password_hash?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          verified_status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization_type?: string | null
          password_hash?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          verified_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorships: {
        Row: {
          amount: number
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          currency: string
          description: string
          end_date: string
          expires_at: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          organization_name: string
          requirements: Json | null
          sponsorship_level: string
          start_date: string
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          amount: number
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          currency?: string
          description: string
          end_date: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          organization_name: string
          requirements?: Json | null
          sponsorship_level?: string
          start_date: string
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          amount?: number
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          currency?: string
          description?: string
          end_date?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          organization_name?: string
          requirements?: Json | null
          sponsorship_level?: string
          start_date?: string
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          academic_level: string | null
          achievements: Json | null
          bio: string | null
          created_at: string | null
          extracurricular_activities: Json | null
          field_of_study: string | null
          financial_need_score: number | null
          gpa: number | null
          id: string
          location: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          academic_level?: string | null
          achievements?: Json | null
          bio?: string | null
          created_at?: string | null
          extracurricular_activities?: Json | null
          field_of_study?: string | null
          financial_need_score?: number | null
          gpa?: number | null
          id?: string
          location?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          academic_level?: string | null
          achievements?: Json | null
          bio?: string | null
          created_at?: string | null
          extracurricular_activities?: Json | null
          field_of_study?: string | null
          financial_need_score?: number | null
          gpa?: number | null
          id?: string
          location?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subject_marks: {
        Row: {
          created_at: string
          education_record_id: string
          grade_level: string
          id: string
          mark: number
          subject_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          education_record_id: string
          grade_level: string
          id?: string
          mark: number
          subject_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          education_record_id?: string
          grade_level?: string
          id?: string
          mark?: number
          subject_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subject_marks_education_record_id_fkey"
            columns: ["education_record_id"]
            isOneToOne: false
            referencedRelation: "education_records"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          description: string
          id: string
          includes_ai_assistance: boolean | null
          includes_auto_fill: boolean | null
          includes_career_guidance: boolean | null
          includes_document_reviews: boolean | null
          includes_nsfas_guidance: boolean | null
          includes_priority_support: boolean | null
          includes_verification: boolean | null
          max_applications: number
          max_documents: number | null
          name: string
          price_once_off: number
          thandi_tier: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          includes_ai_assistance?: boolean | null
          includes_auto_fill?: boolean | null
          includes_career_guidance?: boolean | null
          includes_document_reviews?: boolean | null
          includes_nsfas_guidance?: boolean | null
          includes_priority_support?: boolean | null
          includes_verification?: boolean | null
          max_applications: number
          max_documents?: number | null
          name: string
          price_once_off?: number
          thandi_tier: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          includes_ai_assistance?: boolean | null
          includes_auto_fill?: boolean | null
          includes_career_guidance?: boolean | null
          includes_document_reviews?: boolean | null
          includes_nsfas_guidance?: boolean | null
          includes_priority_support?: boolean | null
          includes_verification?: boolean | null
          max_applications?: number
          max_documents?: number | null
          name?: string
          price_once_off?: number
          thandi_tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_error_logs: {
        Row: {
          action: string | null
          category: string
          component: string | null
          details: Json | null
          id: string
          is_resolved: boolean
          message: string
          occurred_at: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          category: string
          component?: string | null
          details?: Json | null
          id?: string
          is_resolved?: boolean
          message: string
          occurred_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          category?: string
          component?: string | null
          details?: Json | null
          id?: string
          is_resolved?: boolean
          message?: string
          occurred_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thandi_intent_training: {
        Row: {
          admin_id: string
          confidence: number | null
          created_at: string
          id: string
          intent_id: string | null
          message_id: string
        }
        Insert: {
          admin_id: string
          confidence?: number | null
          created_at?: string
          id?: string
          intent_id?: string | null
          message_id: string
        }
        Update: {
          admin_id?: string
          confidence?: number | null
          created_at?: string
          id?: string
          intent_id?: string | null
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thandi_intent_training_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "thandi_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thandi_intent_training_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "thandi_interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      thandi_intents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          intent_name: string
          response_template: string | null
          sample_queries: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          intent_name: string
          response_template?: string | null
          sample_queries?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          intent_name?: string
          response_template?: string | null
          sample_queries?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      thandi_interactions: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          intent_id: string | null
          is_user: boolean
          low_confidence: boolean | null
          message: string
          response_type: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          intent_id?: string | null
          is_user?: boolean
          low_confidence?: boolean | null
          message: string
          response_type?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          intent_id?: string | null
          is_user?: boolean
          low_confidence?: boolean | null
          message?: string
          response_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thandi_interactions_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "thandi_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      thandi_knowledge_index: {
        Row: {
          created_at: string
          html_path: string
          id: string
          json_path: string
          module: string
          source_links: string[]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_path: string
          id?: string
          json_path: string
          module: string
          source_links: string[]
          tags: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_path?: string
          id?: string
          json_path?: string
          module?: string
          source_links?: string[]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      thandi_message_feedback: {
        Row: {
          created_at: string
          feedback_type: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_type: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_type?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thandi_message_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "thandi_interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_id_audit_log: {
        Row: {
          assigned_by: string | null
          assignment_method: string
          created_at: string | null
          id: string
          tracking_id: string
          user_id: string | null
        }
        Insert: {
          assigned_by?: string | null
          assignment_method: string
          created_at?: string | null
          id?: string
          tracking_id: string
          user_id?: string | null
        }
        Update: {
          assigned_by?: string | null
          assignment_method?: string
          created_at?: string | null
          id?: string
          tracking_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_id_audit_log_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_id_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          status: string | null
          transaction_reference: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          transaction_reference?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          transaction_reference?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          applications_submitted: number | null
          conversion_rate: number | null
          features_used: string[] | null
          first_seen: string | null
          last_active: string | null
          payments_completed: number | null
          total_page_views: number | null
          total_sessions: number | null
          user_id: string
        }
        Insert: {
          applications_submitted?: number | null
          conversion_rate?: number | null
          features_used?: string[] | null
          first_seen?: string | null
          last_active?: string | null
          payments_completed?: number | null
          total_page_views?: number | null
          total_sessions?: number | null
          user_id: string
        }
        Update: {
          applications_submitted?: number | null
          conversion_rate?: number | null
          features_used?: string[] | null
          first_seen?: string | null
          last_active?: string | null
          payments_completed?: number | null
          total_page_views?: number | null
          total_sessions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_date: string | null
          consent_given: boolean
          consent_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_date?: string | null
          consent_given?: boolean
          consent_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_date?: string | null
          consent_given?: boolean
          consent_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          notification_types: Json | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          notification_types?: Json | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          notification_types?: Json | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          plan: string
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan: string
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan?: string
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          profile_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          payment_method: string | null
          purchase_date: string
          tier_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          payment_method?: string | null
          purchase_date?: string
          tier_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          payment_method?: string | null
          purchase_date?: string
          tier_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          consent_given: boolean | null
          contact_email: string | null
          created_at: string
          current_plan: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          id: string
          id_number: string | null
          id_verified: boolean | null
          last_query_date: string | null
          national_id_encrypted: string | null
          phone_number: string | null
          profile_status: string | null
          query_count_today: number | null
          query_limit: number | null
          referrer_partner_id: string | null
          sponsor_id: string | null
          tier_level: string | null
          tracking_id: string | null
          user_type: string | null
        }
        Insert: {
          consent_given?: boolean | null
          contact_email?: string | null
          created_at?: string
          current_plan?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          id_number?: string | null
          id_verified?: boolean | null
          last_query_date?: string | null
          national_id_encrypted?: string | null
          phone_number?: string | null
          profile_status?: string | null
          query_count_today?: number | null
          query_limit?: number | null
          referrer_partner_id?: string | null
          sponsor_id?: string | null
          tier_level?: string | null
          tracking_id?: string | null
          user_type?: string | null
        }
        Update: {
          consent_given?: boolean | null
          contact_email?: string | null
          created_at?: string
          current_plan?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          id_number?: string | null
          id_verified?: boolean | null
          last_query_date?: string | null
          national_id_encrypted?: string | null
          phone_number?: string | null
          profile_status?: string | null
          query_count_today?: number | null
          query_limit?: number | null
          referrer_partner_id?: string | null
          sponsor_id?: string | null
          tier_level?: string | null
          tracking_id?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_referrer_partner_id_fkey"
            columns: ["referrer_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_logs: {
        Row: {
          attempt_number: number | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          national_id_last4: string | null
          result: string
          user_id: string | null
          verification_method: string | null
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          national_id_last4?: string | null
          result: string
          user_id?: string | null
          verification_method?: string | null
        }
        Update: {
          attempt_number?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          national_id_last4?: string | null
          result?: string
          user_id?: string | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          first_attempt_at: string | null
          id: string
          ip_address: unknown | null
          last_attempt_at: string | null
          user_identifier: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          first_attempt_at?: string | null
          id?: string
          ip_address?: unknown | null
          last_attempt_at?: string | null
          user_identifier?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          first_attempt_at?: string | null
          id?: string
          ip_address?: unknown | null
          last_attempt_at?: string | null
          user_identifier?: string | null
        }
        Relationships: []
      }
      verifyid_audit_log: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          national_id_hash: string
          user_agent: string | null
          user_id: string
          verification_response: Json | null
          verification_status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          national_id_hash: string
          user_agent?: string | null
          user_id: string
          verification_response?: Json | null
          verification_status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          national_id_hash?: string
          user_agent?: string | null
          user_id?: string
          verification_response?: Json | null
          verification_status?: string
        }
        Relationships: []
      }
    }
    Views: {
      payment_method_analytics: {
        Row: {
          actual_payment_method: string | null
          avg_amount: number | null
          preferred_payment_method: string | null
          success_rate: number | null
          successful_payments: number | null
          total_revenue: number | null
          usage_count: number | null
        }
        Relationships: []
      }
      payment_method_summary: {
        Row: {
          avg_amount: number | null
          failed_payments: number | null
          payment_method: string | null
          success_rate: number | null
          successful_payments: number | null
          total_attempts: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      payment_monitoring: {
        Row: {
          amount: number | null
          created_at: string | null
          gateway_provider: string | null
          id: string | null
          last_webhook_attempt: string | null
          merchant_reference: string | null
          payment_expiry: string | null
          retry_count: number | null
          status: string | null
          tier: string | null
          user_email: string | null
          user_tracking_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      analyze_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          has_select_policy: boolean
          has_insert_policy: boolean
          has_update_policy: boolean
          has_delete_policy: boolean
          recommendation: string
        }[]
      }
      assign_tracking_id_to_user: {
        Args: { p_user_id: string }
        Returns: string
      }
      assign_user_role: {
        Args: {
          p_user_id: string
          p_user_type: string
          p_additional_data?: Json
        }
        Returns: boolean
      }
      audit_rls_policies: {
        Args: { p_user_id?: string }
        Returns: {
          table_name: string
          policy_name: string
          operation: string
          success: boolean
          details: string
        }[]
      }
      belongs_to_user: {
        Args: { table_name: string; record_id: string }
        Returns: boolean
      }
      decrypt_national_id: {
        Args: { encrypted_id: string; user_requesting?: string }
        Returns: string
      }
      generate_email_verification_token: {
        Args: { p_user_id: string }
        Returns: string
      }
      generate_tracking_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_intents_with_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          intent_name: string
          description: string
          response_template: string
          sample_queries: Json
          created_at: string
          updated_at: string
          message_count: number
          avg_confidence: number
        }[]
      }
      get_tracking_id_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      handle_verification_success: {
        Args: {
          p_user_id: string
          p_email: string
          p_full_name: string
          p_national_id: string
          p_phone_number?: string
        }
        Returns: Json
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      peek_next_tracking_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      register_rls_policy: {
        Args: {
          p_table_name: string
          p_policy_name: string
          p_policy_type: string
          p_description: string
        }
        Returns: string
      }
      test_rls_policies_with_role: {
        Args: { p_role?: string; p_scenario?: string }
        Returns: {
          table_name: string
          policy_name: string
          operation: string
          success: boolean
          details: string
          test_session_id: string
        }[]
      }
      validate_tracking_id_format: {
        Args: { p_tracking_id: string }
        Returns: boolean
      }
      verify_email_token: {
        Args: { p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      partner_status: "active" | "inactive" | "pending" | "suspended"
      partner_tier: "basic" | "standard" | "premium"
      partner_type:
        | "university"
        | "tvet"
        | "funder"
        | "seta"
        | "other"
        | "sponsor"
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
      partner_status: ["active", "inactive", "pending", "suspended"],
      partner_tier: ["basic", "standard", "premium"],
      partner_type: [
        "university",
        "tvet",
        "funder",
        "seta",
        "other",
        "sponsor",
      ],
    },
  },
} as const

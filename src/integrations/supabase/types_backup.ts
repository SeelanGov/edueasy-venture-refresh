export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          amount: number;
          currency: string;
          status: string;
          payment_method: string | null;
          payment_reference: string | null;
          transaction_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          amount: number;
          currency?: string;
          status: string;
          payment_method?: string | null;
          payment_reference?: string | null;
          transaction_type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          payment_method?: string | null;
          payment_reference?: string | null;
          transaction_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_subscription_id_fkey';
            columns: ['subscription_id'];
            isOneToOne: false;
            referencedRelation: 'user_subscriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          status: string;
          reward_amount: number | null;
          reward_claimed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          status?: string;
          reward_amount?: number | null;
          reward_claimed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_id?: string;
          status?: string;
          reward_amount?: number | null;
          reward_claimed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'referrals_referrer_id_fkey';
            columns: ['referrer_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'referrals_referred_id_fkey';
            columns: ['referred_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      addresses: {
        Row: {
          address_type: string;
          city: string;
          created_at: string;
          id: string;
          postal_code: string;
          province: string;
          street_address: string;
          suburb: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address_type: string;
          city: string;
          created_at?: string;
          id?: string;
          postal_code: string;
          province: string;
          street_address: string;
          suburb: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address_type?: string;
          city?: string;
          created_at?: string;
          id?: string;
          postal_code?: string;
          province?: string;
          street_address?: string;
          suburb?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          created_at: string | null;
          grade12_results: string | null;
          id: string;
          institution_id: string | null;
          program: string | null;
          program_id: string | null;
          status: string | null;
          university: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          grade12_results?: string | null;
          id?: string;
          institution_id?: string | null;
          program?: string | null;
          program_id?: string | null;
          status?: string | null;
          university?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          grade12_results?: string | null;
          id?: string;
          institution_id?: string | null;
          program?: string | null;
          program_id?: string | null;
          status?: string | null;
          university?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_institution_id_fkey';
            columns: ['institution_id'];
            isOneToOne: false;
            referencedRelation: 'institutions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'programs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      document_verification_logs: {
        Row: {
          completed_at: string | null;
          confidence_score: number | null;
          created_at: string;
          document_id: string;
          document_type: string;
          failure_reason: string | null;
          id: string;
          status: string;
          user_id: string;
          verification_details: Json | null;
          verification_method: string | null;
        };
        Insert: {
          completed_at?: string | null;
          confidence_score?: number | null;
          created_at?: string;
          document_id: string;
          document_type: string;
          failure_reason?: string | null;
          id?: string;
          status?: string;
          user_id: string;
          verification_details?: Json | null;
          verification_method?: string | null;
        };
        Update: {
          completed_at?: string | null;
          confidence_score?: number | null;
          created_at?: string;
          document_id?: string;
          document_type?: string;
          failure_reason?: string | null;
          id?: string;
          status?: string;
          user_id?: string;
          verification_details?: Json | null;
          verification_method?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'document_verification_logs_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          application_id: string;
          created_at: string | null;
          document_type: string | null;
          extracted_text: string | null;
          file_path: string;
          id: string;
          rejection_reason: string | null;
          user_id: string | null;
          verification_confidence: number | null;
          verification_details: Json | null;
          verification_status: string | null;
          verified_at: string | null;
        };
        Insert: {
          application_id: string;
          created_at?: string | null;
          document_type?: string | null;
          extracted_text?: string | null;
          file_path: string;
          id?: string;
          rejection_reason?: string | null;
          user_id?: string | null;
          verification_confidence?: number | null;
          verification_details?: Json | null;
          verification_status?: string | null;
          verified_at?: string | null;
        };
        Update: {
          application_id?: string;
          created_at?: string | null;
          document_type?: string | null;
          extracted_text?: string | null;
          file_path?: string;
          id?: string;
          rejection_reason?: string | null;
          user_id?: string | null;
          verification_confidence?: number | null;
          verification_details?: Json | null;
          verification_status?: string | null;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_application_id';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
        ];
      };
      education_records: {
        Row: {
          completion_year: number;
          created_at: string;
          id: string;
          province: string;
          school_name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completion_year: number;
          created_at?: string;
          id?: string;
          province: string;
          school_name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completion_year?: number;
          created_at?: string;
          id?: string;
          province?: string;
          school_name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      institutions: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          email: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          phone: string | null;
          province: string | null;
          short_name: string | null;
          type: string;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          province?: string | null;
          short_name?: string | null;
          type: string;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          province?: string | null;
          short_name?: string | null;
          type?: string;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean | null;
          message: string;
          notification_type: string | null;
          related_document_id: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean | null;
          message: string;
          notification_type?: string | null;
          related_document_id?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_read?: boolean | null;
          message?: string;
          notification_type?: string | null;
          related_document_id?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_related_document_id_fkey';
            columns: ['related_document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      subscription_tiers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_monthly: number;
          price_yearly: number;
          max_applications: number;
          max_documents: number;
          includes_verification: boolean;
          includes_ai_assistance: boolean;
          includes_priority_support: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_monthly: number;
          price_yearly: number;
          max_applications: number;
          max_documents: number;
          includes_verification?: boolean;
          includes_ai_assistance?: boolean;
          includes_priority_support?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_monthly?: number;
          price_yearly?: number;
          max_applications?: number;
          max_documents?: number;
          includes_verification?: boolean;
          includes_ai_assistance?: boolean;
          includes_priority_support?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier_id: string;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          payment_method: string | null;
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier_id: string;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          payment_method?: string | null;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier_id?: string;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          payment_method?: string | null;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_subscriptions_tier_id_fkey';
            columns: ['tier_id'];
            isOneToOne: false;
            referencedRelation: 'subscription_tiers';
            referencedColumns: ['id'];
          },
        ];
      };
      programs: {
        Row: {
          active: boolean | null;
          code: string | null;
          created_at: string | null;
          faculty: string | null;
          id: string;
          institution_id: string;
          name: string;
          qualification_type: string | null;
          study_mode: string | null;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          code?: string | null;
          created_at?: string | null;
          faculty?: string | null;
          id?: string;
          institution_id: string;
          name: string;
          qualification_type?: string | null;
          study_mode?: string | null;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          code?: string | null;
          created_at?: string | null;
          faculty?: string | null;
          id?: string;
          institution_id?: string;
          name?: string;
          qualification_type?: string | null;
          study_mode?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'programs_institution_id_fkey';
            columns: ['institution_id'];
            isOneToOne: false;
            referencedRelation: 'institutions';
            referencedColumns: ['id'];
          },
        ];
      };
      rls_policy_registry: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          policy_name: string;
          policy_type: string;
          table_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          policy_name: string;
          policy_type: string;
          table_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          policy_name?: string;
          policy_type?: string;
          table_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rls_policy_test_results: {
        Row: {
          created_at: string | null;
          details: string | null;
          id: string;
          operation: string;
          policy_name: string;
          scenario: string | null;
          success: boolean;
          table_name: string;
          test_session_id: string;
          tested_as: string;
        };
        Insert: {
          created_at?: string | null;
          details?: string | null;
          id?: string;
          operation: string;
          policy_name: string;
          scenario?: string | null;
          success: boolean;
          table_name: string;
          test_session_id?: string;
          tested_as: string;
        };
        Update: {
          created_at?: string | null;
          details?: string | null;
          id?: string;
          operation?: string;
          policy_name?: string;
          scenario?: string | null;
          success?: boolean;
          table_name?: string;
          test_session_id?: string;
          tested_as?: string;
        };
        Relationships: [];
      };
      subscription_tiers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_monthly: number;
          price_yearly: number;
          max_applications: number;
          max_documents: number;
          includes_verification: boolean;
          includes_ai_assistance: boolean;
          includes_priority_support: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_monthly: number;
          price_yearly: number;
          max_applications: number;
          max_documents: number;
          includes_verification?: boolean;
          includes_ai_assistance?: boolean;
          includes_priority_support?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_monthly?: number;
          price_yearly?: number;
          max_applications?: number;
          max_documents?: number;
          includes_verification?: boolean;
          includes_ai_assistance?: boolean;
          includes_priority_support?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subject_marks: {
        Row: {
          created_at: string;
          education_record_id: string;
          grade_level: string;
          id: string;
          mark: number;
          subject_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          education_record_id: string;
          grade_level: string;
          id?: string;
          mark: number;
          subject_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          education_record_id?: string;
          grade_level?: string;
          id?: string;
          mark?: number;
          subject_name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subject_marks_education_record_id_fkey';
            columns: ['education_record_id'];
            isOneToOne: false;
            referencedRelation: 'education_records';
            referencedColumns: ['id'];
          },
        ];
      };
      system_error_logs: {
        Row: {
          action: string | null;
          category: string;
          component: string | null;
          details: Json | null;
          id: string;
          is_resolved: boolean;
          message: string;
          occurred_at: string;
          resolution_notes: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          severity: string;
          user_id: string | null;
        };
        Insert: {
          action?: string | null;
          category: string;
          component?: string | null;
          details?: Json | null;
          id?: string;
          is_resolved?: boolean;
          message: string;
          occurred_at?: string;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity: string;
          user_id?: string | null;
        };
        Update: {
          action?: string | null;
          category?: string;
          component?: string | null;
          details?: Json | null;
          id?: string;
          is_resolved?: boolean;
          message?: string;
          occurred_at?: string;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      thandi_intent_training: {
        Row: {
          admin_id: string;
          confidence: number | null;
          created_at: string;
          id: string;
          intent_id: string | null;
          message_id: string;
        };
        Insert: {
          admin_id: string;
          confidence?: number | null;
          created_at?: string;
          id?: string;
          intent_id?: string | null;
          message_id: string;
        };
        Update: {
          admin_id?: string;
          confidence?: number | null;
          created_at?: string;
          id?: string;
          intent_id?: string | null;
          message_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'thandi_intent_training_intent_id_fkey';
            columns: ['intent_id'];
            isOneToOne: false;
            referencedRelation: 'thandi_intents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'thandi_intent_training_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'thandi_interactions';
            referencedColumns: ['id'];
          },
        ];
      };
      thandi_intents: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          intent_name: string;
          response_template: string | null;
          sample_queries: Json | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          intent_name: string;
          response_template?: string | null;
          sample_queries?: Json | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          intent_name?: string;
          response_template?: string | null;
          sample_queries?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      thandi_interactions: {
        Row: {
          confidence_score: number | null;
          created_at: string;
          id: string;
          intent_id: string | null;
          is_user: boolean;
          low_confidence: boolean | null;
          message: string;
          response_type: string | null;
          user_id: string;
        };
        Insert: {
          confidence_score?: number | null;
          created_at?: string;
          id?: string;
          intent_id?: string | null;
          is_user?: boolean;
          low_confidence?: boolean | null;
          message: string;
          response_type?: string | null;
          user_id: string;
        };
        Update: {
          confidence_score?: number | null;
          created_at?: string;
          id?: string;
          intent_id?: string | null;
          is_user?: boolean;
          low_confidence?: boolean | null;
          message?: string;
          response_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'thandi_interactions_intent_id_fkey';
            columns: ['intent_id'];
            isOneToOne: false;
            referencedRelation: 'thandi_intents';
            referencedColumns: ['id'];
          },
        ];
      };
      thandi_message_feedback: {
        Row: {
          created_at: string;
          feedback_type: string;
          id: string;
          message_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          feedback_type: string;
          id?: string;
          message_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          feedback_type?: string;
          id?: string;
          message_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'thandi_message_feedback_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'thandi_interactions';
            referencedColumns: ['id'];
          },
        ];
      };
      user_preferences: {
        Row: {
          created_at: string;
          email_notifications: boolean | null;
          id: string;
          theme: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email_notifications?: boolean | null;
          id?: string;
          theme?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email_notifications?: boolean | null;
          id?: string;
          theme?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          contact_email: string | null;
          created_at: string;
          email: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          full_name: string | null;
          id: string;
          id_number: string | null;
          phone_number: string | null;
          profile_status: string | null;
        };
        Insert: {
          contact_email?: string | null;
          created_at?: string;
          email?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          full_name?: string | null;
          id?: string;
          id_number?: string | null;
          phone_number?: string | null;
          profile_status?: string | null;
        };
        Update: {
          contact_email?: string | null;
          created_at?: string;
          email?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          full_name?: string | null;
          id?: string;
          id_number?: string | null;
          phone_number?: string | null;
          profile_status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      analyze_rls_policies: {
        Args: Record<PropertyKey, never>;
        Returns: {
          table_name: string;
          has_select_policy: boolean;
          has_insert_policy: boolean;
          has_update_policy: boolean;
          has_delete_policy: boolean;
          recommendation: string;
        }[];
      };
      audit_rls_policies: {
        Args: { p_user_id?: string };
        Returns: {
          table_name: string;
          policy_name: string;
          operation: string;
          success: boolean;
          details: string;
        }[];
      };
      belongs_to_user: {
        Args: { table_name: string; record_id: string };
        Returns: boolean;
      };
      get_intents_with_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          intent_name: string;
          description: string;
          response_template: string;
          sample_queries: Json;
          created_at: string;
          updated_at: string;
          message_count: number;
          avg_confidence: number;
        }[];
      };
      is_admin: {
        Args: { user_uuid?: string };
        Returns: boolean;
      };
      register_rls_policy: {
        Args: {
          p_table_name: string;
          p_policy_name: string;
          p_policy_type: string;
          p_description: string;
        };
        Returns: string;
      };
      test_rls_policies_with_role: {
        Args: { p_role?: string; p_scenario?: string };
        Returns: {
          table_name: string;
          policy_name: string;
          operation: string;
          success: boolean;
          details: string;
          test_session_id: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

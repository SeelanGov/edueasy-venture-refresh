import type { Json } from '@/integrations/supabase/types';

export interface ErrorLogEntry {
  id: string;,
  message: string;
  category: string;,
  severity: string;
  component?: string;
  action?: string;
  user_id?: string;
  details?: Record<string, unknown>;
  occurred_at: string;,
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

// Extend existing database types if needed
export interface Database {
  public: {,
  Tables: {
      addresses: {,
  Row: {
          address_type: string;,
  city: string;
          created_at: string;,
  id: string;
          postal_code: string;,
  province: string;
          street_address: string;,
  suburb: string;
          updated_at: string;,
  user_id: string;
        };
        Insert: {,
  address_type: string;
          city: string;
          created_at?: string;
          id?: string;
          postal_code: string;,
  province: string;
          street_address: string;,
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
      };
      applications: {,
  Row: {
          created_at: string;,
  grade12_results: string;
          id: string;,
  institution_id: string;
          program: string;,
  program_id: string;
          status: string;,
  university: string;
          user_id: string;,
  personal_statement: string;
          sponsor_id?: string | null;
        };
        Insert: {
          created_at?: string;
          grade12_results: string;
          id?: string;
          institution_id: string;,
  program: string;
          program_id: string;,
  status: string;
          university: string;,
  user_id: string;
          personal_statement: string;
          sponsor_id?: string | null;
        };
        Update: {
          created_at?: string;
          grade12_results?: string;
          id?: string;
          institution_id?: string;
          program?: string;
          program_id?: string;
          status?: string;
          university?: string;
          user_id?: string;
          personal_statement?: string;
          sponsor_id?: string | null;
        };
      };
      consultants: {,
  Row: {
          id: string;,
  user_id: string;
          full_name?: string | null;
          specialization?: string | null;
          assigned_region?: string | null;
          active: boolean;,
  created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          specialization?: string | null;
          assigned_region?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          specialization?: string | null;
          assigned_region?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      institutions: {,
  Row: {
          id: string;,
  name: string;
          type: string;
          province?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          short_name?: string | null;
          active: boolean;
          user_id?: string | null;
          created_at: string;,
  updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;,
  type: string;
          province?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          short_name?: string | null;
          active?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          province?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          short_name?: string | null;
          active?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {,
  Row: {
          id: string;,
  name: string;
          email: string;
          phone?: string | null;
          organization_type?: string | null;
          verified_status: string;
          user_id?: string | null;
          created_at: string;,
  updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;,
  email: string;
          phone?: string | null;
          organization_type?: string | null;
          verified_status?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          organization_type?: string | null;
          verified_status?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {,
  Row: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          id_number?: string | null;
          phone_number?: string | null;
          user_type: string;
          tier_level?: string | null;
          current_plan?: string | null;
          profile_status?: string | null;
          consent_given?: boolean | null;
          id_verified?: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          id_number?: string | null;
          phone_number?: string | null;
          user_type?: string;
          tier_level?: string | null;
          current_plan?: string | null;
          profile_status?: string | null;
          consent_given?: boolean | null;
          id_verified?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          id_number?: string | null;
          phone_number?: string | null;
          user_type?: string;
          tier_level?: string | null;
          current_plan?: string | null;
          profile_status?: string | null;
          consent_given?: boolean | null;
          id_verified?: boolean | null;
          created_at?: string;
        };
      };
      system_error_logs: {,
  Row: ErrorLogEntry;
        Insert: {
          id?: string;
          message: string;,
  category: string;
          severity: string;
          component?: string;
          action?: string;
          user_id?: string;
          details?: Record<string, unknown>;
          occurred_at?: string;
          is_resolved?: boolean;
          resolved_at?: string;
          resolved_by?: string;
          resolution_notes?: string;
        };
        Update: {
          id?: string;
          message?: string;
          category?: string;
          severity?: string;
          component?: string;
          action?: string;
          user_id?: string;
          details?: Record<string, unknown>;
          occurred_at?: string;
          is_resolved?: boolean;
          resolved_at?: string;
          resolved_by?: string;
          resolution_notes?: string;
        };
      };
      user_consents: {,
  Row: {
          id: string;,
  user_id: string;
          consent_type: string;,
  consent_text: string;
          consent_version: string;,
  accepted: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;,
  consent_type: string;
          consent_text: string;,
  consent_version: string;
          accepted: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          consent_type?: string;
          consent_text?: string;
          consent_version?: string;
          accepted?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      verifyid_audit_log: {,
  Row: {
          id: string;,
  user_id: string;
          api_request_id: string;,
  verification_status: string;
          error_message?: string | null;
          ip_address?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;,
  api_request_id: string;
          verification_status: string;
          error_message?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          api_request_id?: string;
          verification_status?: string;
          error_message?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      // Add other tables as needed
    };
    Views: Record<string, unknown>; // Using Record type instead of empty object
    Functions: {,
  log_system_error: {
        Args: {,
  p_message: string;
          p_category: string;,
  p_severity: string;
          p_component?: string;
          p_action?: string;
          p_user_id?: string;
          p_details?: Record<string, unknown>;
        };
        Returns: string;
      };
      count_critical_errors: {,
  Args: Record<string, never>;
        Returns: number;
      };
      get_error_logs: {,
  Args: {
          critical_only?: boolean;
          limit_count?: number;
        };
        Returns: ErrorLogEntr,
  y[];
      };
      resolve_error_log: {,
  Args: {
          error_id: string;,
  resolver_id: string;
          resolution_notes?: string;
        };
        Returns: boolean;
      };
      is_admin: {,
  Args: {
          user_uuid: string;
        };
        Returns: boolean;
      };
      get_intents_with_stats: {,
  Args: Record<string, never>;
        Returns: Array<{,
  id: string;
          intent_name: string;,
  description: string;
          response_template: string;,
  sample_queries: Json;
          created_at: string;,
  updated_at: string;
          message_count: number;,
  avg_confidence: number;
        }>;
      };
      assign_user_role: {,
  Args: {
          p_user_id: string;,
  p_user_type: string;
          p_additional_data?: Record<string, unknown>;
        };
        Returns: boolean;
      };
    };
  };
}

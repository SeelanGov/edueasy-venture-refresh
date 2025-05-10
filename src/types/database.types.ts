
export interface ErrorLogEntry {
  id: string;
  message: string;
  category: string;
  severity: string;
  component?: string;
  action?: string;
  user_id?: string;
  details?: Record<string, unknown>;
  occurred_at: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

// Extend existing database types if needed
export interface Database {
  public: {
    Tables: {
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
      };
      applications: {
        Row: {
          created_at: string;
          grade12_results: string;
          id: string;
          institution_id: string;
          program: string;
          program_id: string;
          status: string;
          university: string;
          user_id: string;
          personal_statement: string;
        };
        Insert: {
          created_at?: string;
          grade12_results: string;
          id?: string;
          institution_id: string;
          program: string;
          program_id: string;
          status: string;
          university: string;
          user_id: string;
          personal_statement: string;
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
        };
      };
      system_error_logs: {
        Row: ErrorLogEntry;
        Insert: {
          id?: string;
          message: string;
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
      // Add other tables as needed
    };
    Views: {
      // Add views as needed
    };
    Functions: {
      log_system_error: {
        Args: {
          p_message: string;
          p_category: string;
          p_severity: string;
          p_component?: string;
          p_action?: string;
          p_user_id?: string;
          p_details?: Record<string, unknown>;
        };
        Returns: string;
      };
      count_critical_errors: {
        Args: Record<string, never>;
        Returns: number;
      };
      get_error_logs: {
        Args: {
          critical_only?: boolean;
          limit_count?: number;
        };
        Returns: ErrorLogEntry[];
      };
      resolve_error_log: {
        Args: {
          error_id: string;
          resolver_id: string;
          resolution_notes?: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: {
          user_uuid: string;
        };
        Returns: boolean;
      };
      get_intents_with_stats: {
        Args: Record<string, never>;
        Returns: Array<{
          id: string;
          intent_name: string;
          description: string;
          response_template: string;
          sample_queries: any;
          created_at: string;
          updated_at: string;
          message_count: number;
          avg_confidence: number;
        }>;
      };
    };
  };
}

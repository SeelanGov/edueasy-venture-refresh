
export interface TrainingEntry {
  id: string;
  message_id: string;
  intent_id: string;
  confidence: number | null;
  admin_id: string;
  created_at: string;
}

export interface IntentWithStats {
  id: string;
  intent_name: string;
  description?: string;
  response_template?: string;
  sample_queries?: string[];
  created_at: string;
  updated_at: string;
  message_count: number;
  avg_confidence: number;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_user: boolean;
  confidence_score?: number;
  intent_id?: string;
  response_type?: string;
  low_confidence?: boolean;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface TrainingFilters {
  page: number;
  limit: number;
  lowConfidenceOnly: boolean;
}

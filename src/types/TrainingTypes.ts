export interface TrainingEntry {
  id: string;
  message_id: string;
  intent_id: string | null;
  confidence: number | null;
  admin_id: string;
  created_at: string;
  intents?: {
    intent_name: string;
  } | null;
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
  confidence_score?: number | null;
  intent_id?: string | null;
  response_type?: string;
  low_confidence?: boolean | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface TrainingFilters {
  page: number;
  limit: number;
  lowConfidenceOnly: boolean;
}

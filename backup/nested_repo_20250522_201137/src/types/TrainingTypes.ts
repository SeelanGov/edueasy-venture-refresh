
// Define common types for the training functionality
export interface ChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  user_id: string;
  confidence_score: number | null;
  low_confidence: boolean | null;
  intent_id: string | null;
  response_type: string | null;
  user_name?: string;
  user_email?: string;
  intent_name?: string;
}

export interface TrainingEntry {
  id: string;
  message_id: string;
  intent_id: string;
  admin_id: string;
  confidence: number | null;
  created_at: string;
  message?: ChatMessage;
  intent_name?: string;
}

export interface TrainingFilters {
  lowConfidenceOnly: boolean;
  page: number;
  limit: number;
}

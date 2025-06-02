
export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  intent_id?: string;
  confidence_score?: number;
  low_confidence?: boolean;
  response_type?: string;
}

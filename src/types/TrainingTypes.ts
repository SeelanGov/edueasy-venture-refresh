
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

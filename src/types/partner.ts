export interface Partner {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  type: 'individual' | 'corporate' | 'institutional';
  integration_status?: string;
  created_at?: string;
  updated_at?: string;
  mou_uploaded_at?: string;
}

export interface Note {
  id: string;
  content: string;
  created_at: string;
  author: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface PartnerIntegrationStep {
  key: string;
  label: string;
  help: string;
  completed?: boolean;
}
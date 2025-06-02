
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  related_document_id?: string;
  is_read: boolean;
  created_at: string;
}

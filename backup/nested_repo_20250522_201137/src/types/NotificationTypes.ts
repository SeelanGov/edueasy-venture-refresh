
export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  notification_type: NotificationType;
  related_document_id?: string;
}

export type NotificationType = 
  | "document_status" 
  | "document_approved" 
  | "document_rejected" 
  | "document_resubmission_required" 
  | "document_under_review"
  | "application_status" 
  | "admin_feedback" 
  | "system";

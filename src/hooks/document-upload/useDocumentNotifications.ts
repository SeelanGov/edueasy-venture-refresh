import { supabase } from "@/integrations/supabase/client";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";
import { toast } from "sonner";
import { playNotificationSound } from "@/utils/notificationSound";

export const useDocumentNotifications = () => {
  const createResubmissionNotification = async (
    userId: string,
    documentId: string,
    documentType: string
  ) => {
    await safeAsyncWithLogging(
      async () => {
        const { error } = await supabase.from('notifications').insert({
          user_id: userId,
          title: 'Document Resubmitted',
          message: `Your resubmitted ${documentType.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} is now under review.`,
          notification_type: 'document_under_review',
          related_document_id: documentId
        });
        
        if (error) throw error;
      },
      {
        component: "DocumentUpload",
        action: "CreateResubmissionNotification",
        userId: userId,
        severity: ErrorSeverity.INFO,
        showToast: false
      }
    );
    
    toast("Your document has been resubmitted for verification");
  };

  const showVerificationResultToast = (
    result: unknown, 
    isResubmission: boolean = false
  ) => {
    if (!result) return;
    
    const notificationType = isResubmission ? 'Resubmitted document ' : 'Document ';
    
    if (result.status === 'rejected') {
      playNotificationSound();
      toast(`${notificationType}Rejected: ${result.failureReason || 'Please check your document and try again'}`);
      return true;
    } else if (result.status === 'request_resubmission') {
      playNotificationSound();
      toast(`Resubmission Required: ${result.failureReason || 'Please check your document and try again'}`);
      return true;
    } else if (result.status === 'approved') {
      playNotificationSound();
      toast(`${notificationType}Verified: Your document has been successfully verified`);
      return true;
    }
    
    return false;
  };

  const handleNotification = (event: unknown) => {
    const result = event as { status?: string; failureReason?: string };
    if (result.status === 'rejected') {
      toast(`Rejected: ${result.failureReason || 'Please check your document and try again'}`);
    } else if (result.status === 'request_resubmission') {
      toast(`Resubmission Required: ${result.failureReason || 'Please check your document and try again'}`);
    } else if (result.status === 'approved') {
      toast('Document approved!');
    }
  };
  
  return {
    createResubmissionNotification,
    showVerificationResultToast
  };
};

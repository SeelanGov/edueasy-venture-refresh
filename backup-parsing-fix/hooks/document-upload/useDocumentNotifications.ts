import logger from '@/utils/logger';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define proper types for verification results
interface VerificationResult {
  status: string;
  failureReason?: string;
}

/**
 * useDocumentNotifications
 * @description Function
 */
export const useDocumentNotifications = () => {
  // Create notification for document resubmission
  const createResubmissionNotification = useCallback(
    async (userId: string, documentId: string, documentType: string) => {
      try {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: 'Document Resubmitted',
          message: `You have resubmitted your ${documentType
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()}.`,
          type: 'document_resubmission',
          reference_id: documentId,
          is_read: false,
        });
      } catch (error) {
        logger.error('Failed to create resubmission notification:', error);
      }
    },
    [],
  );

  // Show toast notification based on verification result
  const showVerificationResultToast = useCallback(
    (result: VerificationResult, isResubmission: boolean = false) => {
      // Audio feedback for important notifications
      const notificationSound = new Audio('/notification.mp3');

      if (result.status === 'approved') {
        notificationSound.play();
        toast.success(isResubmission ? 'Resubmitted document approved!' : 'Document approved!', {
          duration: 5000,
        });
      } else if (result.status === 'rejected' || result.status === 'request_resubmission') {
        notificationSound.play();
        toast.error(
          `Document rejected: ${result.failureReason || 'Please try again with a clearer document'}`,
          {
            duration: 8000,
          },
        );
      } else if (result.status === 'pending') {
        toast.info('Document is being reviewed by our team', {
          duration: 3000,
        });
      }
    },
    [],
  );

  return {
    createResubmissionNotification,
    showVerificationResultToast,
  };
};

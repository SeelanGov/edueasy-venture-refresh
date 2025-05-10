
/**
 * Log a verification attempt in the database
 */
export async function logVerificationAttempt(
  supabase: any,
  params: {
    documentId: string;
    userId: string;
    documentType: string;
  }
): Promise<string | undefined> {
  const { documentId, userId, documentType } = params;
  
  try {
    const { data: logData, error: logError } = await supabase
      .from('document_verification_logs')
      .insert({
        document_id: documentId,
        user_id: userId,
        document_type: documentType,
        status: 'processing',
        verification_method: 'ocr-verification',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (logError) {
      console.error('Error logging verification attempt:', logError, {
        timestamp: new Date().toISOString()
      });
      return undefined;
    } else if (logData) {
      console.log('Created verification log entry:', { 
        logId: logData.id, 
        timestamp: new Date().toISOString() 
      });
      return logData.id;
    }
  } catch (error) {
    console.error('Unexpected error creating log entry:', error, {
      timestamp: new Date().toISOString()
    });
  }
  
  return undefined;
}

/**
 * Update document verification status and create notifications
 */
export async function updateVerificationStatus(
  supabase: any,
  status: string,
  documentId: string,
  failureReason: string | null,
  confidenceScore: number,
  validationResults: Record<string, any>,
  logId?: string,
  userId?: string,
  extractedText?: string
): Promise<void> {
  // Log this step
  console.log(`Updating document ${documentId} status to ${status}`, {
    documentId,
    status,
    failureReason,
    confidenceScore,
    timestamp: new Date().toISOString()
  });
  
  // Update document verification status
  const { error: updateError } = await supabase
    .from('documents')
    .update({
      verification_status: status,
      extracted_text: extractedText,
      verification_confidence: confidenceScore,
      rejection_reason: failureReason,
      verification_details: validationResults,
      verified_at: new Date().toISOString()
    })
    .eq('id', documentId);
  
  if (updateError) {
    console.error('Error updating document status:', updateError, {
      timestamp: new Date().toISOString()
    });
    throw updateError;
  }
  
  // Update the verification log
  await updateVerificationLog(supabase, logId, status, confidenceScore, validationResults, failureReason);
  
  // Create notification if needed
  if (userId && (status === 'rejected' || status === 'request_resubmission' || status === 'approved')) {
    await createStatusNotification(supabase, userId, documentId, status, failureReason);
  }
}

/**
 * Update verification log with results
 */
async function updateVerificationLog(
  supabase: any,
  logId?: string,
  status?: string,
  confidenceScore?: number,
  validationResults?: Record<string, any>,
  failureReason?: string | null
): Promise<void> {
  if (!logId) return;
  
  const { error: logUpdateError } = await supabase
    .from('document_verification_logs')
    .update({
      status: status,
      confidence_score: confidenceScore,
      verification_details: validationResults,
      failure_reason: failureReason,
      completed_at: new Date().toISOString()
    })
    .eq('id', logId);
  
  if (logUpdateError) {
    console.error('Error updating verification log:', logUpdateError, {
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Create notification based on document verification status
 */
async function createStatusNotification(
  supabase: any,
  userId: string, 
  documentId: string, 
  status: string,
  failureReason: string | null
): Promise<void> {
  const notificationType = status === 'rejected' 
    ? 'document_rejected' 
    : status === 'request_resubmission' 
      ? 'document_resubmit' 
      : 'document_approved';
      
  const notificationTitle = status === 'rejected' 
    ? 'Document Rejected' 
    : status === 'request_resubmission' 
      ? 'Document Resubmission Required' 
      : 'Document Approved';
      
  const notificationMessage = status === 'approved'
    ? 'Your document has been approved and verified.'
    : failureReason || 'Please check your document and try again.';
  
  try {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        related_document_id: documentId,
        title: notificationTitle,
        message: notificationMessage,
        notification_type: notificationType
      });
    
    if (notificationError) {
      console.error('Error creating notification:', notificationError, {
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`Created ${notificationType} notification for user ${userId}`, {
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Unexpected error creating notification:', error, {
      timestamp: new Date().toISOString()
    });
  }
}

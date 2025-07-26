/**
 * Log verification attempt in database
 */
export async function logVerificationAttempt(
  supabase: unknown,
  {
    documentId,
    userId,
    documentType,
  }: { documentId: string; userId: string; documentType: string },
): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from('document_verification_logs')
      .insert({
        document_id: documentId,
        user_id: userId,
        document_type: documentType,
        verification_method: 'ocr.space',
        status: 'processing',
      })
      .select('id')
      .single();

    if (error) throw error;

    console.log('Verification attempt logged with ID:', data.id, {
      documentId,
      userId,
      documentType,
      timestamp: new Date().toISOString(),
    });

    return data.id;
  } catch (error) {
    console.error('Error creating verification log:', error);
    return undefined;
  }
}

/**
 * Update document verification status in database
 */
export async function updateVerificationStatus(
  supabase: unknown,
  status: string,
  documentId: string,
  failureReason: string | null,
  confidence: number,
  validationResults: Record<string, unknown>,
  logId?: string,
  userId?: string,
  extractedText?: string,
  extractedFields?: Record<string, string>,
): Promise<void> {
  try {
    console.log(`Updating document ${documentId} status to ${status}`, {
      confidence,
      timestamp: new Date().toISOString(),
    });

    // Enhanced verification details with more structured data
    const verificationDetails = {
      validation_results: validationResults,
      extracted_fields: extractedFields || {},
      confidence_details: {
        overall_confidence: confidence,
        timestamp: new Date().toISOString(),
        verification_method: 'ocr.space',
      },
    };

    // First update the document record with comprehensive data
    const { error: documentError } = await supabase
      .from('documents')
      .update({
        verification_status: status,
        rejection_reason: failureReason,
        verification_confidence: confidence,
        verification_details: verificationDetails,
        extracted_text: extractedText || null,
        verified_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    if (documentError) throw documentError;

    // Then update the verification log if we have a log ID
    if (logId) {
      const { error: logError } = await supabase
        .from('document_verification_logs')
        .update({
          status: status,
          confidence_score: confidence,
          verification_details: verificationDetails,
          failure_reason: failureReason,
          completed_at: new Date().toISOString(),
        })
        .eq('id', logId);

      if (logError) {
        console.error('Error updating verification log:', logError);
        throw logError;
      }
    }

    console.log('Successfully updated verification status', {
      documentId,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
}

/**
 * Create notification for document verification result
 */
export async function createVerificationNotification(
  supabase: unknown,
  userId: string,
  documentId: string,
  documentType: string,
  status: string,
  failureReason: string | null,
): Promise<void> {
  try {
    const title =
      status === 'approved'
        ? 'Document Verified'
        : status === 'rejected'
          ? 'Document Rejected'
          : 'Document Needs Resubmission';

    const message =
      status === 'approved'
        ? `Your ${documentType} has been successfully verified.`
        : failureReason || `Your ${documentType} verification was unsuccessful.`;

    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      related_document_id: documentId,
      notification_type: 'document_status',
    });

    if (error) throw error;

    console.log('Created verification notification', {
      userId,
      documentId,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Non-critical error, so we don't re-throw
  }
}

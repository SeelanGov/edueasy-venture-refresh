
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

/**
 * Log verification attempt in database
 */
export async function logVerificationAttempt(
  supabase: any, 
  { documentId, userId, documentType }: { documentId: string, userId: string, documentType: string }
): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from('document_verification_logs')
      .insert({
        document_id: documentId,
        user_id: userId,
        document_type: documentType,
        verification_method: 'ocr.space',
        status: 'processing'
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
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
  supabase: any,
  status: string, 
  documentId: string, 
  failureReason: string | null, 
  confidence: number,
  validationResults: Record<string, any>,
  logId?: string,
  userId?: string,
  extractedText?: string,
  extractedFields?: Record<string, string>
): Promise<void> {
  try {
    // First update the document record
    const { error: documentError } = await supabase
      .from('documents')
      .update({
        verification_status: status,
        rejection_reason: failureReason,
        verification_confidence: confidence,
        verification_details: {
          ...validationResults,
          extracted_fields: extractedFields
        },
        extracted_text: extractedText,
        verified_at: new Date().toISOString()
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
          verification_details: {
            validation_results: validationResults,
            extracted_fields: extractedFields,
            failure_reason: failureReason
          },
          failure_reason: failureReason,
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);
        
      if (logError) {
        console.error('Error updating verification log:', logError);
      }
    }
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
}

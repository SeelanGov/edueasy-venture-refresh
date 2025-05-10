
// Error categories for better classification
export enum ErrorCategory {
  VALIDATION = "validation",
  NETWORK = "network",
  PROCESSING = "processing",
  DATABASE = "database",
  UNKNOWN = "unknown"
}

// Standardized error object
export interface VerificationError {
  category: ErrorCategory;
  message: string;
  details?: unknown;
  timestamp: string;
}

/**
 * Centralized error handler for document verification
 */
export async function handleError(
  error: VerificationError, 
  supabase: any, 
  logId?: string,
  documentId?: string
): Promise<void> {
  console.error(`[${error.category.toUpperCase()}] ${error.message}`, error.details, {
    timestamp: error.timestamp,
    logId,
    documentId
  });
  
  // If we have a log ID, update the existing log entry
  if (logId) {
    try {
      await supabase
        .from('document_verification_logs')
        .update({
          status: 'error',
          failure_reason: error.message,
          verification_details: {
            error_category: error.category,
            error_details: JSON.stringify(error.details)
          },
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);
    } catch (logError) {
      // Just log to console if updating the DB fails
      console.error('Failed to update error log:', logError, {
        originalError: error,
        timestamp: new Date().toISOString()
      });
    }
  }
}

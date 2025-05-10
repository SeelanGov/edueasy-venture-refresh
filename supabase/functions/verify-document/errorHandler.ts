
// Define error categories for better error reporting
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  FILE = 'FILE',
  DATABASE = 'DATABASE',
  OCR = 'OCR',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN'
}

// Error interface for structured error reporting
export interface VerificationError {
  category: ErrorCategory;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Handle document verification errors systematically
 */
export async function handleError(
  error: VerificationError, 
  supabase: any, 
  logId?: string, 
  documentId?: string
): Promise<void> {
  console.error(`[${error.category}] ${error.message}`, {
    details: error.details,
    timestamp: error.timestamp
  });
  
  try {
    // Log error to system_error_logs table
    const { data, error: logError } = await supabase
      .from('system_error_logs')
      .insert({
        message: error.message,
        category: 'DOCUMENT_VERIFICATION',
        severity: getCategorySeverity(error.category),
        component: 'verify-document',
        action: 'OCR_PROCESSING',
        details: {
          errorCategory: error.category,
          documentId: documentId,
          timestamp: error.timestamp,
          logId: logId,
          errorDetails: error.details
        }
      });
      
    if (logError) {
      console.error('Failed to log error to system_error_logs:', logError);
    }
    
    // Update verification log if we have a log ID
    if (logId) {
      const { error: updateError } = await supabase
        .from('document_verification_logs')
        .update({
          status: 'error',
          failure_reason: error.message,
          completed_at: new Date().toISOString(),
          verification_details: {
            error: true,
            errorCategory: error.category,
            timestamp: error.timestamp
          }
        })
        .eq('id', logId);
        
      if (updateError) {
        console.error('Failed to update verification log:', updateError);
      }
    }
  } catch (err) {
    console.error('Error in error handler:', err);
  }
}

/**
 * Map error category to severity level
 */
function getCategorySeverity(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
    case ErrorCategory.API:
    case ErrorCategory.OCR:
      return 'WARNING';
      
    case ErrorCategory.VALIDATION:
    case ErrorCategory.FILE:
      return 'INFO';
      
    case ErrorCategory.DATABASE:
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.PERMISSION:
      return 'ERROR';
      
    case ErrorCategory.UNKNOWN:
    default:
      return 'ERROR';
  }
}

/**
 * Get user-friendly error message based on error category
 */
export function getUserFriendlyErrorMessage(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Connection issues occurred while processing your document. Please try again when you have a stable internet connection.';
      
    case ErrorCategory.API:
    case ErrorCategory.OCR:
      return 'We encountered technical issues while processing your document. Please try again in a few minutes.';
      
    case ErrorCategory.VALIDATION:
      return 'Your document could not be validated. Please ensure it meets the requirements and try again.';
      
    case ErrorCategory.FILE:
      return 'There was an issue with your document file. Please ensure it\'s a valid image (JPG, PNG) and try again.';
      
    case ErrorCategory.DATABASE:
      return 'We couldn\'t save your verification results. Please try again or contact support if the issue persists.';
      
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.PERMISSION:
      return 'You don\'t have permission to verify this document. Please log in again or contact support.';
      
    case ErrorCategory.UNKNOWN:
    default:
      return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }
}

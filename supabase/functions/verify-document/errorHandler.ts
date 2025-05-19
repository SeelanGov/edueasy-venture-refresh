// Unified error categories for both frontend and backend
export enum ErrorCategory {
  AUTHENTICATION = "AUTHENTICATION",
  DATABASE = "DATABASE",
  NETWORK = "NETWORK",
  FILE = "FILE",
  VALIDATION = "VALIDATION",
  API = "API",
  OCR = "OCR",
  PERMISSION = "PERMISSION",
  UNKNOWN = "UNKNOWN"
}

// Unified error interface
export interface AppError {
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: string;
}

/**
 * Handle document verification errors systematically (unified signature)
 */
export async function handleError(
  error: AppError,
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
        log_id: logId,
        document_id: documentId,
        error_category: error.category,
        error_message: error.message,
        error_details: error.details,
        timestamp: error.timestamp || new Date().toISOString(),
      });
    if (logError) {
      console.error('Failed to log error to system_error_logs', logError);
    }
  } catch (e) {
    console.error('Error during error logging', e);
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

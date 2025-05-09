
import { toast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Error categories for different types of errors
 */
export enum ErrorCategory {
  AUTHENTICATION = "authentication",
  DATABASE = "database",
  NETWORK = "network",
  FILE = "file",
  VALIDATION = "validation",
  UNKNOWN = "unknown",
}

/**
 * Standardized error object
 */
export interface StandardError {
  message: string;
  category: ErrorCategory;
  originalError?: unknown;
}

/**
 * Parse an error into a standardized format
 */
export const parseError = (error: unknown): StandardError => {
  // Handle PostgreSQL/Supabase errors
  if (typeof error === "object" && error !== null && "code" in error) {
    const pgError = error as PostgrestError;
    
    // Authentication errors
    if (pgError.code === "PGRST301" || pgError.code === "42501") {
      return {
        message: "You don't have permission to perform this action",
        category: ErrorCategory.AUTHENTICATION,
        originalError: error,
      };
    }
    
    // Database errors
    return {
      message: pgError.message || "Database error occurred",
      category: ErrorCategory.DATABASE,
      originalError: error,
    };
  }
  
  // Handle network errors
  if (error instanceof Error && 
     (error.message.includes("network") || error.message.includes("fetch"))) {
    return {
      message: "Network connection error. Please check your internet connection",
      category: ErrorCategory.NETWORK,
      originalError: error,
    };
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    // File errors
    if (error.message.includes("file") || error.message.includes("upload")) {
      return {
        message: "Error processing file: " + error.message,
        category: ErrorCategory.FILE,
        originalError: error,
      };
    }
    
    // Validation errors
    if (error.message.includes("validation")) {
      return {
        message: error.message,
        category: ErrorCategory.VALIDATION,
        originalError: error,
      };
    }
    
    // General error
    return {
      message: error.message,
      category: ErrorCategory.UNKNOWN,
      originalError: error,
    };
  }
  
  // Fallback
  return {
    message: "An unexpected error occurred",
    category: ErrorCategory.UNKNOWN,
    originalError: error,
  };
};

/**
 * Handle an error with standardized logging and user feedback
 */
export const handleError = (
  error: unknown, 
  userMessage?: string,
  showToast: boolean = true
): StandardError => {
  const standardError = parseError(error);
  
  // Always log to console
  console.error(
    `[${standardError.category.toUpperCase()}]`, 
    standardError.message, 
    standardError.originalError
  );
  
  // Show toast notification if requested
  if (showToast) {
    toast({
      title: userMessage || "Error",
      description: standardError.message,
      variant: "destructive",
    });
  }
  
  return standardError;
};

/**
 * Try/catch wrapper for async functions with standardized error handling
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string,
  showToast: boolean = true
): Promise<{ data: T | null; error: StandardError | null }> {
  try {
    const result = await asyncFn();
    return { data: result, error: null };
  } catch (error) {
    const standardError = handleError(error, errorMessage, showToast);
    return { data: null, error: standardError };
  }
}

import { type ErrorCategory  } from '@/utils/errorHandler';
import { ErrorSeverity  } from '@/utils/errorLogging';

export { ErrorSeverity };



/**
 * Represents detailed error information for the application
 */
export interface ErrorDetails {
  /**
   * The error message to display
   */
  message: string;

  /**
   * The category of the error for classification
   */
  category: ErrorCategory;

  /**
   * The severity level of the error
   */
  severity: ErrorSeverity;

  /**
   * The component where the error occurred
   */
  component?: string;

  /**
   * The action being performed when the error occurred
   */
  action?: string;

  /**
   * Optional stack trace for debugging
   */
  stack?: string;

  /**
   * Time when the error occurred
   */
  timestamp: string;

  /**
   * Optional unique identifier for the error
   */
  id?: string;

  /**
   * Whether the error has been reported to the server
   */
  reported?: boolean;

  /**
   * Additional context about the error
   */
  context?: Record<string, unknown>;
}

/**
 * Configuration for error handling behavior
 */
export interface ErrorHandlingConfig {
  /**
   * Whether to show toast notifications for errors
   */
  showToasts: boolean;

  /**
   * Whether to log errors to the server
   */
  logToServer: boolean;

  /**
   * Minimum severity level to report to the server
   */
  reportingThreshold: ErrorSeverity;

  /**
   * Whether to collect user feedback on errors
   */
  collectFeedback: boolean;

  /**
   * Maximum number of errors to report in a session
   */
  maxReportsPerSession: number;
}

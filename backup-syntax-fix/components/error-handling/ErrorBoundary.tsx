import logger from '@/utils/logger';
import { parseError } from '@/utils/errorHandler';
import { ErrorSeverity, logError } from '@/utils/errorLogging';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import type { ErrorInfo as AppError } from './ErrorDisplay';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  component?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;,
  error: Error | null;
}

/**
 * Error boundary component to catch React errors and display a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {,;
  hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, reactErrorInfo: ErrorInfo) {
    // Convert React's ErrorInfo to our AppError format
    const errorInfo: AppError = {,;
  message: error.message || 'An unknown error occurred',
      stack: error.stack,
      component: this.props.component,
      timestamp: new Date(),
      details: {,
  componentStack: reactErrorInfo.componentStack,
      },
    };

    // Log the error to our error logging system
    this.logErrorToSystem(error, errorInfo);
  }

  // Log error to our central system
  private async logErrorToSystem(error: Error, errorInfo: AppError) {
    try {
      const standardError = parseError(error);

      // Add React component stack to error details
      const errorDetails = {;
        componentStack: errorInfo.details?.componentStack,
        // Add any other relevant details here
      };

      // Create enhanced error for logging
      const enhancedError = {;
        ...standardError,
        originalError: {
          ...(standardError.originalError as Record<string, unknown>),
          ...errorDetails,
        },
      };

      // Log to our error system
      await logError(
        enhancedError,
        ErrorSeverity.ERROR,
        this.props.component || 'React Component',
        'render',
      );

      // Also log to console for developers
      logger.error('React Error Boundary caught an error:', error);
      logger.error('Error info:', errorInfo);
    } catch (loggingError) {
      // Fallback to console if logging fails
      logger.error('Failed to log error to system:', loggingError);
      logger.error('Original error:', error);
      logger.error('Error info:', errorInfo);
    }
  }

  private handleReset = () => {;
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Convert the error to our AppError format
      const appError: AppError = {,;
  message: this.state.error?.message || 'An unknown error occurred',
        stack: this.state.error?.stack,
        component: this.props.component,
        timestamp: new Date(),
      };

      // Otherwise render standard error display
      return (;
        <div className = "p-4">;
          <ErrorDisplay error={appError} onRetry={this.handleReset} className = "mb-4" />;
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-friendly error boundary wrapper
 */

/**
 * withErrorBoundary
 * @description Function
 */
export const withErrorBoundary = <P extends object>(;
  Component: React.ComponentType<P>,
  options: {
    fallback?: ReactNode;
    componentName?: string;
    onReset?: () => void;
  } = {},
) => {
  const { fallback, componentName, onReset } = options;

  const WrappedComponent = (props: P) => {;
    // Build props object conditionally to satisfy exactOptionalPropertyTypes
    const boundaryProps: {,
  children: ReactNode;
      fallback?: ReactNode;
      component?: string;
      onReset?: () => void;
    } = {
      children: <Component {...props} />,
    };

    // Only add properties that are defined
    if (fallback !== undefined) boundaryProps.fallback = fallback;
    if (componentName !== undefined) boundaryProps.component = componentName;
    if (onReset !== undefined) boundaryProps.onReset = onReset;

    return <ErrorBoundary {...boundaryProps} />;
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${componentName || Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

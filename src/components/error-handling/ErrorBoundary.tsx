import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError, ErrorSeverity } from "@/utils/errorLogging";
import { ErrorDisplay } from "./ErrorDisplay";
import { parseError } from "@/utils/errorHandler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  component?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch React errors and display a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our error logging system
    this.logErrorToSystem(error, errorInfo);
  }

  // Log error to our central system
  private async logErrorToSystem(error: Error, errorInfo: ErrorInfo) {
    try {
      const standardError = parseError(error);
      
      // Add React component stack to error details
      const errorDetails = {
        componentStack: errorInfo.componentStack,
        // Add any other relevant details here
      };
      
      // Create enhanced error for logging
      const enhancedError = {
        ...standardError,
        originalError: { ...standardError.originalError, ...errorDetails }
      };
      
      // Log to our error system
      await logError(
        enhancedError,
        ErrorSeverity.ERROR,
        this.props.component || 'React Component',
        'render'
      );
      
      // Also log to console for developers
      console.error('React Error Boundary caught an error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    } catch (loggingError) {
      // Fallback to console if logging fails
      console.error('Failed to log error to system:', loggingError);
      console.error('Original error:', error);
      console.error('Component info:', errorInfo);
    }
  }

  private handleReset = () => {
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
      
      // Otherwise render standard error display
      return (
        <div className="p-4">
          <ErrorDisplay
            error={parseError(this.state.error || new Error("An unknown error occurred"))}
            onRetry={this.handleReset}
            className="mb-4"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-friendly error boundary wrapper
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: ReactNode;
    componentName?: string;
    onReset?: () => void;
  } = {}
) => {
  const { fallback, componentName, onReset } = options;
  
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} component={componentName} onReset={onReset}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  // Set display name for debugging
  WrappedComponent.displayName = 
    `withErrorBoundary(${componentName || Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
};

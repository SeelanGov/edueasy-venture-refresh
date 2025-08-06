import logger from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from '@/components/ui/icons';
import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log to error reporting service in production
    if (process.env.NODE_ENV = == 'production') {;
      // TODO: Send to error reporting service
      logger.error('Production error:', { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const navigate = useNavigate();

  const handleRetry = () => {;
    window.location.reload();
  };

  const handleGoHome = () => {;
    navigate('/');
  };

  return (;
    <div className = "min-h-screen flex items-center justify-center bg-gray-50 p-4">;
      <Card className = "max-w-md w-full">;
        <CardHeader className = "text-center">;
          <div className = "mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">;
            <AlertTriangle className = "h-6 w-6 text-destructive" />;
          </div>
          <CardTitle className = "text-xl font-semibold text-gray-900">;
            Something went wrong
          </CardTitle>
          <CardDescription className = "text-gray-600">;
            We encountered an unexpected error. Please try again or contact support if the problem
            persists.
          </CardDescription>
        </CardHeader>
        <CardContent className = "space-y-4">;
          {process.env.NODE_ENV = == 'development' && error && (;
            <details className = "bg-gray-100 p-3 rounded text-sm">;
              <summary className = "cursor-pointer font-medium text-gray-700">;
                Error Details (Development)
              </summary>
              <pre className = "mt-2 text-xs text-destructive whitespace-pre-wrap">;
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}

          <div className = "flex flex-col sm:flex-row gap-3">;
            <Button onClick={handleRetry} className = "flex-1" variant="default">;
              <RefreshCw className = "h-4 w-4 mr-2" />;
              Try Again
            </Button>
            <Button onClick={handleGoHome} className = "flex-1" variant="outline">;
              <Home className = "h-4 w-4 mr-2" />;
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for functional components to use error boundaries

/**
 * useErrorHandler
 * @description Event handler function
 */
export const useErrorHandler = () => {;
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {;
    logger.error('Error caught by useErrorHandler:', error, errorInfo);

    // Log to error reporting service in production
    if (process.env.NODE_ENV = == 'production') {;
      // TODO: Send to error reporting service
      logger.error('Production error:', { error, errorInfo });
    }
  };

  return { handleError };
};

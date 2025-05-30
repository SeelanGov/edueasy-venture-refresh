import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorCategory, StandardError } from '@/utils/errorHandler';
import { AlertCircle, FileWarning, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: StandardError;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
  showDetails?: boolean;
}

export const ErrorDisplay = ({
  error,
  onRetry,
  isRetrying = false,
  className = '',
  showDetails = false,
}: ErrorDisplayProps) => {
  const getIcon = () => {
    switch (error.category) {
      case ErrorCategory.NETWORK:
        return <FileWarning className="h-4 w-4" />;
      case ErrorCategory.DATABASE:
        return <FileWarning className="h-4 w-4" />;
      case ErrorCategory.AUTHENTICATION:
        return <FileWarning className="h-4 w-4" />;
      case ErrorCategory.VALIDATION:
        return <AlertCircle className="h-4 w-4" />;
      case ErrorCategory.FILE:
        return <FileWarning className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (error.category) {
      case ErrorCategory.NETWORK:
        return 'Network Error';
      case ErrorCategory.DATABASE:
        return 'Data Error';
      case ErrorCategory.AUTHENTICATION:
        return 'Authentication Error';
      case ErrorCategory.VALIDATION:
        return 'Validation Error';
      case ErrorCategory.FILE:
        return 'File Error';
      default:
        return 'Error';
    }
  };

  const getVariant = () => {
    switch (error.category) {
      case ErrorCategory.VALIDATION:
        return 'default';
      default:
        return 'destructive';
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle>{getTitle()}</AlertTitle>
      <AlertDescription>
        <p>{error.message}</p>

        {showDetails && error.originalError && (
          <details className="mt-2 text-xs">
            <summary>Technical details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
              {JSON.stringify(error.originalError, null, 2)}
            </pre>
          </details>
        )}

        {onRetry && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

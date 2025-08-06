import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  action?: string;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  details?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

interface ErrorDisplayProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

/**
 * ErrorDisplay
 * @description Function
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = '',
}) => {
  const getSeverityColor = (severity: string = 'medium') => {
    switch (severity) {
      case 'low':
        return 'border-warning/20 bg-warning/10';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'critical':
        return 'border-destructive/20 bg-destructive/10';
      default:
        return 'border-primary/20 bg-primary/10';
    }
  };

  const renderErrorDetails = () => {
    if (!showDetails) return null;

    return (
      <div className="mt-4 space-y-2">
        {error.component && (
          <div className="text-sm">
            <span className="font-medium">Component:</span> {error.component}
          </div>
        )}
        {error.action && (
          <div className="text-sm">
            <span className="font-medium">Action:</span> {error.action}
          </div>
        )}
        {error.stack && (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Stack Trace</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
          </details>
        )}
        {error.details && Object.keys(error.details).length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">
              {typeof error.details === 'string'
                ? error.details
                : JSON.stringify(error.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <Card className={`w-full ${getSeverityColor(error.severity)} ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-lg">Something went wrong</CardTitle>
        </div>
        <CardDescription>{error.message}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderErrorDetails()}

        <div className="flex gap-2 mt-4">
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button onClick={onDismiss} size="sm" variant="ghost">
              Dismiss
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

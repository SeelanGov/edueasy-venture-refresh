import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { WifiOff, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfflineErrorDisplayProps {
  message?: string;
  onRetryConnection?: () => void;
  isRetrying?: boolean;
  className?: string;
  timeSinceLastConnection?: number | null;
  lastConnectedTime?: Date | null;
}

/**
 * OfflineErrorDisplay
 * @description Function
 */
export const OfflineErrorDisplay = ({
  message = 'You appear to be offline. Some features may be unavailable.',
  onRetryConnection,
  isRetrying = false,
  className = '',
  timeSinceLastConnection = null,
  lastConnectedTime = null,
}: OfflineErrorDisplayProps): JSX.Element => {
  // Format the time since last connection
  const formatTimeSince = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours`;
  };

  return (
    <Alert
      className={`border-warning/20 bg-warning/10 text-warning dark:border-warning/20 dark:bg-warning/10 dark:text-warning ${className}`}
    >
      <WifiOff className="h-4 w-4 text-warning" />
      <AlertTitle>Connection Lost</AlertTitle>
      <AlertDescription>
        <p>{message}</p>

        {lastConnectedTime && timeSinceLastConnection && timeSinceLastConnection > 10 && (
          <div className="flex items-center mt-2 text-xs text-amber-600 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last online {formatTimeSince(timeSinceLastConnection)} ago</span>
          </div>
        )}

        {onRetryConnection && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryConnection}
              disabled={isRetrying}
              className="border-warning/20 bg-warning/10 hover:bg-warning/20 text-warning">
              {isRetrying ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Check Connection
                </>
              )}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

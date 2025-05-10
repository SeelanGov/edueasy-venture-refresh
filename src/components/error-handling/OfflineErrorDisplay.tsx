
import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface OfflineErrorDisplayProps {
  message?: string;
  onRetryConnection?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const OfflineErrorDisplay = ({
  message = "You appear to be offline. Some features may be unavailable.",
  onRetryConnection,
  isRetrying = false,
  className = "",
}: OfflineErrorDisplayProps) => {
  return (
    <Alert className={`border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300 ${className}`}>
      <WifiOff className="h-4 w-4 text-amber-500" />
      <AlertTitle>Connection Lost</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        
        {onRetryConnection && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetryConnection}
              disabled={isRetrying}
              className="flex items-center border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900"
            >
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

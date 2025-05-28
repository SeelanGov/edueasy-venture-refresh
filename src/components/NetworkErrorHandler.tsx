import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNetwork } from '@/hooks/useNetwork';
import logger from '@/utils/logger';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NetworkErrorHandlerProps {
  onRetry?: () => void;
  children: React.ReactNode;
}

/**
 * NetworkErrorHandler component that provides a consistent UI for handling network errors
 * and offline states throughout the application.
 */
export const NetworkErrorHandler = ({ onRetry, children }: NetworkErrorHandlerProps) => {
  const { isOnline } = useNetwork();
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  // Handle offline state with a delay to avoid flashing during quick connectivity changes
  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => setShowOfflineWarning(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOfflineWarning(false);
      // Reset network error state when back online
      if (hasNetworkError) {
        setHasNetworkError(false);
      }
    }
  }, [isOnline, hasNetworkError]);

  // Function to handle API request errors
  const handleNetworkError = (error: Error) => {
    logger.error('Network error:', error);
    setHasNetworkError(true);
  };

  // Function to retry the operation
  const handleRetry = () => {
    setHasNetworkError(false);
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior is to reload the current page
      window.location.reload();
    }
  };

  // If offline or has network error, show appropriate UI
  if (!isOnline && showOfflineWarning) {
    return (
      <div className="container mx-auto max-w-md py-10">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>Some features may be limited while you're offline.</AlertDescription>
        </Alert>

        <div className="text-center">
          <WifiOff className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">No Internet Connection</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            You can still access some features, but you'll need to reconnect to submit applications.
          </p>
          <Button onClick={handleRetry} className="bg-cap-teal hover:bg-cap-teal/90">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (hasNetworkError) {
    return (
      <div className="container mx-auto max-w-md py-10">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Network Error</AlertTitle>
          <AlertDescription>We're having trouble connecting to our servers.</AlertDescription>
        </Alert>

        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Connection Problem</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            There was a problem with your network connection. Please check your internet and try
            again.
          </p>
          <Button onClick={handleRetry} className="bg-cap-teal hover:bg-cap-teal/90">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Expose the handleNetworkError function to children
  return <>{children}</>;
};

// Export a hook that can be used to handle network errors in components
export const useNetworkErrorHandler = () => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    logger.error('Network error caught by hook:', error);
    setHasError(true);
    return error;
  };

  const resetError = () => {
    setHasError(false);
  };

  return {
    hasError,
    handleError,
    resetError,
  };
};

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNetwork } from '@/hooks/useNetwork';
import { AlertCircle, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
}

/**
 * NetworkErrorHandler
 * @description Event handler function
 */
export const NetworkErrorHandler = ({ children }: NetworkErrorHandlerProps) => {
  const { isOnline } = useNetwork();
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => setShowOfflineWarning(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOfflineWarning(false);
      return undefined;
    }
  }, [isOnline]);

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
          <p className="mb-4 text-gray-600">
            You can still access some features, but you'll need to reconnect to submit applications.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-cap-teal hover:bg-cap-teal/90"
          >
            Try Again
          </Button>
        </div>

        {children}
      </div>
    );
  }

  return <>{children}</>;
};

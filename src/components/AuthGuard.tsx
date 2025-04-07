
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';
import { useNetwork } from '@/hooks/useNetwork';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, WifiOff } from 'lucide-react';
import { Button } from './ui/button';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const { isOnline } = useNetwork();
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  useEffect(() => {
    // Show offline warning after a delay to avoid flashing during quick connectivity changes
    if (!isOnline) {
      const timer = setTimeout(() => setShowOfflineWarning(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOfflineWarning(false);
    }
  }, [isOnline]);

  // If authentication is still loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Show offline warning if applicable
  if (!isOnline && showOfflineWarning) {
    return (
      <div className="container mx-auto max-w-md py-10">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>
            Some features may be limited while you're offline.
          </AlertDescription>
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

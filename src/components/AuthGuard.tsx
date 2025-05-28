import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';
import { useNetwork } from '@/hooks/useNetwork';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import logger from '@/utils/logger';

interface AuthGuardProps {
  children: ReactNode;
  requiresAuth?: boolean;
}

export const AuthGuard = ({ children, requiresAuth = true }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const { isOnline } = useNetwork();
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show offline warning after a delay to avoid flashing during quick connectivity changes
    if (!isOnline) {
      const timer = setTimeout(() => setShowOfflineWarning(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOfflineWarning(false);
    }
  }, [isOnline]);

  logger.debug('AuthGuard rendering:', {
    loading,
    user: !!user,
    userID: user?.id,
    path: location.pathname,
  });

  // If authentication is still loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Handle authentication rules
  if (requiresAuth && !user) {
    // If this route requires authentication and user is not logged in, redirect to login
    logger.debug('User not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is logged in but accesses auth pages (login, register, etc.), redirect to dashboard
  if (
    !requiresAuth &&
    user &&
    (location.pathname === '/login' || location.pathname === '/register')
  ) {
    logger.debug('User already authenticated, redirecting to dashboard');
    // Check if there's a specific "from" location to navigate to
    const targetPath = location.state?.from || '/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  // Show offline warning if applicable
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

  logger.debug('AuthGuard passing through - user authenticated:', user?.id);
  return <>{children}</>;
};

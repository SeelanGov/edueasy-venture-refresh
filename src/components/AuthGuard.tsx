import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  requiresAuth?: boolean;
}

/**
 * AuthGuard
 * @description Function
 */
export const AuthGuard = ({ children, requiresAuth = true }: AuthGuardProps): void => {
  const { user, loading } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is logged in but accesses auth pages, redirect to dashboard
  if (
    !requiresAuth &&
    user &&
    (location.pathname === '/login' || location.pathname === '/register')
  ) {
    const targetPath = location.state?.from || '/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};

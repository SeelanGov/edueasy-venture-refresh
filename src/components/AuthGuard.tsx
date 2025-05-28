
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';

interface AuthGuardProps {
  children: ReactNode;
  requiresAuth?: boolean;
}

export const AuthGuard = ({ children, requiresAuth = true }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("AuthGuard rendering:", { loading, user: !!user, userID: user?.id, path: location.pathname });

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
    console.log("User not authenticated, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is logged in but accesses auth pages, redirect to dashboard
  if (!requiresAuth && user && (location.pathname === '/login' || location.pathname === '/register')) {
    console.log("User already authenticated, redirecting to dashboard");
    const targetPath = location.state?.from || "/dashboard";
    return <Navigate to={targetPath} replace />;
  }

  console.log("AuthGuard passing through - user authenticated:", user?.id);
  return <>{children}</>;
};

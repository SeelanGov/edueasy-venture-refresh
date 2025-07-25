import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface SponsorGuardProps {
  children: ReactNode;
}


/**
 * SponsorGuard
 * @description Function
 */
export const SponsorGuard = ({ children }: SponsorGuardProps): void => {
  const { userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (userType !== 'sponsor') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

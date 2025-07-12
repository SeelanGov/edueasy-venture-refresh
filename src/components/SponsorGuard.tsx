import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/Spinner';

interface SponsorGuardProps {
  children: ReactNode;
}

export const SponsorGuard = ({ children }: SponsorGuardProps) => {
  const { userType, loading } = useAuth();
  const location = useLocation();

  console.log("SponsorGuard check:", { userType, loading, path: location.pathname });

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
    console.log("SponsorGuard: Access denied - user is not a sponsor");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("SponsorGuard: Access granted for sponsor");
  return <>{children}</>;
};
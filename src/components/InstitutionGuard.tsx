import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/Spinner';

interface InstitutionGuardProps {
  children: ReactNode;
}

export const InstitutionGuard = ({ children }: InstitutionGuardProps) => {
  const { userType, loading } = useAuth();
  const location = useLocation();

  console.log('InstitutionGuard check:', { userType, loading, path: location.pathname });

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

  if (userType !== 'institution') {
    console.log('InstitutionGuard: Access denied - user is not an institution');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('InstitutionGuard: Access granted for institution');
  return <>{children}</>;
};

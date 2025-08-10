import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

interface InstitutionGuardProps {
  children: ReactNode;
}

/**
 * InstitutionGuard
 * @description Function
 */
export const InstitutionGuard = ({ children }: InstitutionGuardProps): JSX.Element => {
  const { userType } = useAuth();
  const [loading, setLoading] = useState(true);

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
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

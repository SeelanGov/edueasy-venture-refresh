import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PartnerGuardProps {
  children: ReactNode;
}

/**
 * PartnerGuard
 * @description Protects partner-only routes (institutions registered via partner portal)
 */
export const PartnerGuard = ({ children }: PartnerGuardProps): JSX.Element => {
  const { user, userType, loading } = useAuth();

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

  // Only allow institution user_type (partners register as institutions)
  if (!user || userType !== 'institution') {
    return <Navigate to="/partner/login" replace />;
  }

  return <>{children}</>;
};

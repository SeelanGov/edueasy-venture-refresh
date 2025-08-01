import { Spinner } from '@/components/Spinner';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthGuardProps {
  children: ReactNode;
}

/**
 * AdminAuthGuard
 * @description Function
 */
export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication first
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    // Then check for admin role
    if (!roleLoading && !isAdmin && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

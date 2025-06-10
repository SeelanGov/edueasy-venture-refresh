
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/Spinner';

interface VerificationGuardProps {
  children: ReactNode;
}

export const VerificationGuard = ({ children }: VerificationGuardProps) => {
  const { user, loading } = useAuth();

  // If authentication is still loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Check if user is verified once we have the user profile data
  // For now, assume all authenticated users need verification
  // This would be replaced with actual verification status check
  // if (!user.id_verified) {
  //   return <Navigate to="/verification-required" replace />;
  // }

  return <>{children}</>;
};

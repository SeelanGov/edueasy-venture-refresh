import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const RoleBasedRedirect = () => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route users to appropriate dashboards based on their role
  switch (userType) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'sponsor':
      return <Navigate to="/sponsors/dashboard" replace />;
    case 'institution':
      return <Navigate to="/institutions/dashboard" replace />;
    case 'nsfas':
      return <Navigate to="/dashboard" replace />;
    case 'consultant':
      return <Navigate to="/dashboard" replace />;
    case 'student':
      return <Navigate to="/dashboard" replace />;
    default:
      // If userType is null or unknown, redirect to login
      return <Navigate to="/login" replace />;
  }
};

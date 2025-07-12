import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/Spinner';

export const RoleBasedRedirect = () => {
  const { userType, loading } = useAuth();

  console.log("RoleBasedRedirect:", { userType, loading });

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

  // Route users to appropriate dashboards based on their role
  switch (userType) {
    case 'admin':
      console.log("RoleBasedRedirect: Routing admin to admin dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    case 'sponsor':
      console.log("RoleBasedRedirect: Routing sponsor to sponsor dashboard");
      return <Navigate to="/sponsors/dashboard" replace />;
    case 'institution':
      console.log("RoleBasedRedirect: Routing institution to institution dashboard");
      return <Navigate to="/institutions/dashboard" replace />;
    case 'student':
      console.log("RoleBasedRedirect: Routing student to main dashboard");
      return <Navigate to="/dashboard" replace />;
    default:
      console.log("RoleBasedRedirect: Unknown or null userType, redirecting to login");
      return <Navigate to="/login" replace />;
  }
};
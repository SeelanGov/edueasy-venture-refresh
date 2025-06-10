
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuthGuardProps {
  children: ReactNode;
}

export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication first
    if (!authLoading && !user) {
      console.log('No user found, redirecting to login');
      navigate("/", { replace: true });
      return;
    }
    
    // Then check for admin role
    if (!roleLoading && !isAdmin && user) {
      console.log('User is not admin, redirecting to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

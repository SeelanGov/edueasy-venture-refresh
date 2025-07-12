
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "@/components/Spinner";

interface VerificationGuardProps {
  children: ReactNode;
}

/**
 * Restricts access unless user is both authenticated AND verified (id_verified === true).
 * Redirects user to /verification-required if not verified, or shows spinner if loading.
 */
export const VerificationGuard = ({ children }: VerificationGuardProps) => {
  const { user, userType, loading } = useAuth();
  const location = useLocation();

  // SSR safety + loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your account…</p>
      </div>
    );
  }

  // If not logged in, let regular AuthGuard handle
  if (!user) return null;

  // Admin bypass - skip verification for admin users
  if (userType === 'admin') {
    return <>{children}</>;
  }

  // If not verified, redirect to verification-required
  // id_verified comes as a boolean custom claim in user.user_metadata if mapped properly
  const isVerified = (user as any)?.user_metadata?.id_verified === true || (user as any)?.id_verified === true;

  if (!isVerified) {
    return <Navigate to="/verification-required" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

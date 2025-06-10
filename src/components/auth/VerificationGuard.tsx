
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/admin/shared/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VerificationGuardProps {
  children: React.ReactNode;
}

export const VerificationGuard: React.FC<VerificationGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id_verified, tracking_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking verification status:', error);
          setIsVerified(false);
        } else {
          setIsVerified(data?.id_verified || false);
          
          // If not verified, redirect to verification required page
          if (!data?.id_verified) {
            navigate('/verification-required');
          }
        }
      } catch (error) {
        console.error('Verification check failed:', error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkVerificationStatus();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <LoadingSpinner text="Checking verification status..." />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isVerified === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Identity verification required. Redirecting...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isVerified === true) {
    return <>{children}</>;
  }

  return <LoadingSpinner text="Loading..." />;
};

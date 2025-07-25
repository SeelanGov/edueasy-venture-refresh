import { supabase } from '@/integrations/supabase/client';
import { hasValidConsent } from '@/utils/consent-recording';
import { useState } from 'react';

interface VerifyIDResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface UseVerifyIDReturn {
  verifyId: (userId: string, idNumber: string) => Promise<VerifyIDResult>;
  isLoading: boolean;
  error: string | null;
}

export const useVerifyID = (): UseVerifyIDReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyId = async (userId: string, idNumber: string): Promise<VerifyIDResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Check if user has valid consent
      const hasConsent = await hasValidConsent(userId, 'ID_verification');
      
      if (!hasConsent) {
        const errorMsg = 'ID verification consent not found. Please provide consent before verification.';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg
        };
      }

      // Step 2: Call VerifyID integration edge function
      const edgeUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'pensvamtfjtpsaoeflbx'}.functions.supabase.co/verifyid-integration`;

      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          user_id: userId,
          national_id: idNumber,
          api_key: import.meta.env.VITE_VERIFYID_API_KEY
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || 'ID Verification failed. Please check your ID number and try again.';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg
        };
      }

      return {
        success: true,
        data: result
      };

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to verify ID. Please try again later.';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyId,
    isLoading,
    error
  };
};

/**
 * Hook for checking verification status
 */
export const useVerificationStatus = (userId: string) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkVerificationStatus = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('verifyid_verified, verifyid_verification_date, id_verified')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setIsVerified(data?.verifyid_verified || data?.id_verified || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check verification status');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isVerified,
    isLoading,
    error,
    checkVerificationStatus
  };
};

/**
 * Hook for getting verification audit log
 */
export const useVerificationAudit = (userId: string) => {
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLog = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('verifyid_audit_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setAuditLog(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit log');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    auditLog,
    isLoading,
    error,
    fetchAuditLog
  };
}; 
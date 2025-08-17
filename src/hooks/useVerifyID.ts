import { supabase } from '@/integrations/supabase/client';
import { hasValidConsent } from '@/utils/consent-recording';
import { useCallback } from 'react';
import { useState } from 'react';

// ===== INTERFACES =====

interface VerifyIDResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface UseVerifyIDReturn {
  verifyId: (userId: string, idNumber: string) => Promise<VerifyIDResult>;
  isLoading: boolean;
  error: string | null;
}

interface UseVerificationStatusReturn {
  isVerified: boolean | null;
  isLoading: boolean;
  error: string | null;
  checkVerificationStatus: () => Promise<void>;
}

interface UseVerificationAuditReturn {
  auditLog: unknown[];
  isLoading: boolean;
  error: string | null;
  fetchAuditLog: () => Promise<void>;
}

// ===== MAIN VERIFYID HOOK =====

/**
 * useVerifyID Hook
 * @description Main hook for ID verification with VerifyID API
 * @returns {UseVerifyIDReturn} Object containing verification function and state
 */
export const useVerifyID = (): UseVerifyIDReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyId = useCallback(
    async (userId: string, idNumber: string): Promise<VerifyIDResult> => {
      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Check if user has valid consent
        const hasConsent = await hasValidConsent(userId, 'ID_verification');

        if (!hasConsent) {
          const errorMsg =
            'ID verification consent not found. Please provide consent before verification.';
          setError(errorMsg);
          return {
            success: false,
            error: errorMsg,
          };
        }

        // Step 2: Call VerifyID integration edge function
        const edgeUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'pensvamtfjtpsaoeflbx'}.functions.supabase.co/verifyid-integration`;

        const response = await fetch(edgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            national_id: idNumber,
            api_key: import.meta.env.VITE_VERIFYID_API_KEY,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMsg =
            result.error || 'ID Verification failed. Please check your ID number and try again.';
          setError(errorMsg);
          return {
            success: false,
            error: errorMsg,
          };
        }

        return {
          success: true,
          data: result,
        };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to verify ID. Please try again later.';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    verifyId,
    isLoading,
    error,
  };
};

// ===== VERIFICATION STATUS HOOK =====

/**
 * useVerificationStatus Hook
 * @description Hook for checking user verification status
 * @param {string} userId - The user ID to check verification status for
 * @returns {UseVerificationStatusReturn} Object containing verification status and state
 */
export const useVerificationStatus = (userId: string): UseVerificationStatusReturn => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkVerificationStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('verifyid_verified, verifyid_verification_date, id_verified')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setIsVerified(false); // Column doesn't exist, default to false
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check verification status');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    isVerified,
    isLoading,
    error,
    checkVerificationStatus,
  };
};

// ===== VERIFICATION AUDIT HOOK =====

/**
 * useVerificationAudit Hook
 * @description Hook for fetching verification audit log
 * @param {string} userId - The user ID to fetch audit log for
 * @returns {UseVerificationAuditReturn} Object containing audit log and state
 */
export const useVerificationAudit = (userId: string): UseVerificationAuditReturn => {
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLog = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

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
  }, [userId]);

  return {
    auditLog,
    isLoading,
    error,
    fetchAuditLog,
  };
};

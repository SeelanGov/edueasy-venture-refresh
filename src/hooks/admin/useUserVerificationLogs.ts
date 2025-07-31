import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VerificationLog {
  id: string;
  created_at: string | null;
  verification_method: string | null;
  national_id_last4: string | null;
  result: string;
  error_message: string | null;
}

/**
 * useUserVerificationLogs
 * @description Function
 */
export function useUserVerificationLogs(userId?: string): { logs: VerificationLog[]; loading: boolean } {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('verification_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setLogs(data as VerificationLog[]);
        }
        setLoading(false);
      });
  }, [userId]);

  return { logs, loading };
}

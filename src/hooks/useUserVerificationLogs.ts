import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VerificationLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
  user_id: string;
}

/**
 * useUserVerificationLogs
 * @description Hook to fetch user verification logs
 */
export const useUserVerificationLogs = (userId?: string) => {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        // Mock implementation - replace with actual Supabase query
        const { data, error } = await supabase
          .from('system_error_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setLogs((data || []).map(item => ({
          id: item.id,
          action: item.action || 'unknown',
          details: String(item.details || ''),
          created_at: item.occurred_at || new Date().toISOString(),
          user_id: item.user_id || userId
        })));
      } catch (error) {
        console.error('Error fetching verification logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId]);

  return { logs };
};

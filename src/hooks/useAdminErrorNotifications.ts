import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ErrorSeverity } from '@/utils/errorLogging';
import logger from '../utils/logger';

export interface ErrorLogEntry {
  id: string;
  message: string;
  category: string;
  severity: ErrorSeverity;
  component?: string;
  action?: string;
  user_id?: string;
  details?: Record<string, unknown>;
  occurred_at: string;
  is_resolved: boolean;
}

export interface ErrorNotification {
  id: string;
  message: string;
  severity: ErrorSeverity;
  component: string;
  action: string;
  created_at: string;
  is_resolved: boolean;
}

/**
 * Hook for fetching and managing system error logs for admins
 */

/**
 * useAdminErrorNotifications
 * @description Function
 */
export const useAdminErrorNotifications = (): void => {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newErrors, setNewErrors] = useState(false);

  // Fetch error notifications from the server
  const fetchErrorNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use direct query instead of RPC function
      const { data, error } = await supabase
        .from('system_error_logs')
        .select('*')
        .eq('is_resolved', false)
        .order('occurred_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      if (data) {
        const formattedNotifications = data.map((log) => ({
          id: log.id,
          message: log.message,
          severity: log.severity as ErrorSeverity,
          component: log.component || 'Unknown',
          action: log.action || 'Unknown',
          created_at: log.occurred_at,
          is_resolved: log.is_resolved,
        }));

        setNotifications(formattedNotifications);
        setNewErrors(formattedNotifications.some((note) => !note.is_resolved));
      }
    } catch (err: unknown) {
      console.error('Error fetching error notifications:', err);
      setError(err.message || 'Failed to load error notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark an error as resolved
  const markAsResolved = useCallback(async (errorId: string, resolutionNotes: string) => {
    try {
      // Use direct table access instead of RPC function
      const { error } = await supabase
        .from('system_error_logs')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
          resolution_notes: resolutionNotes,
        })
        .eq('id', errorId);

      if (error) throw error;

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === errorId ? { ...n, is_resolved: true } : n)),
      );

      // Show success message
      toast('Error marked as resolved');

      return true;
    } catch (err: unknown) {
      console.error('Error marking notification as resolved:', err);
      toast('Failed to mark error as resolved');
      return false;
    }
  }, []);

  // Load errors on mount
  useEffect(() => {
    logger.info('Fetching error notifications...');
    fetchErrorNotifications();

    // Set up real-time subscription for new errors via postgres changes
    // This will require enabling realtime for the system_error_logs table
    const channel = supabase
      .channel('system_error_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_error_logs',
        },
        () => {
          fetchErrorNotifications();

          // Show notification for new errors
          toast('New system error detected', {
            description: 'Check the admin dashboard for details',
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchErrorNotifications]);

  return {
    notifications,
    loading,
    error,
    newErrors,
    fetchErrorNotifications,
    markAsResolved,
  };
};

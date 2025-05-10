
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ErrorSeverity } from "@/utils/errorLogging";

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
export const useAdminErrorNotifications = () => {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newErrors, setNewErrors] = useState(false);
  
  // Fetch error notifications from the server
  const fetchErrorNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use RPC function to get error logs
      const { data, error } = await supabase.rpc('get_error_logs');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedNotifications = data.map((log: ErrorLogEntry) => ({
          id: log.id,
          message: log.message,
          severity: log.severity,
          component: log.component || 'Unknown',
          action: log.action || 'Unknown',
          created_at: log.occurred_at,
          is_resolved: log.is_resolved
        }));
        
        setNotifications(formattedNotifications);
        setNewErrors(formattedNotifications.some(note => !note.is_resolved));
      }
    } catch (err: any) {
      console.error("Error fetching error notifications:", err);
      setError(err.message || "Failed to load error notifications");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Mark an error as resolved
  const markAsResolved = useCallback(async (errorId: string, resolutionNotes: string) => {
    try {
      const { error } = await supabase.rpc(
        'resolve_error_log',
        {
          error_id: errorId,
          resolution_notes: resolutionNotes
        }
      );
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === errorId ? { ...n, is_resolved: true } : n)
      );
      
      // Show success message
      toast("Error marked as resolved");
      
      return true;
    } catch (err: any) {
      console.error("Error marking notification as resolved:", err);
      toast("Failed to mark error as resolved");
      return false;
    }
  }, []);
  
  // Load errors on mount
  useEffect(() => {
    fetchErrorNotifications();
    
    // Set up real-time subscription for new errors
    const subscription = supabase
      .channel('system_error_logs')
      .on('postgres_changes', {
        event: 'INSERT', 
        schema: 'public', 
        table: 'system_error_logs'
      }, payload => {
        fetchErrorNotifications();
        
        // Show notification for new critical errors
        const severity = payload.new?.severity;
        if (severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.ERROR) {
          toast("New critical error detected in the system");
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchErrorNotifications]);
  
  return {
    notifications,
    loading,
    error,
    newErrors,
    fetchErrorNotifications,
    markAsResolved
  };
};

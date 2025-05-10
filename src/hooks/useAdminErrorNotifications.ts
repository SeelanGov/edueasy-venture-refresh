
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ErrorSeverity } from "@/utils/errorLogging";
import { ErrorCategory } from "@/utils/errorHandler";
import { ErrorLogEntry } from "@/types/database.types";

export interface ErrorNotification {
  id: string;
  message: string;
  severity: ErrorSeverity;
  component?: string;
  action?: string;
  created_at: string;
  is_resolved: boolean;
}

export const useAdminErrorNotifications = (
  autoRefreshInterval = 300000, // 5 minutes
  onlyCritical = true
) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .rpc('is_admin', { user_uuid: user.id });
          
        if (error) throw error;
        setIsAdmin(!!data);
      } catch (err: any) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  // Fetch error notifications
  const fetchNotifications = async () => {
    if (!user || !isAdmin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Using RPC function for fetching error logs
      const { data: errorLogs, error: fetchError } = await supabase
        .rpc('get_error_logs', { 
          critical_only: onlyCritical, 
          limit_count: 20 
        });
      
      if (fetchError) throw fetchError;
      
      if (Array.isArray(errorLogs)) {
        // Map the error logs to the format we expect
        const formattedNotifications: ErrorNotification[] = errorLogs.map((log: ErrorLogEntry) => ({
          id: log.id,
          message: log.message,
          severity: log.severity as ErrorSeverity,
          component: log.component,
          action: log.action,
          created_at: log.occurred_at,
          is_resolved: log.is_resolved
        }));
        
        setNotifications(formattedNotifications);
      } else {
        console.error("Unexpected response format:", errorLogs);
        setNotifications([]);
      }
    } catch (err: any) {
      console.error("Error fetching error notifications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Mark notification as resolved
  const resolveNotification = async (
    id: string, 
    resolution: string = "Marked as resolved by admin"
  ) => {
    if (!user || !isAdmin) return false;
    
    try {
      // Use RPC to resolve error
      const { data, error: updateError } = await supabase
        .rpc('resolve_error_log', {
          error_id: id,
          resolver_id: user.id,
          resolution_notes: resolution
        });
        
      if (updateError) throw updateError;
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      
      toast({
        description: "Error log successfully resolved"
      });
      
      return true;
    } catch (err: any) {
      console.error("Error resolving notification:", err);
      toast({
        description: "Failed to resolve notification"
      });
      return false;
    }
  };
  
  // Auto-refresh notifications
  useEffect(() => {
    if (!isAdmin) return;
    
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, autoRefreshInterval);
    
    // Set up real-time subscription for new critical errors
    const channel = supabase
      .channel('error-notifications')
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'system_error_logs',
          filter: onlyCritical ? `severity=eq.${ErrorSeverity.CRITICAL}` : undefined
        },
        () => {
          // Simply refresh the notifications when a new error is inserted
          fetchNotifications();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [isAdmin, autoRefreshInterval, onlyCritical]);
  
  return {
    isAdmin,
    notifications,
    loading,
    error,
    fetchNotifications,
    resolveNotification
  };
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ErrorSeverity } from "@/utils/errorLogging";

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
      } catch (err) {
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
      let query = supabase
        .from("system_error_logs")
        .select("id, message, severity, component, action, created_at, is_resolved")
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(20);
        
      if (onlyCritical) {
        query = query.eq("severity", ErrorSeverity.CRITICAL);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setNotifications(data || []);
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
      const { error: updateError } = await supabase
        .from("system_error_logs")
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user.id,
          resolution_notes: resolution
        })
        .eq("id", id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      
      return true;
    } catch (err: any) {
      console.error("Error resolving notification:", err);
      toast.error("Failed to resolve notification");
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
        payload => {
          const newError = payload.new as ErrorNotification;
          
          if (!newError.is_resolved) {
            // Add to notifications list
            setNotifications(prev => [newError, ...prev]);
            
            // Show toast for new critical errors
            if (newError.severity === ErrorSeverity.CRITICAL) {
              toast.error("Critical System Error", {
                description: newError.message,
                duration: 8000,
              });
            }
          }
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

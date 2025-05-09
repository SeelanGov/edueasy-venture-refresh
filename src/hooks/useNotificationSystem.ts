
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner"; // Import directly from sonner package instead

export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  notification_type: string;
  related_document_id?: string;
}

export const useNotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [user]);

  // Show toast notifications for new unread notifications
  const showToastForNewNotification = useCallback((notification: Notification) => {
    // Show toast notification for important notifications
    sonnerToast(notification.title, {
      description: notification.message,
      action: {
        label: "View",
        onClick: () => {
          // If this is a document-related notification, we could eventually
          // navigate to a document detail view
          markAsRead(notification.id);
        }
      }
    });
  }, [markAsRead]);
  
  // Delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Update unread count if needed
      const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, [user, notifications]);

  // Set up subscription for real-time notifications
  useEffect(() => {
    if (!user?.id) return;
    
    // Initial fetch
    fetchNotifications();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        payload => {
          const newNotification = payload.new as Notification;
          
          // Add to local state
          setNotifications(prev => [newNotification, ...prev]);
          
          // Update unread count
          if (!newNotification.is_read) {
            setUnreadCount(prev => prev + 1);
            showToastForNewNotification(newNotification);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications, showToastForNewNotification]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications
  };
};


import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { playNotificationSound } from "@/utils/notificationSound";

export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  notification_type: string;
  related_document_id?: string;
}

export type NotificationType = "document_status" | "application_status" | "admin_feedback" | "system";

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
    if (!user?.id || unreadCount === 0) return;
    
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
  }, [user, unreadCount]);

  // Show toast notifications for new unread notifications
  const showToastForNewNotification = useCallback((notification: Notification) => {
    // Determine the action label based on notification type
    const actionLabel = notification.notification_type === 'document_status' 
      ? 'View Document' 
      : notification.notification_type === 'application_status'
      ? 'View Application'
      : 'View';
    
    // Play notification sound for all new notifications
    playNotificationSound();
    
    // Show toast notification for all notifications
    sonnerToast(notification.title, {
      description: notification.message,
      action: {
        label: actionLabel,
        onClick: () => {
          markAsRead(notification.id);
          
          // Navigate to relevant page based on notification type
          if (notification.related_document_id) {
            // If we had a document viewer, we could navigate there
            console.log("Navigate to document:", notification.related_document_id);
          }
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
      const notificationToDelete = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Update unread count if needed
      if (notificationToDelete && !notificationToDelete.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, [user, notifications]);

  // Delete all read notifications
  const deleteAllReadNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    const readNotifications = notifications.filter(n => n.is_read);
    if (readNotifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id)
        .eq("is_read", true);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.filter(n => !n.is_read));
    } catch (error) {
      console.error("Error deleting read notifications:", error);
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
    deleteAllReadNotifications,
    refreshNotifications: fetchNotifications
  };
};

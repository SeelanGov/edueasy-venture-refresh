import { supabase } from '@/integrations/supabase/client';

export interface NotificationRequest {
  userId: string;
  templateId: string;
  variables: Record<string, string>;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type?: string | null;
  is_read: boolean;
  created_at: string;
  type?: string;
  subject?: string;
  status?: string;
}

export interface UserNotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  payment_notifications: boolean;
  sponsorship_notifications: boolean;
  system_notifications: boolean;
  marketing_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  updated_at: string;
}

class NotificationService {
  /**
   * Send notification
   */
  async sendNotification(request: NotificationRequest): Promise<void> {
    try {
      // Create notification record
      const notification = {
        user_id: request.userId,
        title: 'Notification',
        message: 'You have a new notification',
        notification_type: 'system',
        is_read: false,
      };

      const { error } = await supabase.from('notifications').insert(notification);

      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async getUserPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    return {
      user_id: userId,
      email_enabled: true,
      sms_enabled: false,
      in_app_enabled: true,
      payment_notifications: true,
      sponsorship_notifications: true,
      system_notifications: true,
      marketing_notifications: false,
      updated_at: new Date().toISOString(),
    };
  }

  async getUserNotificationHistory(
    _userId: string,
    _limit?: number,
  ): Promise<NotificationRecord[]> {
    return [];
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserNotificationPreferences>,
  ): Promise<void> {
    console.log('Updating preferences for', userId, preferences);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    console.log('Marking notification as read:', notificationId);
  }
}

// Export singleton instance

/**
 * notificationService
 * @description Function
 */
export const notificationService = new NotificationService();

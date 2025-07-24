import { supabase } from '@/integrations/supabase/client';

export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms' | 'in_app';
  subject?: string;
  message: string;
  variables: string[];
  category: 'payment' | 'sponsorship' | 'system' | 'marketing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationRequest {
  userId: string;
  templateId: string;
  variables: Record<string, string>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  template_id: string;
  type: 'email' | 'sms' | 'in_app';
  subject?: string;
  message: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
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
  private templates: NotificationTemplate[] = [
    // Payment Notifications
    {
      id: 'payment-success',
      type: 'email',
      subject: 'Payment Successful - EduEasy',
      message:
        'Dear {{user_name}}, your payment of {{amount}} for {{tier}} plan has been processed successfully. Your subscription is now active.',
      variables: ['user_name', 'amount', 'tier'],
      category: 'payment',
      priority: 'high',
    },
    {
      id: 'payment-failed',
      type: 'email',
      subject: 'Payment Failed - EduEasy',
      message:
        'Dear {{user_name}}, your payment of {{amount}} for {{tier}} plan could not be processed. Please try again or contact support.',
      variables: ['user_name', 'amount', 'tier'],
      category: 'payment',
      priority: 'high',
    },
    {
      id: 'payment-reminder',
      type: 'email',
      subject: 'Payment Reminder - EduEasy',
      message:
        'Dear {{user_name}}, this is a reminder that your payment of {{amount}} for {{tier}} plan is due. Please complete your payment to continue accessing EduEasy.',
      variables: ['user_name', 'amount', 'tier'],
      category: 'payment',
      priority: 'medium',
    },
    {
      id: 'payment-success-sms',
      type: 'sms',
      message:
        'EduEasy: Payment of {{amount}} successful. Your {{tier}} subscription is now active.',
      variables: ['amount', 'tier'],
      category: 'payment',
      priority: 'high',
    },
    {
      id: 'payment-failed-sms',
      type: 'sms',
      message: 'EduEasy: Payment of {{amount}} failed. Please try again or contact support.',
      variables: ['amount'],
      category: 'payment',
      priority: 'high',
    },

    // Sponsorship Notifications
    {
      id: 'sponsorship-allocated',
      type: 'email',
      subject: 'Sponsorship Allocated - EduEasy',
      message:
        'Dear {{student_name}}, congratulations! You have been allocated a sponsorship of {{amount}} by {{sponsor_name}}. Your application fees are now covered.',
      variables: ['student_name', 'amount', 'sponsor_name'],
      category: 'sponsorship',
      priority: 'high',
    },
    {
      id: 'sponsorship-payment-received',
      type: 'email',
      subject: 'Sponsorship Payment Received - EduEasy',
      message:
        'Dear {{sponsor_name}}, thank you for your sponsorship payment of {{amount}} for {{student_name}}. The payment has been processed successfully.',
      variables: ['sponsor_name', 'amount', 'student_name'],
      category: 'sponsorship',
      priority: 'medium',
    },
    {
      id: 'sponsorship-allocated-sms',
      type: 'sms',
      message:
        'EduEasy: Congratulations! You received a sponsorship of {{amount}} from {{sponsor_name}}. Your application fees are covered.',
      variables: ['amount', 'sponsor_name'],
      category: 'sponsorship',
      priority: 'high',
    },

    // System Notifications
    {
      id: 'account-verified',
      type: 'email',
      subject: 'Account Verified - EduEasy',
      message:
        'Dear {{user_name}}, your EduEasy account has been successfully verified. You can now access all features.',
      variables: ['user_name'],
      category: 'system',
      priority: 'medium',
    },
    {
      id: 'document-approved',
      type: 'email',
      subject: 'Document Approved - EduEasy',
      message:
        'Dear {{user_name}}, your {{document_type}} has been approved. You can continue with your application.',
      variables: ['user_name', 'document_type'],
      category: 'system',
      priority: 'medium',
    },
    {
      id: 'document-rejected',
      type: 'email',
      subject: 'Document Requires Attention - EduEasy',
      message:
        'Dear {{user_name}}, your {{document_type}} requires resubmission. Please review the feedback and upload a new version.',
      variables: ['user_name', 'document_type'],
      category: 'system',
      priority: 'high',
    },

    // Marketing Notifications
    {
      id: 'welcome-email',
      type: 'email',
      subject: 'Welcome to EduEasy!',
      message:
        "Dear {{user_name}}, welcome to EduEasy! We're excited to help you on your educational journey. Get started by exploring our features.",
      variables: ['user_name'],
      category: 'marketing',
      priority: 'low',
    },
    {
      id: 'feature-update',
      type: 'email',
      subject: 'New Features Available - EduEasy',
      message:
        "Dear {{user_name}}, we've added new features to EduEasy! Check out {{feature_name}} to enhance your experience.",
      variables: ['user_name', 'feature_name'],
      category: 'marketing',
      priority: 'low',
    },
  ];

  /**
   * Send a notification using the specified template
   */
  async sendNotification(request: NotificationRequest): Promise<NotificationRecord> {
    try {
      // Get template
      const template = this.templates.find((t) => t.id === request.templateId);
      if (!template) {
        throw new Error(`Template not found: ${request.templateId}`);
      }

      // Get user preferences
      const preferences = await this.getUserPreferences(request.userId);
      if (!preferences) {
        throw new Error(`User preferences not found: ${request.userId}`);
      }

      // Check if notification type is enabled
      const typeEnabled = this.isNotificationTypeEnabled(template.type, preferences);
      if (!typeEnabled) {
        throw new Error(
          `Notification type ${template.type} is disabled for user ${request.userId}`,
        );
      }

      // Check if category is enabled
      const categoryEnabled = this.isCategoryEnabled(template.category, preferences);
      if (!categoryEnabled) {
        throw new Error(
          `Notification category ${template.category} is disabled for user ${request.userId}`,
        );
      }

      // Check quiet hours
      if (this.isInQuietHours(preferences)) {
        throw new Error(`Notification blocked due to quiet hours for user ${request.userId}`);
      }

      // Process message with variables
      const processedMessage = this.processMessage(template.message, request.variables);
      const processedSubject = template.subject
        ? this.processMessage(template.subject, request.variables)
        : undefined;

      // Create notification record
      const notificationRecord: Omit<NotificationRecord, 'id' | 'created_at' | 'updated_at'> = {
        user_id: request.userId,
        template_id: request.templateId,
        type: template.type,
        subject: processedSubject,
        message: processedMessage,
        status: 'pending',
        priority: request.priority || template.priority,
        metadata: request.metadata,
      };

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert(notificationRecord)
        .select()
        .single();

      if (error) throw error;

      // Send notification based on type
      let sendResult: boolean;
      switch (template.type) {
        case 'email':
          sendResult = await this.sendEmail(notification);
          break;
        case 'sms':
          sendResult = await this.sendSMS(notification);
          break;
        case 'in_app':
          sendResult = await this.sendInAppNotification(notification);
          break;
        default:
          throw new Error(`Unsupported notification type: ${template.type}`);
      }

      // Update notification status
      const updateData: Partial<NotificationRecord> = {
        status: sendResult ? 'sent' : 'failed',
        sent_at: sendResult ? new Date().toISOString() : undefined,
        error_message: sendResult ? undefined : 'Failed to send notification',
      };

      const { error: updateError } = await supabase
        .from('notifications')
        .update(updateData)
        .eq('id', notification.id);

      if (updateError) {
        console.error('Failed to update notification status:', updateError);
      }

      // Log notification event
      await this.logNotificationEvent(notification.id, 'notification_sent', {
        template_id: request.templateId,
        type: template.type,
        success: sendResult,
      });

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send multiple notifications in batch
   */
  async sendBatchNotifications(requests: NotificationRequest[]): Promise<NotificationRecord[]> {
    const results: NotificationRecord[] = [];

    for (const request of requests) {
      try {
        const result = await this.sendNotification(request);
        results.push(result);
      } catch (error) {
        console.error(`Failed to send notification for user ${request.userId}:`, error);
        // Continue with other notifications
      }
    }

    return results;
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }

    return data;
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserNotificationPreferences>,
  ): Promise<void> {
    const { error } = await supabase.from('user_notification_preferences').upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Failed to update user preferences: ${error.message}`);
    }
  }

  /**
   * Get notification history for a user
   */
  async getUserNotificationHistory(
    userId: string,
    limit: number = 50,
  ): Promise<NotificationRecord[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch notification history: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(timeRange: 'day' | 'week' | 'month' = 'week'): Promise<{
    total: number;
    sent: number;
    failed: number;
    delivered: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch notification stats: ${error.message}`);
    }

    const notifications = data || [];

    const stats = {
      total: notifications.length,
      sent: notifications.filter((n) => n.status === 'sent').length,
      failed: notifications.filter((n) => n.status === 'failed').length,
      delivered: notifications.filter((n) => n.status === 'delivered').length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    // Calculate by type and category
    notifications.forEach((notification) => {
      const template = this.templates.find((t) => t.id === notification.template_id);
      if (template) {
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
        stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Process message with variables
   */
  private processMessage(message: string, variables: Record<string, string>): string {
    let processedMessage = message;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), value);
    });

    return processedMessage;
  }

  /**
   * Check if notification type is enabled for user
   */
  private isNotificationTypeEnabled(
    type: string,
    preferences: UserNotificationPreferences,
  ): boolean {
    switch (type) {
      case 'email':
        return preferences.email_enabled;
      case 'sms':
        return preferences.sms_enabled;
      case 'in_app':
        return preferences.in_app_enabled;
      default:
        return false;
    }
  }

  /**
   * Check if category is enabled for user
   */
  private isCategoryEnabled(category: string, preferences: UserNotificationPreferences): boolean {
    switch (category) {
      case 'payment':
        return preferences.payment_notifications;
      case 'sponsorship':
        return preferences.sponsorship_notifications;
      case 'system':
        return preferences.system_notifications;
      case 'marketing':
        return preferences.marketing_notifications;
      default:
        return true;
    }
  }

  /**
   * Check if current time is in quiet hours
   */
  private isInQuietHours(preferences: UserNotificationPreferences): boolean {
    if (!preferences.quiet_hours_start || !preferences.quiet_hours_end) {
      return false;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const startHour = parseInt(preferences.quiet_hours_start.split(':')[0]);
    const endHour = parseInt(preferences.quiet_hours_end.split(':')[0]);

    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour < endHour;
    } else {
      // Quiet hours span midnight
      return currentHour >= startHour || currentHour < endHour;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: NotificationRecord): Promise<boolean> {
    try {
      // Use Supabase Edge Function for email sending
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: notification.user_id, // This should be the user's email
          subject: notification.subject,
          message: notification.message,
          template_id: notification.template_id,
        },
      });

      if (error) {
        console.error('Email sending failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: NotificationRecord): Promise<boolean> {
    try {
      // Use Supabase Edge Function for SMS sending
      const { error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: notification.user_id, // This should be the user's phone number
          message: notification.message,
          template_id: notification.template_id,
        },
      });

      if (error) {
        console.error('SMS sending failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('SMS sending error:', error);
      return false;
    }
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(notification: NotificationRecord): Promise<boolean> {
    try {
      // Store in-app notification in database
      const { error } = await supabase.from('in_app_notifications').insert({
        user_id: notification.user_id,
        title: notification.subject || 'EduEasy Notification',
        message: notification.message,
        type: notification.template_id,
        read: false,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('In-app notification storage failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('In-app notification error:', error);
      return false;
    }
  }

  /**
   * Log notification event for audit
   */
  private async logNotificationEvent(
    notificationId: string,
    eventType: string,
    eventData: Record<string, any>,
  ): Promise<void> {
    try {
      const { error } = await supabase.from('notification_audit_logs').insert({
        notification_id: notificationId,
        event_type: eventType,
        event_data: eventData,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Failed to log notification event:', error);
      }
    } catch (error) {
      console.error('Error logging notification event:', error);
    }
  }

  /**
   * Get all available templates
   */
  getTemplates(): NotificationTemplate[] {
    return [...this.templates];
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.find((t) => t.id === templateId);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

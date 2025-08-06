import logger from '@/utils/logger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  RefreshCw,
  Save,
  Smartphone,
  XCircle,
} from '@/components/ui/icons';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
  notificationService,
  type NotificationRecord,
  type UserNotificationPreferences,
} from '@/services/NotificationService';
import { memo, useEffect, useState } from 'react';

const NotificationPreferences = memo(() => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserNotificationPreferences | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');

  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadNotificationHistory();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      if (!user) return;

      const userPrefs = await notificationService.getUserPreferences(user.id);
      if (userPrefs) {
        setPreferences(userPrefs);
      } else {
        // Create default preferences if none exist
        const defaultPrefs: UserNotificationPreferences = {
          user_id: user.id,
          email_enabled: true,
          sms_enabled: true,
          in_app_enabled: true,
          payment_notifications: true,
          sponsorship_notifications: true,
          system_notifications: true,
          marketing_notifications: false,
          updated_at: new Date().toISOString(),
        };
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      logger.error('Error loading user preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      if (!user) return;

      const history = await notificationService.getUserNotificationHistory(user.id, 50);
      setNotificationHistory(history);
    } catch (error) {
      logger.error('Error loading notification history:', error);
    }
  };

  const handlePreferenceChange = (key: keyof UserNotificationPreferences, value: boolean) => {
    if (!preferences) return;

    setPreferences((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : null,
    );
  };

  const handleQuietHoursChange = (type: 'start' | 'end', value: string) => {
    if (!preferences) return;

    setPreferences((prev) =>
      prev
        ? {
            ...prev,
            [`quiet_hours_${type}`]: value,
          }
        : null,
    );
  };

  const handleSavePreferences = async () => {
    if (!user || !preferences) return;

    setSaving(true);
    try {
      await notificationService.updateUserPreferences(user.id, preferences);

      toast({
        title: 'Preferences Saved',
        description: 'Your notification preferences have been updated successfully',
      });
    } catch (error) {
      logger.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);

      // Update local state
      setNotificationHistory((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: 'delivered', delivered_at: new Date().toISOString() }
            : notification,
        ),
      );

      toast({
        title: 'Notification Marked as Read',
        description: 'Notification has been marked as read',
      });
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'delivered':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'in_app':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading notification preferences...
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load notification preferences</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          <p className="text-gray-600 mt-1">Manage how and when you receive notifications</p>
        </div>
        <Button onClick={loadNotificationHistory} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh History
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Channels
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.email_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('email_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.sms_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('sms_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">In-App Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications within the app</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.in_app_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('in_app_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Categories</CardTitle>
              <CardDescription>
                Choose which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Notifications</p>
                  <p className="text-sm text-gray-600">
                    Payment confirmations, failures, and reminders
                  </p>
                </div>
                <Switch
                  checked={preferences.payment_notifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('payment_notifications', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sponsorship Notifications</p>
                  <p className="text-sm text-gray-600">Sponsorship allocations and updates</p>
                </div>
                <Switch
                  checked={preferences.sponsorship_notifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('sponsorship_notifications', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Notifications</p>
                  <p className="text-sm text-gray-600">
                    Account verification, document status updates
                  </p>
                </div>
                <Switch
                  checked={preferences.system_notifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('system_notifications', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Notifications</p>
                  <p className="text-sm text-gray-600">News, updates, and promotional content</p>
                </div>
                <Switch
                  checked={preferences.marketing_notifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('marketing_notifications', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set times when you don't want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time</label>
                  <Select
                    value={preferences.quiet_hours_start || '22:00'}
                    onValueChange={(value) => handleQuietHoursChange('start', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {i === 0
                            ? '12:00 AM'
                            : i === 12
                              ? '12:00 PM'
                              : i > 12
                                ? `${i - 12}:00 PM`
                                : `${i}:00 AM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">End Time</label>
                  <Select
                    value={preferences.quiet_hours_end || '08:00'}
                    onValueChange={(value) => handleQuietHoursChange('end', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {i === 0
                            ? '12:00 AM'
                            : i === 12
                              ? '12:00 PM'
                              : i > 12
                                ? `${i - 12}:00 PM`
                                : `${i}:00 AM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Notifications will be paused between {preferences.quiet_hours_start || '22:00'} and{' '}
                {preferences.quiet_hours_end || '08:00'}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSavePreferences} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>View your recent notification history</CardDescription>
            </CardHeader>
            <CardContent>
              {notificationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notificationHistory.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getNotificationTypeIcon(notification.type || 'default')}
                          <div>
                            <h3 className="font-medium">
                              {notification.subject || 'EduEasy Notification'}
                            </h3>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(notification.status || 'pending')}
                          <Badge variant={getStatusBadgeVariant(notification.status || 'pending')}>
                            {notification.status || 'pending'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(notification.created_at)}</span>
                        {notification.status === 'sent' && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default NotificationPreferences;

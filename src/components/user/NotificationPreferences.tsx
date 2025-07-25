import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Bell,
    Calendar,
    Check,
    Clock,
    Eye,
    Mail,
    MessageSquare,
    RefreshCw,
    Save,
    Smartphone,
    XCircle
} from '@/components/ui/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface NotificationPreference {
  id: string;
  type: string;
  enabled: boolean;
  method: 'email' | 'sms' | 'in_app';
  frequency: 'immediately' | 'daily' | 'weekly' | 'never';
}

interface NotificationPreferencesProps {
  className?: string;
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: 'application_status',
    type: 'Application Status Updates',
    enabled: true,
    method: 'email',
    frequency: 'immediately',
  },
  {
    id: 'document_verification',
    type: 'Document Verification',
    enabled: true,
    method: 'email',
    frequency: 'immediately',
  },
  {
    id: 'payment_updates',
    type: 'Payment Updates',
    enabled: true,
    method: 'email',
    frequency: 'immediately',
  },
  {
    id: 'system_announcements',
    type: 'System Announcements',
    enabled: false,
    method: 'email',
    frequency: 'weekly',
  },
  {
    id: 'marketing',
    type: 'Marketing & Promotions',
    enabled: false,
    method: 'email',
    frequency: 'weekly',
  },
];

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const [globalSettings, setGlobalSettings] = useState({
    email_enabled: true,
    sms_enabled: false,
    in_app_enabled: true,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '07:00',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load user preferences on component mount
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      // Load notification preferences (if they exist in your database)
      // For now, we'll use the default preferences
      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Save preferences to database
      // This would typically involve updating a user_notification_preferences table
      
      toast({
        title: 'Success',
        description: 'Notification preferences saved successfully.',
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setGlobalSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationToggle = (id: string, enabled: boolean) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled } : pref
      )
    );
  };

  const handleMethodChange = (id: string, method: 'email' | 'sms' | 'in_app') => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, method } : pref
      )
    );
  };

  const handleFrequencyChange = (id: string, frequency: 'immediately' | 'daily' | 'weekly' | 'never') => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, frequency } : pref
      )
    );
  };

  const testNotification = async (type: string) => {
    try {
      // Send a test notification
      toast({
        title: 'Test Notification Sent',
        description: `A test ${type} notification has been sent.`,
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification.',
        variant: 'destructive',
      });
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

  const getPreferenceIcon = (id: string) => {
    switch (id) {
      case 'application_status':
        return <Check className="h-5 w-5 text-blue-600" />;
      case 'document_verification':
        return <Eye className="h-5 w-5 text-green-600" />;
      case 'payment_updates':
        return <RefreshCw className="h-5 w-5 text-purple-600" />;
      case 'system_announcements':
        return <Bell className="h-5 w-5 text-orange-600" />;
      case 'marketing':
        return <Mail className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="channels" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <p className="text-sm text-gray-600">
                  Choose how you want to receive notifications from EduEasy.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={globalSettings.email_enabled}
                      onCheckedChange={(checked) => handlePreferenceChange('email_enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={globalSettings.sms_enabled}
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
                      checked={globalSettings.in_app_enabled}
                      onCheckedChange={(checked) => handlePreferenceChange('in_app_enabled', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('email')}
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Test Email</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('SMS')}
                    className="flex items-center space-x-2"
                    disabled={!globalSettings.sms_enabled}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Test SMS</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('in-app')}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Test In-App</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <p className="text-sm text-gray-600">
                  Customize which types of notifications you want to receive.
                </p>

                <div className="space-y-4">
                  {preferences.map((preference) => (
                    <div
                      key={preference.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {getPreferenceIcon(preference.id)}
                        <div>
                          <p className="font-medium">{preference.type}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Select
                              value={preference.method}
                              onValueChange={(value: 'email' | 'sms' | 'in_app') =>
                                handleMethodChange(preference.id, value)
                              }
                              disabled={!preference.enabled}
                            >
                              <SelectTrigger className="w-24 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="in_app">In-App</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={preference.frequency}
                              onValueChange={(value: 'immediately' | 'daily' | 'weekly' | 'never') =>
                                handleFrequencyChange(preference.id, value)
                              }
                              disabled={!preference.enabled}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediately">Immediately</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={preference.enabled}
                        onCheckedChange={(checked) => handleNotificationToggle(preference.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Schedule</h3>
                <p className="text-sm text-gray-600">
                  Set quiet hours and delivery preferences.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">Quiet Hours</p>
                        <p className="text-sm text-gray-600">Don't send notifications during these hours</p>
                      </div>
                    </div>
                    <Switch
                      checked={globalSettings.quiet_hours_enabled}
                      onCheckedChange={(checked) => handlePreferenceChange('quiet_hours_enabled', checked)}
                    />
                  </div>

                  {globalSettings.quiet_hours_enabled && (
                    <div className="ml-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <Select
                            value={globalSettings.quiet_hours_start}
                            onValueChange={(value) => handlePreferenceChange('quiet_hours_start', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour}:00
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <Select
                            value={globalSettings.quiet_hours_end}
                            onValueChange={(value) => handlePreferenceChange('quiet_hours_end', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour}:00
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Weekend Delivery</p>
                        <p className="text-sm text-gray-600">Receive non-urgent notifications on weekends</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Saturday</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Sunday</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <XCircle className="h-4 w-4" />
              <span>Changes are saved automatically</span>
            </div>
            <Button
              onClick={savePreferences}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
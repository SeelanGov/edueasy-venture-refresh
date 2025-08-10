import { AlertDescription, Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { safeAsync } from '@/utils/errorHandling';
import { gdpr, inputValidation, securityMonitoring } from '@/utils/security';
import { memo, useEffect, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  EyeOff,
  Key,
  Shield,
  Trash2,
} from 'lucide-react';

interface SecuritySettingsProps {
  className?: string;
}

const SecuritySettings = memo<SecuritySettingsProps>(({ className }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ valid: boolean; errors: string[] }>({
    valid: false,
    errors: [],
  });

  // Security preferences
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginNotifications, setLoginNotifications] = useState(true);

  // Privacy preferences
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [thirdPartyConsent, setThirdPartyConsent] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadSecurityPreferences();
    loadPrivacyPreferences();
  }, []);

  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(inputValidation.validatePassword(newPassword));
    }
  }, [newPassword]);

  const loadSecurityPreferences = () => {
    // Load from localStorage or user preferences
    const preferences = JSON.parse(localStorage.getItem('security-preferences') || '{}');
    setTwoFactorEnabled(preferences.twoFactorEnabled || false);
    setSessionTimeout(preferences.sessionTimeout || 30);
    setLoginNotifications(preferences.loginNotifications !== false);
  };

  const loadPrivacyPreferences = () => {
    setAnalyticsConsent(gdpr.hasConsent('analytics'));
    setMarketingConsent(gdpr.hasConsent('marketing'));
    setThirdPartyConsent(gdpr.hasConsent('third_party'));
  };

  const saveSecurityPreferences = () => {
    const preferences = {
      twoFactorEnabled,
      sessionTimeout,
      loginNotifications,
    };

    localStorage.setItem('security-preferences', JSON.stringify(preferences));

    toast({
      title: 'Security Preferences Updated',
      description: 'Your security preferences have been saved successfully.',
    });

    securityMonitoring.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'low',
      description: 'User updated security preferences',
      userId: user?.id,
    });
  };

  const savePrivacyPreferences = () => {
    gdpr.setConsent('analytics', analyticsConsent);
    gdpr.setConsent('marketing', marketingConsent);
    gdpr.setConsent('third_party', thirdPartyConsent);

    toast({
      title: 'Privacy Preferences Updated',
      description: 'Your privacy preferences have been saved successfully.',
    });
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation password do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (!passwordStrength.valid) {
      toast({
        title: 'Weak Password',
        description: 'Please ensure your password meets all security requirements.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await safeAsync(
      async () => {
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          throw updateError;
        }

        return true;
      },
      {
        component: 'SecuritySettings',
        action: 'password_change',
        userId: user?.id,
        showToast: false, // We'll handle the success toast manually
      },
    );

    if (error) {
      // Error toast is already shown by safeAsync
      setLoading(false);
      return;
    }

    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });

    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    securityMonitoring.logSecurityEvent({
      type: 'password_change',
      severity: 'medium',
      description: 'User changed password',
      userId: user?.id,
    });

    setLoading(false);
  };

  const handleDataExport = async () => {
    setLoading(true);

    const { error } = await safeAsync(
      async () => {
        const result = await gdpr.exportUserData(user?.id || '');

        if (!result.success) {
          throw new Error(result.error || 'Export failed');
        }

        return result;
      },
      {
        component: 'SecuritySettings',
        action: 'data_export',
        userId: user?.id,
        showToast: false,
      },
    );

    if (error) {
      setLoading(false);
      return;
    }

    toast({
      title: 'Data Export Requested',
      description:
        "Your data export request has been submitted. You will receive an email when it's ready.",
    });

    setLoading(false);
  };

  const handleDataDeletion = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    const { error } = await safeAsync(
      async () => {
        const result = await gdpr.requestDataDeletion(user?.id || '');

        if (!result.success) {
          throw new Error('Failed to submit deletion request');
        }

        return result;
      },
      {
        component: 'SecuritySettings',
        action: 'data_deletion',
        userId: user?.id,
        showToast: false,
      },
    );

    if (error) {
      setLoading(false);
      return;
    }

    toast({
      title: 'Deletion Request Submitted',
      description:
        'Your data deletion request has been submitted. You will receive a confirmation email.',
    });

    setLoading(false);
  };

  const getPasswordStrengthColor = (): string => {
    if (passwordStrength.valid) return 'text-success';
    if (newPassword.length > 0) return 'text-destructive';
    return 'text-gray-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold">Security & Privacy Settings</h1>
        <p className="text-gray-600">Manage your account security and privacy preferences</p>
      </div>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Management
          </CardTitle>
          <CardDescription>
            Change your password and manage password security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password" />
            </div>
          </div>

          {newPassword && (
            <div className="space-y-2">
              <Label>Password Strength</Label>
              <div className={`text-sm ${getPasswordStrengthColor()}`}>
                {passwordStrength.valid ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strong password
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Password requirements:
                    </div>
                    <ul className="ml-6 list-disc space-y-1">
                      {passwordStrength.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handlePasswordChange}
            disabled={loading || !passwordStrength.valid}
            className="w-full md:w-auto">
            {loading ? 'Updating...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Preferences
          </CardTitle>
          <CardDescription>Configure your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Session Timeout</Label>
              <p className="text-sm text-gray-600">
                Automatically log out after {sessionTimeout} minutes of inactivity
              </p>
            </div>
            <Input
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-20"
              min={5}
              max={120}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Login Notifications</Label>
              <p className="text-sm text-gray-600">
                Receive email notifications for new login attempts
              </p>
            </div>
            <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
          </div>

          <Button onClick={saveSecurityPreferences} className="w-full md:w-auto">
            Save Security Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Preferences
          </CardTitle>
          <CardDescription>Control how your data is used and shared</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Analytics & Performance</Label>
              <p className="text-sm text-gray-600">
                Allow us to collect anonymous usage data to improve our services
              </p>
            </div>
            <Switch checked={analyticsConsent} onCheckedChange={setAnalyticsConsent} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Marketing Communications</Label>
              <p className="text-sm text-gray-600">
                Receive updates about new features and educational opportunities
              </p>
            </div>
            <Switch checked={marketingConsent} onCheckedChange={setMarketingConsent} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Third-Party Services</Label>
              <p className="text-sm text-gray-600">
                Allow data sharing with trusted third-party services
              </p>
            </div>
            <Switch checked={thirdPartyConsent} onCheckedChange={setThirdPartyConsent} />
          </div>

          <Button onClick={savePrivacyPreferences} className="w-full md:w-auto">
            Save Privacy Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export or delete your personal data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have the right to access, export, and delete your personal data under GDPR
              regulations.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleDataExport}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export My Data
            </Button>

            <Button
              onClick={handleDataDeletion}
              disabled={loading}
              variant="destructive"
              className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete My Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>Overview of your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Password Strength</p>
                <p className="text-sm text-gray-600">
                  Last changed:{' '}
                  {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <Badge variant={passwordStrength.valid ? 'default' : 'destructive'}>
                {passwordStrength.valid ? 'Strong' : 'Weak'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Auth</p>
                <p className="text-sm text-gray-600">Account protection</p>
              </div>
              <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto-logout protection</p>
              </div>
              <Badge variant="outline">{sessionTimeout}m</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Last Login</p>
                <p className="text-sm text-gray-600">Account activity</p>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Recent
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

SecuritySettings.displayName = 'SecuritySettings';

export default SecuritySettings;

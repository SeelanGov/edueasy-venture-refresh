import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAuthActions } from '@/hooks/useAuthActions';
import { AlertTriangle, CheckCircle, Mail, Phone, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const VerificationRequired = (): void => {
  const { user } = useAuth();
  const { verifyIdentity } = useAuthActions();
  // const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [retrySuccess, setRetrySuccess] = useState(false);

  const handleRetryVerification = async () => {
    if (!user?.email || !user?.user_metadata) {
      setRetryError('Missing user information. Please register again.');
      return;
    }

    setIsRetrying(true);
    setRetryError(null);

    try {
      const result = await verifyIdentity(
        user.email,
        user.user_metadata.id_number || '',
        user.user_metadata.full_name || '',
        user.user_metadata.phone_number,
      );

      if (result.verified) {
        setRetrySuccess(true);
        // Refresh the page to trigger auth state update
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        if (result.blocked_until) {
          const blockedDate = new Date(result.blocked_until);
          setRetryError(
            `Too many verification attempts. Please try again after ${blockedDate.toLocaleString()}.`,
          );
        } else {
          setRetryError(result.error || 'Verification failed. Please check your ID number.');
        }
      }
    } catch (error) {
      console.error('Retry verification error:', error);
      setRetryError('Network error during verification. Please try again later.');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-red-600">
            Identity Verification Required
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-gray-600 text-center">
            <p className="mb-4">
              Your identity needs to be verified before you can access your dashboard and apply for
              educational opportunities.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="font-medium text-blue-900 mb-2">Why do we verify identity?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure secure access to your educational records</li>
                <li>• Prevent fraud and protect your personal information</li>
                <li>• Comply with educational institution requirements</li>
                <li>• Enable trusted sponsorship and funding opportunities</li>
              </ul>
            </div>
          </div>

          {retrySuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Verification successful! Redirecting to your dashboard...
              </AlertDescription>
            </Alert>
          )}

          {retryError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{retryError}</AlertDescription>
            </Alert>
          )}

          {user?.email && (
            <div className="space-y-3">
              <Button
                onClick={handleRetryVerification}
                disabled={isRetrying || retrySuccess}
                className="w-full bg-cap-teal hover:bg-cap-teal/90"
                size="lg"
              >
                {isRetrying ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Verifying Identity...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Verification
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">Registered as: {user.email}</div>
            </div>
          )}

          {!user?.email && (
            <Button asChild className="w-full bg-cap-teal" size="lg">
              <Link to="/register">Complete Registration</Link>
            </Button>
          )}

          <div className="border-t pt-6 space-y-4">
            <div className="text-sm text-gray-600 text-center">
              <p className="font-medium mb-2">Need help with verification?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" size="sm" asChild className="justify-start">
                <a href="mailto:support@edueasy.co.za" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </a>
              </Button>

              <Button variant="outline" size="sm" asChild className="justify-start">
                <a href="tel:+27123456789" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call +27 12 345 6789
                </a>
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center leading-relaxed">
              Our support team is available Monday to Friday, 8:00 AM to 5:00 PM (SAST). Please have
              your registration email and the last 4 digits of your ID number ready.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationRequired;

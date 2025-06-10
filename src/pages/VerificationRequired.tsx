
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const VerificationRequired = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !nationalId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('verify-id', {
        body: {
          nationalId: nationalId.replace(/\s/g, ''),
          userId: user.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Verification Successful',
          description: `Your tracking ID is: ${data.trackingId}`,
        });
        navigate('/dashboard');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Identity Verification Required</CardTitle>
          <CardDescription>
            Please verify your South African ID number to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerification} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nationalId">South African ID Number</Label>
              <Input
                id="nationalId"
                type="text"
                placeholder="0000000000000"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                maxLength={13}
                pattern="\d{13}"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Enter your 13-digit South African ID number
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !nationalId}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Identity
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Why do we need this?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Comply with POPIA regulations</li>
              <li>• Ensure secure access to your educational data</li>
              <li>• Generate your unique tracking ID</li>
              <li>• Prevent fraud and identity theft</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:underline">
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationRequired;

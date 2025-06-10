
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Lock, CreditCard, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: ID verification, 2: account creation
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<{ success: boolean; trackingId?: string } | null>(null);

  const from = location.state?.from || '/dashboard';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateIdStep = () => {
    if (!formData.fullName || !formData.idNumber) {
      setError('Full name and ID number are required');
      return false;
    }

    if (!/^\d{13}$/.test(formData.idNumber)) {
      setError('ID number must be exactly 13 digits');
      return false;
    }

    return true;
  };

  const validateAccountStep = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleIdVerification = async () => {
    if (!validateIdStep()) return;

    setLoading(true);
    setError(null);

    try {
      // Create a temporary user ID for verification
      const tempUserId = crypto.randomUUID();
      
      const { data, error } = await supabase.functions.invoke('verify-id', {
        body: {
          nationalId: formData.idNumber.replace(/\s/g, ''),
          userId: tempUserId
        }
      });

      if (error) throw error;

      if (data.success) {
        setVerificationData(data);
        setStep(2);
        toast({
          title: 'ID Verified Successfully',
          description: 'Please complete your account creation',
        });
      } else {
        setError(data.error || 'ID verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountCreation = async () => {
    if (!validateAccountStep()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signUp(formData.email, formData.password, formData.fullName, formData.idNumber);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.user) {
        // Update the user with verification status
        const { error: updateError } = await supabase
          .from('users')
          .update({
            id_verified: true,
            tracking_id: verificationData?.trackingId
          })
          .eq('id', result.user.id);

        if (updateError) {
          console.error('Error updating verification status:', updateError);
        }

        toast({
          title: 'Account Created Successfully',
          description: `Your tracking ID is: ${verificationData?.trackingId}`,
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      await handleIdVerification();
    } else {
      await handleAccountCreation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {step === 1 ? 'Verify Your Identity' : 'Create Your Account'}
          </CardTitle>
          <CardDescription>
            {step === 1 ? 'Step 1: ID Verification' : 'Step 2: Account Setup'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && verificationData?.success && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ID verified successfully! Tracking ID: {verificationData.trackingId}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: ID Verification */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">South African ID Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="0000000000000"
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value.replace(/\D/g, '').slice(0, 13))}
                      className="pl-10"
                      maxLength={13}
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter your 13-digit South African ID number
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Why do we need this?</span>
                  </div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Comply with POPIA regulations</li>
                    <li>• Ensure secure access to your data</li>
                    <li>• Generate your unique tracking ID</li>
                    <li>• Prevent fraud and identity theft</li>
                  </ul>
                </div>
              </>
            )}

            {/* Step 2: Account Creation */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {step === 1 ? 'Verifying ID...' : 'Creating account...'}
                </>
              ) : (
                step === 1 ? 'Verify ID' : 'Create Account'
              )}
            </Button>

            {step === 2 && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back to ID Verification
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, AlertCircle, User, FileText, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserVerification } from '@/hooks/useUserVerification';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: userVerification, isLoading } = useUserVerification(user?.id);

  const getVerificationStatus = () => {
    if (isLoading) return 'loading';
    if (!userVerification) return 'unknown';
    return userVerification.id_verified ? 'verified' : 'pending';
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userVerification?.full_name || user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Status Alert */}
        {verificationStatus === 'pending' && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your identity verification is still pending. You'll have access to all features once verified.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {verificationStatus === 'verified' && (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </>
                )}
                {verificationStatus === 'pending' && (
                  <>
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </>
                )}
                {verificationStatus === 'loading' && (
                  <Badge variant="secondary">Loading...</Badge>
                )}
              </div>
              {userVerification?.tracking_id && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tracking ID: {userVerification.tracking_id}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Total applications submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Type</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userVerification?.current_plan || 'Free'}
              </div>
              <p className="text-xs text-muted-foreground">
                Current subscription plan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Add your educational background and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled={verificationStatus !== 'verified'}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browse Programs</CardTitle>
              <CardDescription>
                Explore universities and programs that match your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Programs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Start Application</CardTitle>
              <CardDescription>
                Begin your university application process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={verificationStatus !== 'verified'}>
                Start Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

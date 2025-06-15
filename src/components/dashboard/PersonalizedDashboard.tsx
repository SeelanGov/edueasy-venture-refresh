import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Application } from '@/types/ApplicationTypes';
import { DocumentVerificationNotice } from './DocumentVerificationNotice';
import { useApplications } from '@/hooks/useApplications';
import { useSubscription } from '@/hooks/useSubscription';
import { Sparkles, Copy } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/hooks/use-toast';

interface PersonalizedDashboardProps {
  applications: Application[];
  loading: boolean;
}

export const PersonalizedDashboard = ({ applications, loading }: PersonalizedDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentSubscription } = useSubscription();
  const { applications: allApplications, loading: allApplicationsLoading } = useApplications();
  const [applicationCount, setApplicationCount] = useState(0);

  // Tracking ID related
  const trackingId = (user as any)?.user_metadata?.tracking_id || (user as any)?.tracking_id;

  useEffect(() => {
    if (!allApplicationsLoading) {
      setApplicationCount(allApplications.length);
    }
  }, [allApplications, allApplicationsLoading]);

  const handleStartApplication = () => {
    navigate('/apply');
  };

  const isSubscribed = currentSubscription && currentSubscription.is_active;

  const handleCopyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      toast({
        title: "Copied to clipboard!",
        description: "Your tracking ID was copied.",
        variant: "default",
      });
    }
  };

  // TODO: Phase 5+ — After VerificationGuard,
  // add logic here to detect sponsor allocation and activate plans.
  // If sponsor_id exists and allocation is active -> auto activate plan.
  // Otherwise, show payment/plan options. (Next PR)
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Tracking ID Card */}
      {trackingId && (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-tr from-green-100 to-cap-teal/10 border border-cap-teal text-cap-dark flex flex-col items-center justify-center shadow-md mb-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="h-5 w-5 text-cap-coral" />
            <CardTitle className="text-xl font-semibold">
              Your EduEasy Tracking ID
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-1">
            <div className="flex items-center text-2xl font-mono font-bold bg-white rounded px-3 py-1 border border-cap-coral/40">
              {trackingId}
              <button
                onClick={handleCopyTrackingId}
                className="ml-2 hover:text-cap-coral transition"
                title="Copy tracking ID"
                type="button"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <CardDescription>
              Use this ID when contacting support or tracking your application status.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-cap-teal/80 to-blue-300 text-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Welcome, {user?.user_metadata?.full_name || 'User'}!
          </CardTitle>
          <CardDescription>
            {isSubscribed
              ? 'Enjoy your premium access.'
              : 'Start your journey to success with EduEasy.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Typography variant="body" className="text-white/80">
            {isSubscribed
              ? 'You have access to all premium features. Make the most of your subscription!'
              : 'Complete your profile and start applying to your dream institutions today.'}
          </Typography>
          {!isSubscribed && (
            <Button variant="secondary" onClick={() => navigate('/subscription')}>
              Upgrade Now <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Application Status Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Application Status</CardTitle>
          <CardDescription>Track your applications and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <>
              <p>No applications submitted yet.</p>
              <Button onClick={handleStartApplication}>Start an Application</Button>
            </>
          ) : (
            <ul>
              {applications.map((app) => (
                <li key={app.id} className="mb-2">
                  {app.institution_id} - {app.status}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Profile Completion Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Complete Your Profile</CardTitle>
          <CardDescription>
            Increase your chances of acceptance by completing your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>A complete profile helps institutions get to know you better.</p>
          <Button onClick={() => navigate('/profile-completion')}>
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

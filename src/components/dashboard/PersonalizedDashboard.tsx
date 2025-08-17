import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { PaymentRecoveryNotice } from '@/components/user/PaymentRecoveryNotice';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { type Application } from '@/types/ApplicationTypes';
import { useQuery } from '@tanstack/react-query';
import { Copy, Medal, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';














interface PersonalizedDashboardProps {
  applications: Application[];
  loading: boolean;
}

/**
 * PersonalizedDashboard
 * @description Function
 */
export const PersonalizedDashboard = ({
  applications,
  loading,
}: PersonalizedDashboardProps): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentSubscription } = useSubscription();

  // Tracking ID related
  let trackingId: string | undefined;
  if (user && isUserMetadata(user.user_metadata)) {
    trackingId = user.user_metadata.tracking_id ?? (user as any).tracking_id;
  } else if (user && 'tracking_id' in user) {
    trackingId = (user as any).tracking_id;
  }

  const handleStartApplication = (): void => {
    navigate('/apply');
  };

  // SPONSOR ALLOCATION LOGIC (new!)
  // Query for an active sponsor allocation for this user, if they are sponsored
  const sponsoreeId = user?.id;
  const sponsorEnabled =
    !!sponsoreeId &&
    ((user && isUserMetadata(user.user_metadata) && !!user.user_metadata.sponsor_id) ||
      (user && 'sponsor_id' in user));
  const { data: sponsorAllocation } = useQuery({
    queryKey: ['sponsor_allocation', sponsoreeId],
    queryFn: async () => {
      if (!sponsoreeId) return null;
      let sponsorId: string | undefined;
      if (user && isUserMetadata(user.user_metadata)) {
        sponsorId = user.user_metadata.sponsor_id ?? (user as any).sponsor_id;
      } else if (user && 'sponsor_id' in user) {
        sponsorId = (user as any).sponsor_id;
      }
      if (!sponsorId) return null;
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .select('*')
        .eq('student_id', sponsoreeId)
        .eq('sponsor_id', sponsorId)
        .eq('status', 'active')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: sponsorEnabled,
    staleTime: 2 * 60 * 1000,
  });

  // Derived: determine if user is sponsored
  const hasSponsorAllocation =
    sponsorAllocation &&
    typeof sponsorAllocation === 'object' &&
    'status' in sponsorAllocation &&
    sponsorAllocation.status === 'active';

  // Use regular subscription logic if not sponsored
  const isSubscribed =
    (currentSubscription && currentSubscription.is_active) || hasSponsorAllocation;

  const handleCopyTrackingId = (): void => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      toast({
        title: 'Copied to clipboard!',
        description: 'Your tracking ID was copied.',
        variant: 'default',
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
            <CardTitle className="text-xl font-semibold">Your EduEasy Tracking ID</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-1">
            <div className="flex items-center text-2xl font-mono font-bold bg-white rounded px-3 py-1 border border-cap-coral/40">
              {trackingId}
              <Button
                onClick={handleCopyTrackingId}
                className="ml-2 hover:text-cap-coral transition"
                title="Copy tracking ID"
                type="button"
                variant="ghost"
                size="sm">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>
              Use this ID when contacting support or tracking your application status.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Payment Recovery Notice */}
      <PaymentRecoveryNotice />

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-cap-teal/80 to-blue-300 text-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Welcome,{' '}
            {user && isUserMetadata(user.user_metadata) && user.user_metadata.full_name
              ? user.user_metadata.full_name
              : 'User'}
            !
          </CardTitle>
          <CardDescription>
            {isSubscribed
              ? hasSponsorAllocation
                ? 'Your plan is sponsored — enjoy premium access!'
                : 'Enjoy your premium access.'
              : 'Start your journey to success with EduEasy.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Typography variant="body" className="text-white/80">
            {isSubscribed
              ? hasSponsorAllocation
                ? 'You have a sponsor-provided premium plan. All premium features are unlocked for you. Thank your sponsor for their support of your education journey!'
                : 'You have access to all premium features. Make the most of your subscription!'
              : 'Complete your profile and start applying to your dream institutions today.'}
          </Typography>
          {/* If sponsored, show a medal and sponsor info. Otherwise normal upgrade logic. */}
          {hasSponsorAllocation ? (
            <div className="flex items-center gap-2 mt-2">
              <Medal className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-semibold text-yellow-100">Sponsored Plan Active</span>
            </div>
          ) : (
            !isSubscribed && (
              <Button variant="secondary" onClick={() => navigate('/subscription')}>
                Upgrade Now <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            )
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
          <Button onClick={() => navigate('/profile-completion')}>Complete Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface UserMetadata {
  tracking_id?: string;
  sponsor_id?: string;
  full_name?: string;
  [key: string]: unknown;
}

function isUserMetadata(obj: unknown): obj is UserMetadata {
  return obj !== null && typeof obj === 'object';
}

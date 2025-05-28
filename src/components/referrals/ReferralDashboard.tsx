import React, { useState } from 'react';
import { useReferrals } from '@/hooks/useReferrals';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/types/SubscriptionTypes';
import { Copy, Share2, RefreshCw, Users, Gift } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function ReferralDashboard() {
  const { loading, referrals, userProfile, referralStats, generateReferralCode } = useReferrals();

  const [copying, setCopying] = useState(false);

  const handleCopyReferralCode = async () => {
    if (!userProfile?.referral_code) return;

    setCopying(true);

    try {
      await navigator.clipboard.writeText(userProfile.referral_code);

      toast({
        title: 'Copied to Clipboard',
        description: 'Referral code copied to clipboard',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to copy:', error);

      toast({
        title: 'Copy Failed',
        description: 'Failed to copy referral code',
        variant: 'destructive',
      });
    } finally {
      setCopying(false);
    }
  };

  const handleGenerateReferralCode = async () => {
    await generateReferralCode();
  };

  const handleShareReferral = () => {
    if (!userProfile?.referral_code) return;

    const shareText = `Join EduEasy using my referral code: ${userProfile.referral_code} and get a discount on your subscription!`;
    const shareUrl = `https://edueasy.co.za/register?referral=${userProfile.referral_code}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Join EduEasy',
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        '_blank'
      );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get badge variant based on referral status
  const getStatusBadgeVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share your referral code with friends and earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={userProfile?.referral_code || ''}
              readOnly
              className="font-mono text-center"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopyReferralCode}
              disabled={copying || !userProfile?.referral_code}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleShareReferral}
              disabled={!userProfile?.referral_code}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            For each friend who signs up and subscribes, you'll receive R50 in credit.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleGenerateReferralCode}
            disabled={loading}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Code
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{referralStats.totalReferrals}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{referralStats.completedReferrals}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {formatCurrency(referralStats.totalRewards)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track the status of your referrals</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                You haven't referred anyone yet. Share your referral code to get started!
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ReferralTable
                  referrals={referrals}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              </TabsContent>

              <TabsContent value="pending">
                <ReferralTable
                  referrals={referrals.filter((r) => r.status === 'pending')}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              </TabsContent>

              <TabsContent value="completed">
                <ReferralTable
                  referrals={referrals.filter((r) => r.status === 'completed')}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ReferralTableProps {
  referrals: any[];
  formatDate: (date: string) => string;
  getStatusBadgeVariant: (status: string) => 'default' | 'secondary' | 'destructive' | 'outline';
}

function ReferralTable({ referrals, formatDate, getStatusBadgeVariant }: ReferralTableProps) {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No referrals found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">User</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Reward</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral.id} className="border-b">
              <td className="py-3 px-4">{formatDate(referral.created_at)}</td>
              <td className="py-3 px-4">{referral.referred_id.substring(0, 8)}...</td>
              <td className="py-3 px-4">
                <Badge variant={getStatusBadgeVariant(referral.status)}>{referral.status}</Badge>
              </td>
              <td className="py-3 px-4">
                {referral.reward_amount ? formatCurrency(referral.reward_amount) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

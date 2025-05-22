import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  Referral,
  ReferralStatus,
  TransactionStatus,
  TransactionType,
  ProfileWithSubscription
} from '@/types/SubscriptionTypes';
import { toast } from '@/components/ui/use-toast';

export function useReferrals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userProfile, setUserProfile] = useState<ProfileWithSubscription | null>(null);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0
  });
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle errors
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  // Fetch user's profile with referral code
  const fetchUserProfile = async () => {
    if (!user?.id) {
      setUserProfile(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscription:user_subscriptions(
            *,
            tier:tier_id(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('user_subscriptions.is_active', true)
        .single();
      
      if (error) throw error;
      
      // Flatten the subscription data
      const profile = {
        ...data,
        subscription: data.subscription?.[0] || null
      };
      
      setUserProfile(profile);
    } catch (error) {
      handleError(error, 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's referrals
  const fetchReferrals = async () => {
    if (!user?.id) {
      setReferrals([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setReferrals(data || []);
      
      // Calculate referral statistics
      const totalReferrals = data?.length || 0;
      const completedReferrals = data?.filter(r => r.status === ReferralStatus.COMPLETED).length || 0;
      const pendingReferrals = data?.filter(r => r.status === ReferralStatus.PENDING).length || 0;
      const totalRewards = data?.reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0;
      
      setReferralStats({
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalRewards
      });
    } catch (error) {
      handleError(error, 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  // Generate a new referral code
  const generateReferralCode = async () => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a random code
      const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ referral_code: randomCode })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, referral_code: randomCode } : null);
      
      toast({
        title: "Referral Code Generated",
        description: `Your new referral code is: ${randomCode}`,
        variant: "default",
      });
      
      return data.referral_code;
    } catch (error) {
      handleError(error, 'Failed to generate referral code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Apply a referral code (used during registration)
  const applyReferralCode = async (referralCode: string, newUserId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the referrer
      const { data: referrerData, error: referrerError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('referral_code', referralCode)
        .single();
      
      if (referrerError) {
        toast({
          title: "Invalid Referral Code",
          description: "The referral code you entered is invalid.",
          variant: "destructive",
        });
        throw new Error('Invalid referral code');
      }
      
      // Update the new user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referred_by: referrerData.user_id })
        .eq('user_id', newUserId);
      
      if (updateError) throw updateError;
      
      // Create a referral record
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerData.user_id,
          referred_id: newUserId,
          status: ReferralStatus.PENDING,
          reward_amount: 50 // Default reward amount
        })
        .select()
        .single();
      
      if (referralError) throw referralError;
      
      toast({
        title: "Referral Applied",
        description: "The referral code has been applied successfully.",
        variant: "default",
      });
      
      return referralData;
    } catch (error) {
      handleError(error, 'Failed to apply referral code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Complete a referral (called when referred user completes a milestone)
  const completeReferral = async (referralId: string) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get the referral details
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('id', referralId)
        .single();
      
      if (referralError) throw referralError;
      
      // Only admins or the referrer can complete a referral
      const isAdmin = await checkIfUserIsAdmin(user.id);
      if (referralData.referrer_id !== user.id && !isAdmin) {
        throw new Error('Unauthorized to complete this referral');
      }
      
      // Update the referral status
      const { error: updateError } = await supabase
        .from('referrals')
        .update({ 
          status: ReferralStatus.COMPLETED,
          reward_claimed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', referralId);
      
      if (updateError) throw updateError;
      
      // Record the reward transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: referralData.referrer_id,
          amount: referralData.reward_amount || 0,
          status: TransactionStatus.COMPLETED,
          transaction_type: TransactionType.REFERRAL_REWARD
        });
      
      if (transactionError) throw transactionError;
      
      // Refresh referrals data
      await fetchReferrals();
      
      toast({
        title: "Referral Completed",
        description: "The referral has been completed and the reward has been issued.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to complete referral');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if user is admin
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
      fetchReferrals();
    }
  }, [user]);

  return {
    loading,
    error,
    referrals,
    userProfile,
    referralStats,
    fetchUserProfile,
    fetchReferrals,
    generateReferralCode,
    applyReferralCode,
    completeReferral
  };
}
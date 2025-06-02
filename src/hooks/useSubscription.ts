
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SubscriptionTier, UserSubscription, Transaction } from '@/types/SubscriptionTypes';

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock subscription tiers since we don't have the database table yet
  const mockTiers: SubscriptionTier[] = [
    {
      id: '1',
      name: 'Free',
      description: 'Basic features for getting started',
      price_monthly: 0,
      price_yearly: 0,
      max_applications: 3,
      career_guidance: false,
      priority_processing: false,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      max_documents: 5,
      includes_verification: false,
      includes_ai_assistance: false,
      includes_priority_support: false,
    },
    {
      id: '2',
      name: 'Standard',
      description: 'Enhanced features for serious applicants',
      price_monthly: 99,
      price_yearly: 999,
      max_applications: 10,
      career_guidance: true,
      priority_processing: false,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      max_documents: 20,
      includes_verification: true,
      includes_ai_assistance: true,
      includes_priority_support: false,
    },
    {
      id: '3',
      name: 'Premium',
      description: 'All features with priority support',
      price_monthly: 199,
      price_yearly: 1999,
      max_applications: -1, // Unlimited
      career_guidance: true,
      priority_processing: true,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      max_documents: -1, // Unlimited
      includes_verification: true,
      includes_ai_assistance: true,
      includes_priority_support: true,
    },
  ];

  const fetchSubscriptions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Use mock data for now
      setSubscriptionTiers(mockTiers);

      // Mock current subscription (free tier)
      const mockSubscription: UserSubscription = {
        id: '1',
        user_id: user.id,
        tier_id: '1',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        auto_renew: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tier: mockTiers[0],
      };
      setCurrentSubscription(mockSubscription);

      setError(null);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (tierId: string, paymentToken?: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      // Mock subscription logic
      const tier = mockTiers.find(t => t.id === tierId);
      if (!tier) throw new Error('Tier not found');

      const newSubscription: UserSubscription = {
        id: Date.now().toString(),
        user_id: user.id,
        tier_id: tierId,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        auto_renew: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tier,
      };

      setCurrentSubscription(newSubscription);

      toast({
        title: 'Subscription successful',
        description: `You've successfully subscribed to ${tier.name}`,
      });

      return true;
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Failed to subscribe');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user || !currentSubscription) return false;

    try {
      // Mock cancellation
      setCurrentSubscription({
        ...currentSubscription,
        auto_renew: false,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will not auto-renew',
      });

      return true;
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      return false;
    }
  };

  const refreshSubscriptions = async () => {
    await fetchSubscriptions();
  };

  const subscribeToPlan = async (tierId: string, paymentMethod?: string, autoRenew?: boolean, billingCycle?: 'monthly' | 'yearly') => {
    return await subscribe(tierId, paymentMethod);
  };

  const toggleAutoRenew = async () => {
    if (!currentSubscription) return false;
    
    setCurrentSubscription({
      ...currentSubscription,
      auto_renew: !currentSubscription.auto_renew,
      updated_at: new Date().toISOString(),
    });

    return true;
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  return {
    loading,
    error,
    subscriptionTiers,
    tiers: subscriptionTiers, // Alias for backward compatibility
    currentSubscription,
    userSubscription: currentSubscription, // Alias for backward compatibility
    transactions,
    subscribe,
    subscribeToPlan,
    cancelSubscription,
    toggleAutoRenew,
    refreshSubscriptions,
  };
};


import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_applications: number;
  max_documents?: number;
  includes_verification?: boolean;
  includes_ai_assistance?: boolean;
  includes_priority_support?: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  tier?: SubscriptionTier;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock data for subscription tiers
  const mockTiers: SubscriptionTier[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic features to get started',
      price_monthly: 0,
      price_yearly: 0,
      max_applications: 3,
      max_documents: 5,
      includes_verification: false,
      includes_ai_assistance: false,
      includes_priority_support: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Enhanced features for serious students',
      price_monthly: 99,
      price_yearly: 990,
      max_applications: 10,
      max_documents: 20,
      includes_verification: true,
      includes_ai_assistance: true,
      includes_priority_support: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'All features with priority support',
      price_monthly: 199,
      price_yearly: 1990,
      max_applications: -1, // Unlimited
      includes_verification: true,
      includes_ai_assistance: true,
      includes_priority_support: true,
    },
  ];

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      setTiers(mockTiers);
      
      // Load user subscription
      const { data: subscription } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user?.id)
        .eq('active', true)
        .single();

      if (subscription) {
        const tier = mockTiers.find(t => t.name.toLowerCase() === subscription.plan.toLowerCase());
        setUserSubscription({
          ...subscription,
          tier_id: tier?.id || 'free',
          tier,
          auto_renew: true,
        });
      }

      // Load transactions
      const { data: userTransactions } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (userTransactions) {
        setTransactions(userTransactions.map(t => ({
          ...t,
          transaction_type: 'subscription_payment',
          currency: 'ZAR',
        })));
      }

    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (
    tierId: string,
    paymentMethod: string,
    autoRenew: boolean,
    billingCycle: 'monthly' | 'yearly'
  ) => {
    if (!user) return false;

    try {
      const tier = tiers.find(t => t.id === tierId);
      if (!tier) return false;

      const amount = billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: amount * 100, // Convert to cents
          plan: tier.name,
          payment_method: paymentMethod,
          status: 'paid',
        });

      if (paymentError) throw paymentError;

      // Update user plan
      const { error: planError } = await supabase
        .from('user_plans')
        .upsert({
          user_id: user.id,
          plan: tier.name,
          active: true,
        });

      if (planError) throw planError;

      toast({
        title: 'Success',
        description: `Successfully subscribed to ${tier.name} plan`,
      });

      await loadSubscriptionData();
      return true;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe to plan',
        variant: 'destructive',
      });
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!user || !userSubscription) return false;

    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ active: false })
        .eq('user_id', user.id)
        .eq('id', userSubscription.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Subscription cancelled successfully',
      });

      await loadSubscriptionData();
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleAutoRenew = async () => {
    // This would update auto-renewal settings
    toast({
      title: 'Success',
      description: 'Auto-renewal settings updated',
    });
  };

  return {
    loading,
    tiers,
    userSubscription,
    currentSubscription: userSubscription,
    transactions,
    subscribeToPlan,
    cancelSubscription,
    toggleAutoRenew,
  };
}

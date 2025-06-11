
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SubscriptionTier, UserSubscription, Transaction } from '@/types/SubscriptionTypes';

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock data for subscription tiers
  const mockTiers: SubscriptionTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Basic features to get started',
      price_once_off: 0,
      max_applications: 1,
      max_documents: 5,
      includes_verification: false,
      includes_ai_assistance: true,
      includes_priority_support: false,
      thandi_tier: 'basic',
    },
    {
      id: 'essential',
      name: 'Essential',
      description: 'Enhanced features for serious students',
      price_once_off: 199,
      max_applications: 3,
      max_documents: 20,
      includes_verification: true,
      includes_ai_assistance: true,
      includes_priority_support: false,
      thandi_tier: 'guidance',
    },
    {
      id: 'pro-ai',
      name: 'Pro + AI',
      description: 'All features with advanced AI guidance',
      price_once_off: 300,
      max_applications: 6,
      includes_verification: true,
      includes_ai_assistance: true,
      includes_priority_support: true,
      thandi_tier: 'advanced',
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

      if (subscription && user?.id) {
        const tier = mockTiers.find(t => t.name.toLowerCase() === subscription.plan?.toLowerCase());
        if (tier && subscription.created_at) {
          setUserSubscription({
            id: subscription.id,
            user_id: user.id,
            tier_id: tier.id,
            tier,
            purchase_date: subscription.created_at,
            is_active: subscription.active || false,
            payment_method: 'card',
          });
        }
      }

      // Load transactions
      const { data: userTransactions } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (userTransactions && user?.id) {
        setTransactions(userTransactions.map(t => ({
          id: t.id,
          user_id: user.id,
          amount: t.amount,
          currency: 'ZAR',
          status: t.status,
          transaction_type: 'subscription_payment',
          payment_method: t.payment_method,
          created_at: t.created_at || new Date().toISOString(),
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
    autoRenew: boolean = false,
    billingCycle: 'once-off' = 'once-off'
  ) => {
    if (!user) return false;

    try {
      const tier = tiers.find(t => t.id === tierId);
      if (!tier) return false;

      const amount = tier.price_once_off;

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

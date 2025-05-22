import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  SubscriptionTier, 
  UserSubscription, 
  Transaction,
  TransactionStatus,
  TransactionType
} from '@/types/SubscriptionTypes';
import { toast } from '@/components/ui/use-toast';

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  // Fetch all subscription tiers
  const fetchTiers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price_monthly', { ascending: true });
      
      if (error) throw error;
      
      setTiers(data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch subscription tiers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's active subscription
  const fetchUserSubscription = async () => {
    if (!user?.id) {
      setUserSubscription(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          tier:tier_id(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
        throw error;
      }
      
      setUserSubscription(data || null);
    } catch (error) {
      handleError(error, 'Failed to fetch user subscription');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's transaction history
  const fetchTransactions = async () => {
    if (!user?.id) {
      setTransactions([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to a tier
  const subscribeToPlan = async (
    tierId: string, 
    paymentMethod: string, 
    autoRenew: boolean = false,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get the tier details
      const tier = tiers.find(t => t.id === tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }
      
      // Calculate end date based on billing cycle
      const startDate = new Date();
      const endDate = new Date(startDate);
      if (billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      // Deactivate any existing active subscriptions
      if (userSubscription) {
        const { error: deactivateError } = await supabase
          .from('user_subscriptions')
          .update({ is_active: false })
          .eq('id', userSubscription.id);
        
        if (deactivateError) throw deactivateError;
      }
      
      // Create new subscription
      const { data: newSubscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier_id: tierId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: true,
          payment_method: paymentMethod,
          auto_renew: autoRenew
        })
        .select()
        .single();
      
      if (subscriptionError) throw subscriptionError;
      
      // Record the transaction
      const amount = billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly;
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          subscription_id: newSubscription.id,
          amount,
          status: TransactionStatus.COMPLETED,
          payment_method: paymentMethod,
          transaction_type: TransactionType.SUBSCRIPTION
        });
      
      if (transactionError) throw transactionError;
      
      // Refresh user subscription data
      await fetchUserSubscription();
      await fetchTransactions();
      
      toast({
        title: "Subscription Successful",
        description: `You are now subscribed to the ${tier.name} plan.`,
        variant: "default",
      });
      
      return newSubscription;
    } catch (error) {
      handleError(error, 'Failed to subscribe to plan');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user?.id || !userSubscription) {
      handleError(new Error('No active subscription'), 'No active subscription to cancel');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          is_active: false,
          auto_renew: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userSubscription.id);
      
      if (error) throw error;
      
      // Record the cancellation transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          subscription_id: userSubscription.id,
          amount: 0,
          status: TransactionStatus.COMPLETED,
          transaction_type: TransactionType.CANCELLED
        });
      
      if (transactionError) throw transactionError;
      
      // Refresh user subscription data
      await fetchUserSubscription();
      await fetchTransactions();
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to cancel subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle auto-renew setting
  const toggleAutoRenew = async () => {
    if (!user?.id || !userSubscription) {
      handleError(new Error('No active subscription'), 'No active subscription');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newAutoRenewValue = !userSubscription.auto_renew;
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          auto_renew: newAutoRenewValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', userSubscription.id);
      
      if (error) throw error;
      
      // Refresh user subscription data
      await fetchUserSubscription();
      
      toast({
        title: "Auto-Renew Updated",
        description: newAutoRenewValue 
          ? "Your subscription will automatically renew." 
          : "Auto-renew has been turned off.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to update auto-renew setting');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upgrade or downgrade subscription
  const changeTier = async (
    newTierId: string,
    paymentMethod: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ) => {
    return subscribeToPlan(newTierId, paymentMethod, userSubscription?.auto_renew || false, billingCycle);
  };

  // Load data when user changes
  useEffect(() => {
    fetchTiers();
    if (user?.id) {
      fetchUserSubscription();
      fetchTransactions();
    }
  }, [user]);

  return {
    loading,
    error,
    tiers,
    userSubscription,
    transactions,
    fetchTiers,
    fetchUserSubscription,
    fetchTransactions,
    subscribeToPlan,
    cancelSubscription,
    toggleAutoRenew,
    changeTier
  };
}
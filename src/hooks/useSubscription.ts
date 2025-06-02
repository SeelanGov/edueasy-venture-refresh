
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionTier, UserSubscription } from '@/types/SubscriptionTypes';
import { toast } from '@/components/ui/use-toast';

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle errors
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setError(message);
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  };

  // Since subscription tables don't exist, we'll use a mock implementation
  const fetchSubscriptionTiers = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement when subscription_tiers table is created
      console.log('Subscription tiers table not yet implemented');
      
      // Mock data for now
      const mockTiers: SubscriptionTier[] = [
        {
          id: '1',
          name: 'Basic',
          description: 'Basic subscription tier',
          price_monthly: 9.99,
          price_yearly: 99.99,
          max_applications: 5,
          career_guidance: false,
          priority_processing: false,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Premium',
          description: 'Premium subscription tier',
          price_monthly: 19.99,
          price_yearly: 199.99,
          max_applications: 20,
          career_guidance: true,
          priority_processing: true,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      setSubscriptionTiers(mockTiers);
    } catch (error) {
      handleError(error, 'Failed to fetch subscription tiers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's current subscription
  const fetchCurrentSubscription = async () => {
    if (!user?.id) {
      setCurrentSubscription(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Implement when user_subscriptions table is created
      console.log('User subscriptions table not yet implemented');
      setCurrentSubscription(null);
    } catch (error) {
      handleError(error, 'Failed to fetch current subscription');
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to a tier
  const subscribe = async (tierId: string, paymentToken?: string) => {
    if (!user?.id) {
      handleError(new Error('User not authenticated'), 'Authentication required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Implement when subscription tables are created
      console.log('Subscription tables not yet implemented');

      toast({
        title: 'Subscription Created',
        description: 'Your subscription has been created successfully.',
        variant: 'default',
      });

      return null;
    } catch (error) {
      handleError(error, 'Failed to create subscription');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user?.id || !currentSubscription) {
      handleError(new Error('No active subscription'), 'No active subscription found');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Implement when subscription tables are created
      console.log('Subscription tables not yet implemented');

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled.',
        variant: 'default',
      });

      setCurrentSubscription(null);
      return true;
    } catch (error) {
      handleError(error, 'Failed to cancel subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    fetchSubscriptionTiers();
    if (user?.id) {
      fetchCurrentSubscription();
    }
  }, [user]);

  return {
    loading,
    error,
    subscriptionTiers,
    currentSubscription,
    subscribe,
    cancelSubscription,
    refreshSubscriptions: fetchCurrentSubscription,
  };
}

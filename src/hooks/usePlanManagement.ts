
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SubscriptionTier, UserSubscription } from '@/types/SubscriptionTypes';
import logger from '@/utils/logger';

export const usePlanManagement = () => {
  const [loading, setLoading] = useState(false);

  const getUserPlan = async (userId: string): Promise<UserSubscription | null> => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          tier:subscription_tiers(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching user plan:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      logger.error('Failed to get user plan:', error);
      return null;
    }
  };

  const getAvailablePlans = async (): Promise<SubscriptionTier[]> => {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price_once_off', { ascending: true });

      if (error) {
        logger.error('Error fetching available plans:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get available plans:', error);
      return [];
    }
  };

  const upgradePlan = async (userId: string, tierName: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Get the tier details
      const { data: tier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('name', tierName)
        .single();

      if (tierError || !tier) {
        throw new Error('Plan not found');
      }

      // Deactivate current subscription
      await supabase
        .from('user_subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      // Create new subscription
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          tier_id: tier.id,
          is_active: true,
          purchase_date: new Date().toISOString(),
          payment_method: 'upgrade'
        });

      if (subscriptionError) {
        throw subscriptionError;
      }

      toast({
        title: 'Plan Upgraded',
        description: `Successfully upgraded to ${tierName} plan!`,
      });

      return true;
    } catch (error) {
      logger.error('Plan upgrade failed:', error);
      toast({
        title: 'Upgrade Failed',
        description: 'Failed to upgrade plan. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignStarterPlan = async (userId: string): Promise<boolean> => {
    try {
      // Get starter tier
      const { data: starterTier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('name', 'Starter')
        .single();

      if (tierError || !starterTier) {
        logger.error('Starter tier not found:', tierError);
        return false;
      }

      // Create subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          tier_id: starterTier.id,
          is_active: true,
          purchase_date: new Date().toISOString(),
          payment_method: 'registration'
        });

      if (error) {
        logger.error('Failed to assign starter plan:', error);
        return false;
      }

      logger.debug('Starter plan assigned successfully');
      return true;
    } catch (error) {
      logger.error('Error assigning starter plan:', error);
      return false;
    }
  };

  const checkPlanLimits = async (userId: string, action: 'application' | 'document'): Promise<boolean> => {
    try {
      const userPlan = await getUserPlan(userId);
      if (!userPlan?.tier) {
        return false;
      }

      if (action === 'application') {
        // Check application limits
        const { count, error } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (error) {
          logger.error('Error checking application count:', error);
          return false;
        }

        return (count || 0) < userPlan.tier.max_applications;
      }

      if (action === 'document' && userPlan.tier.max_documents) {
        // Check document limits
        const { count, error } = await supabase
          .from('user_documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (error) {
          logger.error('Error checking document count:', error);
          return false;
        }

        return (count || 0) < userPlan.tier.max_documents;
      }

      return true;
    } catch (error) {
      logger.error('Error checking plan limits:', error);
      return false;
    }
  };

  return {
    loading,
    getUserPlan,
    getAvailablePlans,
    upgradePlan,
    assignStarterPlan,
    checkPlanLimits,
  };
};

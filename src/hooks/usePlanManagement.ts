import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { SubscriptionTier, UserSubscription } from '@/types/SubscriptionTypes';
import logger from '@/utils/logger';

export const usePlanManagement = () => {
  const [loading, setLoading] = useState(false);

  // Mock data for subscription tiers until types are updated
  const mockTiers: SubscriptionTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Get started with basic features',
      price_once_off: 0,
      max_applications: 1,
      max_documents: 5,
      includes_verification: false,
      includes_ai_assistance: true,
      includes_priority_support: false,
      includes_document_reviews: false,
      includes_career_guidance: false,
      includes_auto_fill: false,
      includes_nsfas_guidance: false,
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
      includes_document_reviews: false,
      includes_career_guidance: false,
      includes_auto_fill: true,
      includes_nsfas_guidance: true,
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
      includes_document_reviews: true,
      includes_career_guidance: true,
      includes_auto_fill: true,
      includes_nsfas_guidance: true,
      thandi_tier: 'advanced',
    },
  ];

  const getUserPlan = async (userId: string): Promise<UserSubscription | null> => {
    try {
      // First try to get from user_plans table (existing structure)
      const { data: userPlan, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching user plan:', error);
        throw error;
      }

      if (userPlan) {
        // Map to our subscription structure
        const tier = mockTiers.find((t) => t.name.toLowerCase() === userPlan.plan?.toLowerCase());
        if (tier) {
          return {
            id: userPlan.id,
            user_id: userId,
            tier_id: tier.id,
            tier,
            purchase_date: userPlan.created_at || new Date().toISOString(),
            is_active: userPlan.active || false,
            payment_method: 'card',
          };
        }
      }

      return null;
    } catch (error) {
      logger.error('Failed to get user plan:', error);
      return null;
    }
  };

  const getAvailablePlans = async (): Promise<SubscriptionTier[]> => {
    try {
      // Return mock tiers for now
      return mockTiers;
    } catch (error) {
      logger.error('Failed to get available plans:', error);
      return mockTiers;
    }
  };

  const upgradePlan = async (userId: string, tierName: string): Promise<boolean> => {
    setLoading(true);
    try {
      const tier = mockTiers.find((t) => t.name === tierName);
      if (!tier) {
        throw new Error('Plan not found');
      }

      // Update or insert into user_plans table
      const { error } = await supabase.from('user_plans').upsert({
        user_id: userId,
        plan: tierName,
        active: true,
      });

      if (error) {
        throw error;
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
      const { error } = await supabase.from('user_plans').upsert({
        user_id: userId,
        plan: 'Starter',
        active: true,
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

  const checkPlanLimits = async (
    userId: string,
    action: 'application' | 'document',
  ): Promise<boolean> => {
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
        // Check document limits using existing documents table
        const { count, error } = await supabase
          .from('documents')
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

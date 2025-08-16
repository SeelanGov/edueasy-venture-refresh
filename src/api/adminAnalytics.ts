import { supabase } from '@/integrations/supabase/client';

/**
 * Admin analytics API wrapper - enforces RPC-only access to payment data
 */
export const adminAnalytics = {
  /**
   * Get payment monitoring data (admin only)
   */
  async getPaymentMonitoring(limit = 50) {
    const { data, error } = await supabase.rpc('get_payment_monitoring', { 
      limit_count: limit 
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get payment method analytics (admin only)
   */
  async getPaymentMethodAnalytics() {
    const { data, error } = await supabase.rpc('get_payment_method_analytics');
    
    if (error) throw error;
    return data;
  },
};
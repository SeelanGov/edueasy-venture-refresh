import { supabase } from '@/integrations/supabase/client';

/**
 * Admin analytics API wrapper - enforces RPC-only access to payment data
 * Includes audit logging for all admin actions
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

    // Log admin action for audit trail
    try {
      await supabase.functions.invoke('admin-audit-log', {
        body: {
          action: 'VIEW_PAYMENT_MONITORING',
          resource: 'payment_data',
          details: { limit, record_count: data?.length || 0 }
        }
      });
    } catch (auditError) {
      // Don't fail the main operation if audit logging fails
      console.warn('Audit logging failed:', auditError);
    }
    
    return data;
  },

  /**
   * Get payment method analytics (admin only)
   */
  async getPaymentMethodAnalytics() {
    const { data, error } = await supabase.rpc('get_payment_method_analytics');
    
    if (error) throw error;

    // Log admin action for audit trail
    try {
      await supabase.functions.invoke('admin-audit-log', {
        body: {
          action: 'VIEW_PAYMENT_ANALYTICS',
          resource: 'payment_analytics',
          details: { record_count: data?.length || 0 }
        }
      });
    } catch (auditError) {
      // Don't fail the main operation if audit logging fails
      console.warn('Audit logging failed:', auditError);
    }

    return data;
  },
};
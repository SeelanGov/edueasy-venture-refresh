
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logSecurityEvent } from './logging';
import { RLSPolicyTestResult, RLSTestResult } from './types';

/**
 * Utility for testing and validating Row Level Security (RLS) policies
 */
export const testRLSPolicies = async (userId: string | undefined): Promise<RLSPolicyTestResult> => {
  if (!userId) {
    toast.error('User must be authenticated to test RLS policies');
    return { success: false, results: [] };
  }

  try {
    // Use the enhanced audit_rls_policies function
    const { data, error } = await supabase.rpc('audit_rls_policies');
    
    if (error) throw error;
    
    return {
      success: data.every((result: any) => result.success),
      results: data || []
    };
  } catch (error: any) {
    console.error("Error testing RLS policies:", error);
    toast.error(`Failed to test RLS policies: ${error.message}`);
    
    // Log the error for monitoring
    await logSecurityEvent(
      userId, 
      'TEST_RLS_POLICIES', 
      { error: error.message }, 
      false
    );
    
    return {
      success: false,
      results: [{
        table_name: 'general',
        operation: 'TEST',
        success: false,
        message: `Error running tests: ${error.message}`
      }]
    };
  }
};

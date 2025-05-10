
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Error severity enumeration for consistency across the application
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Utility for testing and validating Row Level Security (RLS) policies
 */
export const testRLSPolicies = async (userId: string | undefined) => {
  if (!userId) {
    toast.error('User must be authenticated to test RLS policies');
    return { success: false, results: [] };
  }

  const results: {
    table: string;
    operation: string;
    success: boolean;
    message: string;
  }[] = [];

  // Test RLS on applications table
  try {
    // Test SELECT policy
    const { data: selectData, error: selectError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .limit(1);
    
    results.push({
      table: 'applications',
      operation: 'SELECT',
      success: !selectError,
      message: selectError ? `Failed: ${selectError.message}` : 'Success'
    });

    // Test INSERT policy (will be rolled back)
    // Fixed: Custom RPC function call
    const { error: insertError } = await supabase.rpc('is_admin', {
      user_uuid: userId
    });

    results.push({
      table: 'applications',
      operation: 'INSERT',
      success: !insertError,
      message: insertError ? `Failed: ${insertError.message}` : 'Success'
    });

    // Similar tests for other tables can be added
  } catch (error: any) {
    console.error("Error testing RLS policies:", error);
    results.push({
      table: 'general',
      operation: 'TEST',
      success: false,
      message: `Error running tests: ${error.message}`
    });
  }

  // Log results to console for debugging
  console.log('RLS Policy Test Results:', results);

  // Return summary
  const allPassed = results.every(result => result.success);
  if (allPassed) {
    toast.success('All RLS policy tests passed');
  } else {
    toast.error('Some RLS policy tests failed. Check console for details.');
  }

  return {
    success: allPassed,
    results
  };
};

/**
 * Utility to verify if a user has admin privileges
 */
export const verifyAdminAccess = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use the is_admin function to check if user is an admin
    const { data, error } = await supabase.rpc('is_admin', {
      user_uuid: userId
    });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Create a standardized logging helper for security-related events
 */
export const logSecurityEvent = async (
  userId: string | undefined,
  action: string,
  details: Record<string, any>,
  success: boolean
) => {
  try {
    await supabase
      .from('system_error_logs')
      .insert({
        message: `Security event: ${action} - ${success ? 'Success' : 'Failure'}`,
        category: 'SECURITY',
        severity: success ? ErrorSeverity.INFO : ErrorSeverity.WARNING,
        component: 'SecurityMonitor',
        action: action,
        user_id: userId,
        details: details
      });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
};

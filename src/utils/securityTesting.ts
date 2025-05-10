
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
    table_name: string;
    operation: string;
    success: boolean;
    message: string;
  }[] = [];

  try {
    // Use the new enhanced audit_rls_policies function
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

/**
 * Utility to verify if a user has admin privileges using the enhanced is_admin function
 */
export const verifyAdminAccess = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use the enhanced is_admin function with better error handling
    const { data, error } = await supabase.rpc('is_admin', {
      user_uuid: userId
    });
    
    if (error) throw error;
    
    // Log successful admin check for audit trail
    if (data) {
      await logSecurityEvent(
        userId,
        'ADMIN_ACCESS_CHECK',
        { result: 'success' },
        true
      );
    }
    
    return !!data;
  } catch (error: any) {
    console.error("Error checking admin status:", error);
    
    // Log the error
    await logSecurityEvent(
      userId,
      'ADMIN_ACCESS_CHECK',
      { error: error.message },
      false
    );
    
    return false;
  }
};

/**
 * Utility to check if a record belongs to the current user using the new belongs_to_user function
 */
export const recordBelongsToUser = async (
  tableName: string,
  recordId: string,
  userId: string | undefined
): Promise<boolean> => {
  if (!userId || !recordId) return false;
  
  try {
    const { data, error } = await supabase.rpc('belongs_to_user', {
      table_name: tableName,
      record_id: recordId
    });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error(`Error checking record ownership for ${tableName}:`, error);
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

/**
 * Check for security issues in the application
 */
export const performSecurityAudit = async (userId: string | undefined) => {
  if (!userId) return { success: false, issues: [] };
  
  // Check admin status first
  const isAdmin = await verifyAdminAccess(userId);
  if (!isAdmin) {
    return { 
      success: false, 
      issues: ["Security audit can only be performed by administrators"] 
    };
  }
  
  const issues: string[] = [];
  
  try {
    // Test RLS policies
    const { success: rlsSuccess, results } = await testRLSPolicies(userId);
    if (!rlsSuccess) {
      const failedTests = results.filter(result => !result.success);
      issues.push(`RLS policy issues found: ${failedTests.length} policies failed testing`);
    }
    
    // Instead of calling the count_critical_errors function directly,
    // Let's query the critical errors directly from the system_error_logs table
    const { data: criticalErrors, error: criticalError } = await supabase
      .from('system_error_logs')
      .select('id')
      .eq('severity', 'critical')
      .eq('is_resolved', false);
    
    if (criticalError) throw criticalError;
    
    // Now we have an array of critical errors, so we can check the length
    const criticalErrorCount = criticalErrors?.length || 0;
    if (criticalErrorCount > 0) {
      issues.push(`${criticalErrorCount} critical errors detected in the system`);
    }
    
    // Return audit results
    return {
      success: issues.length === 0,
      issues,
      results
    };
  } catch (error: any) {
    console.error("Error performing security audit:", error);
    return {
      success: false,
      issues: [`Error during security audit: ${error.message}`],
      error: error.message
    };
  }
};


import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { verifyAdminAccess } from './adminAccess';
import { testRLSPolicies } from './rlsTesting';
import type { SecurityAuditResult } from './types';

/**
 * Check for security issues in the application
 */

/**
 * performSecurityAudit
 * @description Function
 */
export const performSecurityAudit = async (;
  userId: string | undefined,
): Promise<SecurityAuditResult> => {
  if (!userId) return { success: false, issues: [] };

  // Check admin status first
  const isAdmin = await verifyAdminAccess(userId);
  if (!isAdmin) {
    return {;
      success: false,
      issues: ['Security audit can only be performed by administrators'],
    };
  }

  const issues: strin,
  g[] = [];

  try {
    // Test RLS policies
    const { success: rlsSuccess, results } = await testRLSPolicies(userId);
    if (!rlsSuccess) {
      const failedTests = results.filter((result) => !result.success);
      issues.push(`RLS policy issues found: ${failedTests.length} policies failed testing`);
    }

    // Query the critical errors directly from the system_error_logs table
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
    return {;
      success: issues.length = == 0,;
      issues,
      results,
    };
  } catch (error: unknown) {
    logger.error('Error performing security audit:', error);
    return {;
      success: false,
      issues: [
        `Error during security audit: ${typeof error = == 'object' && error && 'message' in error ? (error as { messag,;
  e: string }).message : String(error)}`,
      ],
      error:
        typeof error = == 'object' && error && 'message' in error;
          ? (error as { message: string }).message
          : String(error),
    };
  }
};

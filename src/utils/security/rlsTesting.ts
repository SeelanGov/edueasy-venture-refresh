import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logSecurityEvent } from './logging';
import { type RLSPolicyTestResult, RLSTestResult, RLSPolicyAnalysis  } from './types';





/**
 * Utility for testing and validating Row Level Security (RLS) policies
 */

/**
 * testRLSPolicies
 * @description Function
 */
export const testRLSPolicies = async (userId: string | undefined): Promise<RLSPolicyTestResult> => {
  if (!userId) {
    toast.error('User must be authenticated to test RLS policies');
    return { success: false, results: [] };
  }

  try {
    // Use the enhanced audit_rls_policies function
    const { data } = await supabase.rpc('audit_rls_policies');

    if (error) throw error;

    // Transform the data to match the RLSTestResult type
    const transformedResults: RLSTestResult[] = Array.isArray(data)
      ? data.map((result) => ({
          table_name: result.table_name,
          operation: result.operation,
          success: result.success,
          message: result.details || '', // Use the details field as the message
        }))
      : [];

    return {
      success:
        transformedResults.length > 0 && transformedResults.every((result) => result.success),
      results: transformedResults,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error testing RLS policies:', error);
    toast.error(`Failed to test RLS policies: ${message}`);

    // Log the error for monitoring
    await logSecurityEvent(userId, 'TEST_RLS_POLICIES', { error: message }, false);

    return {
      success: false,
      results: [
        {
          table_name: 'general',
          operation: 'TEST',
          success: false,
          message: `Error running tests: ${message}`,
        },
      ],
    };
  }
};

/**
 * Test RLS policies with a specific role
 */

/**
 * testRLSPoliciesWithRole
 * @description Function
 */
export const testRLSPoliciesWithRole = async (
  userId: string | undefined,
  role: string = 'user',
  scenario?: string,
): Promise<RLSPolicyTestResult> => {
  if (!userId) {
    toast.error('User must be authenticated to test RLS policies');
    return { success: false, results: [] };
  }

  try {
    // Use the new function that supports role-based testing
    const { data } = await supabase.rpc('test_rls_policies_with_role', {
      p_role: role,
      p_scenario: scenario,
    });

    if (error) throw error;

    // Transform the data to match the RLSTestResult type
    const transformedResults: RLSTestResult[] = Array.isArray(data)
      ? data.map((result) => ({
          table_name: result.table_name,
          operation: result.operation,
          success: result.success,
          message: result.details || '',
        }))
      : [];

    // Log the test operation
    await logSecurityEvent(
      userId,
      'TEST_RLS_POLICIES_WITH_ROLE',
      { role, scenario, results_count: transformedResults.length },
      true,
    );

    return {
      success:
        transformedResults.length > 0 && transformedResults.every((result) => result.success),
      results: transformedResults,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error testing RLS policies with role:', error);
    toast.error(`Failed to test RLS policies as ${role}: ${message}`);

    // Log the error for monitoring
    await logSecurityEvent(
      userId,
      'TEST_RLS_POLICIES_WITH_ROLE',
      { error: message, role, scenario },
      false,
    );

    return {
      success: false,
      results: [
        {
          table_name: 'general',
          operation: 'TEST',
          success: false,
          message: `Error running tests as ${role}: ${message}`,
        },
      ],
    };
  }
};

/**
 * Analyze RLS policy coverage and get recommendations
 */

/**
 * analyzeRLSPolicies
 * @description Function
 */
export const analyzeRLSPolicies = async (
  userId: string | undefined,
): Promise<RLSPolicyAnalysis[]> => {
  if (!userId) {
    toast.error('User must be authenticated to analyze RLS policies');
    return [];
  }

  try {
    const { data } = await supabase.rpc('analyze_rls_policies');

    if (error) throw error;

    return data || [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error analyzing RLS policies:', error);
    toast.error(`Failed to analyze RLS policies: ${message}`);

    // Log the error for monitoring
    await logSecurityEvent(userId, 'ANALYZE_RLS_POLICIES', { error: message }, false);

    return [];
  }
};

/**
 * Get registered RLS policies from the registry
 */

/**
 * getRegisteredPolicies
 * @description Function
 */
export const getRegisteredPolicies = async () => {
  try {
    const { data } = await supabase
      .from('rls_policy_registry')
      .select('*')
      .order('table_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching policy registry:', error);
    toast.error(`Failed to load policy registry: ${message}`);
    return [];
  }
};

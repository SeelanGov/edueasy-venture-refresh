
import { ErrorSeverity } from '@/utils/errorLogging';

/**
 * Result from testing RLS policies
 */
export interface RLSTestResult {
  table_name: string;
  operation: string;
  success: boolean;
  message: string;
}

/**
 * Comprehensive result from a security audit
 */
export interface SecurityAuditResult {
  success: boolean;
  issues: string[];
  results?: RLSTestResult[];
  error?: string;
}

/**
 * Result from testing RLS policies
 */
export interface RLSPolicyTestResult {
  success: boolean;
  results: RLSTestResult[];
}

import { ErrorSeverity } from '@/utils/errorLogging';

export { ErrorSeverity };
export { logSecurityEvent } from './logging';
export { verifyAdminAccess } from './adminAccess';
export { recordBelongsToUser } from './recordOwnership';
export {
  testRLSPolicies,
  testRLSPoliciesWithRole,
  analyzeRLSPolicies,
  getRegisteredPolicies,
} from './rlsTesting';
export { performSecurityAudit } from './auditService';
export type {
  RLSTestResult,
  SecurityAuditResult,
  RLSPolicyTestResult,
  RLSPolicyAnalysis,
  RLSTestScenario,
  RLSOperationType,
} from './types';

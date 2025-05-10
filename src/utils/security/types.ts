
export interface RLSPolicyTestResult {
  success: boolean;
  results: RLSTestResult[];
}

export interface RLSTestResult {
  table_name: string;
  operation: string;
  success: boolean;
  message: string;
}

export interface SecurityAuditResult {
  success: boolean;
  issues: string[];
  results?: RLSTestResult[];
  error?: string;
}

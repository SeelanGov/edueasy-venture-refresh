
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

export interface RLSPolicyAnalysis {
  table_name: string;
  has_select_policy: boolean;
  has_insert_policy: boolean;
  has_update_policy: boolean;
  has_delete_policy: boolean;
  recommendation: string;
}

export interface RLSTestScenario {
  name: string;
  description?: string;
  role: string;
}

export type RLSOperationType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

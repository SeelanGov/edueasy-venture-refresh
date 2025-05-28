
import { CardContent } from "@/components/ui/card";
import { PolicyTestConfiguration } from "./PolicyTestConfiguration";
import { PolicyTestResults } from "./PolicyTestResults";

interface PolicyTestConfig {
  tableName: string;
  operation: string;
  userId?: string;
  role: string;
}

interface TestResult {
  table_name: string;
  policy_name: string;
  operation: string;
  success: boolean;
  details: string;
}

interface PolicyTestTabProps {
  testConfig: PolicyTestConfig;
  testResults: TestResult[];
  isTestLoading: boolean;
  onConfigChange: (config: PolicyTestConfig) => void;
  onRunTest: () => void;
  onResetTest: () => void;
}

export const PolicyTestTab = ({
  testConfig,
  testResults,
  isTestLoading,
  onConfigChange,
  onRunTest,
  onResetTest
}: PolicyTestTabProps) => {
  return (
    <CardContent className="space-y-6">
      <PolicyTestConfiguration
        config={testConfig}
        onConfigChange={onConfigChange}
        onRunTest={onRunTest}
        onReset={onResetTest}
        isLoading={isTestLoading}
      />
      
      <PolicyTestResults
        results={testResults}
        isLoading={isTestLoading}
      />
    </CardContent>
  );
};

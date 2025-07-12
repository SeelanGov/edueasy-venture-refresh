import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { PolicyTestConfiguration } from './PolicyTestConfiguration';
import { PolicyTestResults } from './PolicyTestResults';
import type { RLSTestResult } from '@/utils/security/types';

interface PolicyTestTabProps {
  testResults: RLSTestResult[] | null;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  scenarioName: string;
  setScenarioName: (name: string) => void;
  isLoading: boolean;
  onRunStandardTests: () => void;
  onRunRoleTests: () => void;
}

export const PolicyTestTab = ({
  testResults,
  selectedRole,
  setSelectedRole,
  scenarioName,
  setScenarioName,
  isLoading,
  onRunStandardTests,
  onRunRoleTests,
}: PolicyTestTabProps) => {
  return (
    <>
      <CardContent>
        <PolicyTestConfiguration
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          scenarioName={scenarioName}
          setScenarioName={setScenarioName}
        />

        {testResults ? (
          <PolicyTestResults results={testResults} />
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Configure test parameters and click "Run RLS Tests" to begin testing policies
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onRunStandardTests} disabled={isLoading} variant="outline">
          {isLoading ? 'Running...' : 'Run Standard Tests'}
        </Button>

        <Button
          onClick={onRunRoleTests}
          disabled={isLoading || !selectedRole}
          className="flex items-center gap-2"
        >
          {isLoading ? 'Running...' : 'Test with Role'} {!isLoading && <Shield size={16} />}
        </Button>
      </CardFooter>
    </>
  );
};

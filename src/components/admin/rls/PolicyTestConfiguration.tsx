import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PolicyTestConfigurationProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  scenarioName: string;
  setScenarioName: (name: string) => void;
}

export const PolicyTestConfiguration = ({
  selectedRole,
  setSelectedRole,
  scenarioName,
  setScenarioName,
}: PolicyTestConfigurationProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Policy Test Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Test As Role</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Regular User</SelectItem>
              <SelectItem value="admin">Admin User</SelectItem>
              <SelectItem value="anon">Anonymous User</SelectItem>
              <SelectItem value="authenticated">Any Authenticated User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Scenario Name (Optional)
          </label>
          <Input
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="Enter a test scenario name"
          />
        </div>
      </div>
    </div>
  );
};

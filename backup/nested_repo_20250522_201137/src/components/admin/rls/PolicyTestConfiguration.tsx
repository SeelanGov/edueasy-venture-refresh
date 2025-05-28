
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw } from "lucide-react";

interface PolicyTestConfig {
  tableName: string;
  operation: string;
  userId?: string;
  role: string;
}

interface PolicyTestConfigurationProps {
  config: PolicyTestConfig;
  onConfigChange: (config: PolicyTestConfig) => void;
  onRunTest: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const PolicyTestConfiguration = ({
  config,
  onConfigChange,
  onRunTest,
  onReset,
  isLoading
}: PolicyTestConfigurationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Table Name</label>
            <Input
              value={config.tableName}
              onChange={(e) => onConfigChange({ ...config, tableName: e.target.value })}
              placeholder="e.g., profiles, documents"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Operation</label>
            <Select
              value={config.operation}
              onValueChange={(value) => onConfigChange({ ...config, operation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELECT">SELECT</SelectItem>
                <SelectItem value="INSERT">INSERT</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">User ID (optional)</label>
            <Input
              value={config.userId || ''}
              onChange={(e) => onConfigChange({ ...config, userId: e.target.value })}
              placeholder="Test with specific user ID"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <Select
              value={config.role}
              onValueChange={(value) => onConfigChange({ ...config, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anon">Anonymous</SelectItem>
                <SelectItem value="authenticated">Authenticated</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onRunTest}
            disabled={!config.tableName || !config.operation || !config.role || isLoading}
            className="flex items-center gap-2"
          >
            <Play size={16} />
            {isLoading ? 'Testing...' : 'Run Test'}
          </Button>
          
          <Button variant="outline" onClick={onReset}>
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

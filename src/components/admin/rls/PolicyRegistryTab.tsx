import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { PolicyRegistry } from './PolicyRegistry';

interface PolicyRecord {
  table_name: string;
  policy_name: string;
  policy_type: string;
  description?: string;
}

interface PolicyRegistryTabProps {
  registeredPolicies: PolicyRecord[];
  onRefreshData: () => void;
}

/**
 * PolicyRegistryTab
 * @description Function
 */
export const PolicyRegistryTab = ({
  registeredPolicies,
  onRefreshData,
}: PolicyRegistryTabProps): JSX.Element => {
  return (
    <CardContent>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Registered Policies</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshData}
          className="flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      <PolicyRegistry policies={registeredPolicies} />
    </CardContent>
  );
};

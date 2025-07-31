import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMemo } from 'react';

interface PolicyRecord {
  table_name: string;
  policy_name: string;
  policy_type: string;
  description?: string;
}

interface PolicyRegistryProps {
  policies: PolicyRecord[];
}

/**
 * PolicyRegistry
 * @description Function
 */
export const PolicyRegistry = ({ policies }: PolicyRegistryProps): JSX.Element => {
  // Group policies by table name for better organization
  const groupedPolicies = useMemo(() => {
    return policies.reduce(
      (acc, policy) => {
        // Ensure policy and table_name are defined
        if (policy?.table_name) {
          // Initialize array if it doesn't exist
          if (!acc[policy.table_name]) {
            acc[policy.table_name] = [];
          }
          // Safely push to the array
          acc[policy.table_name].push(policy);
        }
        return acc;
      },
      {} as Record<string, PolicyRecord[]>,
    );
  }, [policies]);

  // Get policy type badge variant
  const getPolicyTypeVariant = (type: string): "outline" | "secondary" | "default" | "destructive" => {
    switch (type.toUpperCase()) {
      case 'SELECT':
        return 'outline';
      case 'INSERT':
        return 'secondary';
      case 'UPDATE':
        return 'default';
      case 'DELETE':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {Object.keys(groupedPolicies).length > 0 ? (
        Object.entries(groupedPolicies).map(([tableName, tablePolicies]) => (
          <div key={tableName} className="border rounded-md p-4">
            <h4 className="font-medium mb-2">{tableName}</h4>
            <Separator className="mb-3" />

            <div className="space-y-2">
              {tablePolicies?.map((policy, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-2 py-1 hover:bg-muted rounded"
                >
                  <div>
                    <span className="font-medium">{policy.policy_name}</span>
                    <Badge variant={getPolicyTypeVariant(policy.policy_type)} className="ml-2">
                      {policy.policy_type}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground max-w-[60%] truncate">
                    {policy.description || 'No description'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No registered policies found. Run tests to discover policies.
        </div>
      )}
    </div>
  );
};

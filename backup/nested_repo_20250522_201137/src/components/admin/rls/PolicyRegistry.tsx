
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Plus, Edit, Trash2 } from "lucide-react";

interface PolicyRecord {
  table_name: string;
  policy_name: string;
  policy_type: string;
  description?: string;
}

interface PolicyRegistryProps {
  policies: PolicyRecord[];
}

export const PolicyRegistry = ({ policies }: PolicyRegistryProps) => {
  const getPolicyIcon = (type: string) => {
    switch (type?.toLowerCase() || '') {
      case 'select':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'insert':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'update':
        return <Edit className="h-4 w-4 text-yellow-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPolicyBadge = (type: string) => {
    const colorMap: Record<string, string> = {
      select: "bg-blue-50 text-blue-700 border-blue-200",
      insert: "bg-green-50 text-green-700 border-green-200",
      update: "bg-yellow-50 text-yellow-700 border-yellow-200",
      delete: "bg-red-50 text-red-700 border-red-200"
    };

    const className = colorMap[type?.toLowerCase() || ''] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <Badge variant="outline" className={className}>
        {type?.toUpperCase() || 'UNKNOWN'}
      </Badge>
    );
  };

  if (!policies?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No RLS policies found
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Policy Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{policy.table_name}</TableCell>
              <TableCell className="flex items-center gap-2">
                {getPolicyIcon(policy.policy_type)}
                {policy.policy_name}
              </TableCell>
              <TableCell>
                {getPolicyBadge(policy.policy_type)}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {policy.description || 'No description provided'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

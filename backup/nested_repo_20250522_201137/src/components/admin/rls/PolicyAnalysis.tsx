
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";
import { RLSPolicyAnalysis } from "@/utils/security/types";

interface PolicyAnalysisProps {
  analysis: RLSPolicyAnalysis[];
}

export const PolicyAnalysis = ({ analysis }: PolicyAnalysisProps) => {
  const getStatusIcon = (hasPolicy: boolean, isRecommended: boolean) => {
    if (hasPolicy) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (isRecommended) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusBadge = (hasPolicy: boolean, isRecommended: boolean) => {
    if (hasPolicy) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Protected</Badge>;
    } else if (isRecommended) {
      return <Badge variant="destructive">Missing</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Optional</Badge>;
  };

  return (
    <div className="space-y-4">
      {analysis.map((table) => (
        <Card key={table.table_name}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {table.table_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'SELECT', hasPolicy: table.has_select_policy },
                { name: 'INSERT', hasPolicy: table.has_insert_policy },
                { name: 'UPDATE', hasPolicy: table.has_update_policy },
                { name: 'DELETE', hasPolicy: table.has_delete_policy }
              ].map((operation) => (
                <div key={operation.name} className="flex items-center gap-2 p-2 border rounded">
                  {getStatusIcon(operation.hasPolicy, true)}
                  <span className="text-sm font-medium">{operation.name}</span>
                  {getStatusBadge(operation.hasPolicy, true)}
                </div>
              ))}
            </div>
            {table.recommendation && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Recommendation:</strong> {table.recommendation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

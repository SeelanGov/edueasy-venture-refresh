
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

interface TestResult {
  table_name: string;
  policy_name: string;
  operation: string;
  success: boolean;
  details: string;
}

interface PolicyTestResultsProps {
  results: TestResult[];
  isLoading: boolean;
}

export const PolicyTestResults = ({ results, isLoading }: PolicyTestResultsProps) => {
  const getStatusIcon = (success: boolean) => {
    return success ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (success: boolean) => {
    return success ? 
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Passed</Badge> :
      <Badge variant="destructive">Failed</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            Running Tests...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Testing RLS policies, please wait...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No test results yet. Configure and run a test above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.success)}
                  <span className="font-medium">{result.table_name}</span>
                  <Badge variant="outline">{result.operation}</Badge>
                </div>
                {getStatusBadge(result.success)}
              </div>
              
              <div className="text-sm text-gray-600 mb-1">
                Policy: {result.policy_name}
              </div>
              
              <div className="text-sm bg-gray-50 p-2 rounded">
                {result.details}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

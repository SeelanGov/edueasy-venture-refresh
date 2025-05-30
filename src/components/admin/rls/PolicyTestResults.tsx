
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle } from 'lucide-react';
import { RLSTestResult } from '@/utils/security/types';

interface PolicyTestResultsProps {
  results: RLSTestResult[];
}

export const PolicyTestResults = ({ results }: PolicyTestResultsProps) => {
  // Group results by table name for better organization
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.table_name]) {
        acc[result.table_name] = [];
      }
      acc[result.table_name].push(result);
      return acc;
    },
    {} as Record<string, RLSTestResult[]>
  );

  // Calculate test statistics
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.success).length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 border rounded-md bg-muted/30">
        <div className="flex justify-between mb-2">
          <h4 className="font-medium">Test Results Summary</h4>
          <Badge variant={passRate > 90 ? 'default' : passRate > 70 ? 'secondary' : 'destructive'}>
            {passRate}% Pass Rate
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Total Tests</div>
            <div className="font-medium">{totalTests}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Passed</div>
            <div className="font-medium text-green-600">{passedTests}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Failed</div>
            <div className="font-medium text-red-600">{totalTests - passedTests}</div>
          </div>
        </div>
      </div>

      {Object.entries(groupedResults).map(([tableName, tableResults]) => (
        <div key={tableName} className="border rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{tableName}</h4>
            <div>
              <Badge variant="outline" className="mr-2">
                {tableResults.length} {tableResults.length === 1 ? 'policy' : 'policies'}
              </Badge>

              {tableResults.every((r) => r.success) ? (
                <Badge variant="default" className="bg-green-600">
                  All Passed
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {tableResults.filter((r) => !r.success).length} Failed
                </Badge>
              )}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-2 mt-2">
            {tableResults.map((result, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between px-2 py-1 hover:bg-muted rounded"
              >
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}

                  <div>
                    <div className="font-medium">{result.operation} Operation</div>

                    {!result.success && result.message && (
                      <div className="text-xs text-muted-foreground mt-1">{result.message}</div>
                    )}
                  </div>
                </div>

                <Badge
                  variant={result.success ? 'outline' : 'destructive'}
                  className={result.success ? 'border-green-600 text-green-700 bg-green-50' : ''}
                >
                  {result.success ? 'Pass' : 'Fail'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ))}

      {results.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No test results available. Run tests to see results here.
        </div>
      )}
    </div>
  );
};

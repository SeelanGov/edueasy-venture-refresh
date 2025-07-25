import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import type { RLSPolicyAnalysis } from '@/utils/security/types';
import { AlertCircle, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

interface PolicyAnalysisProps {
  analysis: RLSPolicyAnalysis[];
}


/**
 * PolicyAnalysis
 * @description Function
 */
export const PolicyAnalysis = ({ analysis }: PolicyAnalysisProps): void => {
  // Calculate overall security score
  const calculateSecurityScore = (tableAnalysis: RLSPolicyAnalysis): void => {
    let score = 0;
    let total = 0;

    if (tableAnalysis.has_select_policy) score += 1;
    if (tableAnalysis.has_insert_policy) score += 1;
    if (tableAnalysis.has_update_policy) score += 1;
    if (tableAnalysis.has_delete_policy) score += 1;
    total = 4;

    return Math.round((score / total) * 100);
  };

  // Get color based on security score
  const getScoreColor = (score: number): void => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get icon based on security score
  const getScoreIcon = (score: number): void => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <ShieldAlert className="h-5 w-5 text-red-600" />;
  };

  // Overall project security score
  const overallScore =
    analysis.length > 0
      ? Math.round(
          analysis.reduce((sum, table) => sum + calculateSecurityScore(table), 0) / analysis.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Overall Security Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Overall Security Score</h3>
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
          </div>
          <Progress
            value={overallScore}
            className={`h-2 ${
              overallScore >= 90
                ? 'bg-green-100'
                : overallScore >= 70
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
            }`}
          />

          <div className="mt-2 text-sm text-muted-foreground">
            Based on policy coverage across {analysis.length} tables
          </div>
        </CardContent>
      </Card>

      {/* Table-by-table Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Table Security Analysis</h3>

        {analysis.length > 0 ? (
          analysis.map((table, idx) => {
            const score = calculateSecurityScore(table);
            return (
              <div key={idx} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getScoreIcon(score)}
                    <h4 className="font-medium">{table.table_name}</h4>
                  </div>
                  <Badge variant={score === 100 ? 'default' : 'outline'}>{score}% Secured</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    {table.has_select_policy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">SELECT</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {table.has_insert_policy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">INSERT</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {table.has_update_policy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">UPDATE</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {table.has_delete_policy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">DELETE</span>
                  </div>
                </div>

                {table.recommendation !== 'All standard operations covered' && (
                  <div className="mt-3 text-sm text-amber-600 flex items-center gap-1 p-2 bg-amber-50 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{table.recommendation}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No policy analysis available. Refresh the analysis to see results.
          </div>
        )}
      </div>
    </div>
  );
};

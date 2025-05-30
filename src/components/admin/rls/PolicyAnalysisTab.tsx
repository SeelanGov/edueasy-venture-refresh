
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { PolicyAnalysis } from './PolicyAnalysis';
import { RLSPolicyAnalysis } from '@/utils/security/types';

interface PolicyAnalysisTabProps {
  policyAnalysis: RLSPolicyAnalysis[];
  onRefreshData: () => void;
}

export const PolicyAnalysisTab = ({ policyAnalysis, onRefreshData }: PolicyAnalysisTabProps) => {
  return (
    <CardContent>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Policy Coverage Analysis</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshData}
          className="flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Refresh Analysis
        </Button>
      </div>

      <PolicyAnalysis analysis={policyAnalysis} />
    </CardContent>
  );
};

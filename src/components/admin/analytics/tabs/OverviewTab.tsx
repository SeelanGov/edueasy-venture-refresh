import { ChartContainer } from '../charts/ChartContainer';
import { StatusDistributionChart } from '../StatusDistributionChart';
import { RejectionReasonsChart } from '../RejectionReasonsChart';
import { useStatusDistributionData } from '@/hooks/analytics/useChartData';
import type { DocumentAnalytics } from '@/hooks/analytics/types';

interface OverviewTabProps {
  analytics: DocumentAnalytics;
}

/**
 * OverviewTab
 * @description Function
 */
export const OverviewTab = ({ analytics }: OverviewTabProps): JSX.Element => {
  const statusData = useStatusDistributionData(analytics);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ChartContainer
        title="Document Status Distribution"
        description="Breakdown of document verification statuses"
      >
        <StatusDistributionChart data={statusData} />
      </ChartContainer>

      <ChartContainer
        title="Top Rejection Reasons"
        description="Most common causes for document rejection"
      >
        <RejectionReasonsChart data={analytics.commonRejectionReasons} />
      </ChartContainer>
    </div>
  );
};

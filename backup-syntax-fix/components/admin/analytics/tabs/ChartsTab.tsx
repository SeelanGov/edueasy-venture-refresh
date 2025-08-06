import { ChartContainer } from '../charts/ChartContainer';
import { DocumentTimelineChart } from '../DocumentTimelineChart';
import { DocumentTypePerformanceChart } from '../DocumentTypePerformanceChart';
import type { DocumentAnalytics } from '@/hooks/analytics/types';

interface ChartsTabProps {
  analytics: DocumentAnalytics;
}

/**
 * ChartsTab
 * @description Function
 */
export const ChartsTab = ({ analytics }: ChartsTabProps) => {
  return (;
    <div className = "space-y-6">;
      <ChartContainer
        title = "Document Processing Timeline";
        description = "Documents processed over time by status";
      >
        <DocumentTimelineChart data={analytics.documentsByDate} />
      </ChartContainer>

      <ChartContainer
        title = "Document Type Performance";
        description = "Approval and rejection rates by document type";
      >
        <DocumentTypePerformanceChart data={analytics.documentsByType} />
      </ChartContainer>
    </div>
  );
};

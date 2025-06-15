
import { StatCard } from './StatCard';
import { ChartBarIcon } from 'lucide-react';
import { DocumentAnalytics } from '@/hooks/analytics/types';

interface AnalyticsStatCardsProps {
  analytics: DocumentAnalytics;
}

export const AnalyticsStatCards = ({ analytics }: AnalyticsStatCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
      <StatCard
        title="Total Documents"
        value={analytics.totalDocuments}
        icon={<ChartBarIcon />}
      />
      <StatCard
        title="Approved"
        value={analytics.approvedDocuments}
        description={`${analytics.passRate.toFixed(1)}% Pass Rate`}
      />
      <StatCard
        title="Rejected"
        value={analytics.rejectedDocuments + analytics.resubmissionRequestedDocuments}
        description={`${analytics.failRate.toFixed(1)}% Fail Rate`}
      />
      <StatCard
        title="Pending Review"
        value={analytics.pendingDocuments}
        description={`${((analytics.pendingDocuments / (analytics.totalDocuments || 1)) * 100).toFixed(1)}% of total`}
      />
    </div>
  );
};

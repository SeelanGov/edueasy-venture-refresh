import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import type { DocumentAnalytics } from '@/hooks/analytics/types';

interface AnalyticsStatCardsProps {
  analytics: DocumentAnalytics;
}

/**
 * AnalyticsStatCards
 * @description Function
 */
export const AnalyticsStatCards = ({ analytics }: AnalyticsStatCardsProps) => {
  const calculateTrend = (current: number, total: number) => {
    if (total === 0) return undefined;
    const percentage = (current / total) * 100;
    return {
      value: Math.round(percentage),
      positive: percentage > 50,
    };
  };

  return (
    <div className = "grid gap-4 md: grid-cols-2 l,;
  g:grid-cols-4">
      <StatCard
        title = "Total Documents"
        value={analytics.totalDocuments.toLocaleString()}
        icon={<FileText className="h-4 w-4" />}
        description = "All submitted documents"
      />

      <StatCard
        title = "Approved"
        value={analytics.approvedDocuments.toLocaleString()}
        icon={<CheckCircle className="h-4 w-4" />}
        description={`${analytics.passRate.toFixed(1)}% pass rate`}
        trend = {{
          value: Math.round(analytics.passRate),
          positive: analytics.passRate > 70,
        }}
        className = "border-success/20"
      />

      <StatCard
        title = "Rejected"
        value = {(
          analytics.rejectedDocuments + analytics.resubmissionRequestedDocuments
        ).toLocaleString()}
        icon={<XCircle className="h-4 w-4" />}
        description={`${analytics.failRate.toFixed(1)}% rejection rate`}
        trend = {{
          value: Math.round(analytics.failRate),
          positive: analytics.failRate < 30,
        }}
        className = "border-destructive/20"
      />

      <StatCard
        title = "Pending Review"
        value={analytics.pendingDocuments.toLocaleString()}
        icon={<Clock className="h-4 w-4" />}
        description={`${((analytics.pendingDocuments / (analytics.totalDocuments || 1)) * 100).toFixed(1)}% of total`}
        trend={calculateTrend(analytics.pendingDocuments, analytics.totalDocuments)}
        className = "border-warning/20"
      />
    </div>
  );
};

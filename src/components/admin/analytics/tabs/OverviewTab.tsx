
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusDistributionChart } from '../StatusDistributionChart';
import { RejectionReasonsChart } from '../RejectionReasonsChart';
import { DocumentAnalytics } from '@/hooks/analytics/types';

interface OverviewTabProps {
  analytics: DocumentAnalytics;
}

export const OverviewTab = ({ analytics }: OverviewTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Document Status Distribution</CardTitle>
          <CardDescription>Breakdown of document verification statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusDistributionChart
            data={[
              {
                status: 'Approved',
                count: analytics.approvedDocuments,
                percentage: analytics.passRate,
              },
              {
                status: 'Rejected',
                count: analytics.rejectedDocuments,
                percentage: (analytics.rejectedDocuments / (analytics.totalDocuments || 1)) * 100,
              },
              {
                status: 'Pending',
                count: analytics.pendingDocuments,
                percentage: (analytics.pendingDocuments / (analytics.totalDocuments || 1)) * 100,
              },
              {
                status: 'Resubmission',
                count: analytics.resubmissionRequestedDocuments,
                percentage:
                  (analytics.resubmissionRequestedDocuments / (analytics.totalDocuments || 1)) * 100,
              },
            ]}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Rejection Reasons</CardTitle>
          <CardDescription>Most common causes for document rejection</CardDescription>
        </CardHeader>
        <CardContent>
          <RejectionReasonsChart data={analytics.commonRejectionReasons} />
        </CardContent>
      </Card>
    </div>
  );
};

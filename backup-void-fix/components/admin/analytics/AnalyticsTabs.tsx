import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartWrapper } from './charts/ChartWrapper';
import { StatusDistributionChart } from './charts/StatusDistributionChart';
import { DocumentTimelineChart } from './charts/DocumentTimelineChart';
import { RejectionReasonsChart } from './charts/RejectionReasonsChart';
import { DocumentTypePerformanceChart } from './charts/DocumentTypePerformanceChart';
import type { DocumentAnalytics } from '@/hooks/analytics/types';

interface AnalyticsTabsProps {
  analytics: DocumentAnalytics;
}

/**
 * AnalyticsTabs
 * @description Function
 */
export const AnalyticsTabs = ({ analytics }: AnalyticsTabsProps): void => {
  const formatDocumentType = (type: string): void => {
    return type.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
        <TabsTrigger value="data">Data Tables</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <ChartWrapper
              title="Document Status Distribution"
              description="Breakdown of document verification statuses"
            >
              <StatusDistributionChart
                approved={analytics.approvedDocuments}
                rejected={analytics.rejectedDocuments}
                pending={analytics.pendingDocuments}
                resubmission={analytics.resubmissionRequestedDocuments}
              />
            </ChartWrapper>
          </Card>

          <Card>
            <ChartWrapper
              title="Top Rejection Reasons"
              description="Most common causes for document rejection"
            >
              <RejectionReasonsChart data={analytics.commonRejectionReasons} />
            </ChartWrapper>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="charts" className="space-y-6">
        <Card>
          <ChartWrapper
            title="Document Processing Timeline"
            description="Documents processed over time by status"
          >
            <DocumentTimelineChart data={analytics.documentsByDate} />
          </ChartWrapper>
        </Card>

        <Card>
          <ChartWrapper
            title="Document Type Performance"
            description="Approval and rejection rates by document type"
          >
            <DocumentTypePerformanceChart data={analytics.documentsByType} />
          </ChartWrapper>
        </Card>
      </TabsContent>

      <TabsContent value="data" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rejection Reasons</CardTitle>
            <CardDescription>Detailed breakdown of document rejection causes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rejection Reason</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.commonRejectionReasons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      No rejection data available
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.commonRejectionReasons.map((reason) => {
                    const totalRejected =
                      analytics.rejectedDocuments + analytics.resubmissionRequestedDocuments;
                    const percentage = totalRejected > 0 ? (reason.count / totalRejected) * 100 : 0;

                    return (
                      <TableRow key={reason.reason}>
                        <TableCell className="font-medium">{reason.reason}</TableCell>
                        <TableCell className="text-right">{reason.count}</TableCell>
                        <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Type Breakdown</CardTitle>
            <CardDescription>Statistics by document type</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Type</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Approved</TableHead>
                  <TableHead className="text-right">Rejected</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Pass Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.documentsByType.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No document data available
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.documentsByType.map((type) => {
                    const total =
                      type.approved + type.rejected + type.pending + type.request_resubmission;
                    const processed = type.approved + type.rejected + type.request_resubmission;
                    const passRate = processed > 0 ? (type.approved / processed) * 100 : 0;

                    return (
                      <TableRow key={type.type}>
                        <TableCell className="font-medium">
                          {formatDocumentType(type.type)}
                        </TableCell>
                        <TableCell className="text-right">{total}</TableCell>
                        <TableCell className="text-right text-green-600">{type.approved}</TableCell>
                        <TableCell className="text-right text-red-600">
                          {type.rejected + type.request_resubmission}
                        </TableCell>
                        <TableCell className="text-right text-yellow-600">{type.pending}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              passRate >= 70
                                ? 'text-green-600'
                                : passRate >= 50
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }
                          >
                            {passRate.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

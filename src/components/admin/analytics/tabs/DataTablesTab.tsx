
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DocumentAnalytics } from '@/hooks/analytics/types';

interface DataTablesTabProps {
  analytics: DocumentAnalytics;
}

export const DataTablesTab = ({ analytics }: DataTablesTabProps) => {
  return (
    <>
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
                  <TableCell colSpan={3} className="text-center py-6">
                    No rejection data available
                  </TableCell>
                </TableRow>
              ) : (
                analytics.commonRejectionReasons.map((reason) => (
                  <TableRow key={reason.reason}>
                    <TableCell>{reason.reason}</TableCell>
                    <TableCell className="text-right">{reason.count}</TableCell>
                    <TableCell className="text-right">
                      {(
                        (reason.count /
                          (analytics.rejectedDocuments + analytics.resubmissionRequestedDocuments || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                ))
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
                  <TableCell colSpan={6} className="text-center py-6">
                    No document data available
                  </TableCell>
                </TableRow>
              ) : (
                analytics.documentsByType.map((type) => {
                  const total = type.approved + type.rejected + type.pending + type.request_resubmission;
                  const processed = type.approved + type.rejected + type.request_resubmission;
                  const passRate = processed > 0 ? (type.approved / processed) * 100 : 0;
                  return (
                    <TableRow key={type.type}>
                      <TableCell>{type.type.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                      <TableCell className="text-right">{total}</TableCell>
                      <TableCell className="text-right">{type.approved}</TableCell>
                      <TableCell className="text-right">
                        {type.rejected + type.request_resubmission}
                      </TableCell>
                      <TableCell className="text-right">{type.pending}</TableCell>
                      <TableCell className="text-right">{passRate.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

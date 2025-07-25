import { ChartContainer } from '../charts/ChartContainer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDocumentTypeTableData } from '@/hooks/analytics/useChartData';
import type { DocumentAnalytics } from '@/hooks/analytics/types';

interface DataTablesTabProps {
  analytics: DocumentAnalytics;
}


/**
 * DataTablesTab
 * @description Function
 */
export const DataTablesTab = ({ analytics }: DataTablesTabProps): void => {
  const documentTypeData = useDocumentTypeTableData(analytics);

  return (
    <div className="space-y-6">
      <ChartContainer
        title="Rejection Reasons"
        description="Detailed breakdown of document rejection causes"
      >
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
                        (analytics.rejectedDocuments + analytics.resubmissionRequestedDocuments ||
                          1)) *
                      100
                    ).toFixed(1)}
                    %
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ChartContainer>

      <ChartContainer title="Document Type Breakdown" description="Statistics by document type">
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
            {documentTypeData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No document data available
                </TableCell>
              </TableRow>
            ) : (
              documentTypeData.map((type) => (
                <TableRow key={type.type}>
                  <TableCell>{type.displayName}</TableCell>
                  <TableCell className="text-right">{type.total}</TableCell>
                  <TableCell className="text-right">{type.approved}</TableCell>
                  <TableCell className="text-right">
                    {type.rejected + type.request_resubmission}
                  </TableCell>
                  <TableCell className="text-right">{type.pending}</TableCell>
                  <TableCell className="text-right">{type.passRate}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ChartContainer>
    </div>
  );
};


import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePartnerPayments } from '@/hooks/usePartnerData';
import { format } from 'date-fns';
import { Plus, Download } from 'lucide-react';

interface SponsorPaymentHistoryProps {
  sponsorId: string;
}

export const SponsorPaymentHistory: React.FC<SponsorPaymentHistoryProps> = ({ sponsorId }) => {
  const { data: payments, isLoading } = usePartnerPayments(sponsorId);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading payment history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment: any) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="font-medium">
                  R{payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {payment.payment_method || 'Not specified'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(payment.status)}
                </TableCell>
                <TableCell>
                  {payment.invoice_number || '-'}
                </TableCell>
                <TableCell>
                  {payment.reference_number || '-'}
                </TableCell>
                <TableCell>
                  {payment.due_date 
                    ? format(new Date(payment.due_date), 'MMM dd, yyyy')
                    : '-'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(!payments || payments.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            No payment history found for this sponsor.
          </div>
        )}
      </div>
    </div>
  );
};

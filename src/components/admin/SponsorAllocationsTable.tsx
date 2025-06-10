
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { SponsorAllocationForm } from './SponsorAllocationForm';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export const SponsorAllocationsTable: React.FC = () => {
  const { allocations, isLoading, deleteAllocation } = useSponsorAllocations();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'revoked':
        return <Badge variant="destructive">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this allocation?')) {
      await deleteAllocation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading sponsor allocations...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sponsor Allocations</h3>
        <SponsorAllocationForm />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sponsor</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Allocated</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations?.map((allocation: any) => (
              <TableRow key={allocation.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{allocation.partners?.name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">{allocation.partners?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{allocation.users?.full_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">{allocation.users?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{allocation.plan}</Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(allocation.status)}
                </TableCell>
                <TableCell>
                  {format(new Date(allocation.allocated_on), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {allocation.expires_on 
                    ? format(new Date(allocation.expires_on), 'MMM dd, yyyy')
                    : 'No expiry'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <SponsorAllocationForm allocation={allocation} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(allocation.id)}
                      disabled={deleteAllocation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {allocations?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No sponsor allocations found.
          </div>
        )}
      </div>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { type SponsorAllocation } from '@/types/SponsorTypes';
import React from 'react';

interface SponsorStudentTableProps {
  allocations: SponsorAllocation[];
  onEdit?: (alloc: SponsorAllocation) => void;
  onDelete?: (id: string) => void;
}

/**
 * SponsorStudentTable
 * @description Function
 */
export const SponsorStudentTable: React.FC<SponsorStudentTableProps> = ({
  allocations,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto border rounded-md bg-background shadow-sm">
    <table className="min-w-full table-auto">
      <thead className="bg-muted/50">
        <tr>
          <th className="px-3 py-2">Student ID</th>
          <th className="px-3 py-2">Allocated On</th>
          <th className="px-3 py-2">Expires On</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Plan</th>
          <th className="px-3 py-2">Notes</th>
          {onEdit && <th className="px-3 py-2" />}
        </tr>
      </thead>
      <tbody>
        {allocations.length === 0 ? (
          <tr>
            <td colSpan={onEdit ? 7 : 6} className="py-6 text-center text-muted-foreground">
              No student allocations.
            </td>
          </tr>
        ) : (
          allocations.map((alloc) => (
            <tr key={alloc.id} className="border-t">
              <td className="px-3 py-2">{alloc.student_id}</td>
              <td className="px-3 py-2">
                {alloc.allocated_on ? new Date(alloc.allocated_on).toLocaleDateString() : '-'}
              </td>
              <td className="px-3 py-2">
                {alloc.expires_on ? new Date(alloc.expires_on).toLocaleDateString() : '-'}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${alloc.status === 'active' ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {alloc.status}
                </span>
              </td>
              <td className="px-3 py-2">{alloc.plan || '-'}</td>
              <td className="px-3 py-2">{alloc.notes || '-'}</td>
              {onEdit && (
                <td className="px-3 py-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-info underline text-xs p-0 h-auto font-normal"
                    onClick={() => onEdit(alloc)}
                  >
                    Edit
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive underline text-xs p-0 h-auto font-normal"
                      onClick={() => onDelete(alloc.id)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default SponsorStudentTable;

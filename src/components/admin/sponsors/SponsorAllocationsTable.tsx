import { Button } from '@/components/ui/button';
import { type SponsorAllocation  } from '@/types/SponsorTypes';
import { React } from 'react';




interface SponsorAllocationsTableProps {
  allocations: SponsorAllocation[];
  onEdit: (alloc: SponsorAllocation) => void;
  onDelete: (id: string) => void;
}

/**
 * SponsorAllocationsTable
 * @description Function
 */
export const SponsorAllocationsTable: React.FC<SponsorAllocationsTableProps> = ({
  allocations,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border rounded">
      <thead>
        <tr>
          <th className="px-3 py-2">Sponsor</th>
          <th className="px-3 py-2">Student ID</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Plan</th>
          <th className="px-3 py-2">Notes</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map((alloc) => (
          <tr key={alloc.id}>
            <td className="px-3 py-2">{alloc.sponsor_id}</td>
            <td className="px-3 py-2">{alloc.student_id}</td>
            <td className="px-3 py-2">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  alloc.status === 'active'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {alloc.status}
              </span>
            </td>
            <td className="px-3 py-2">{alloc.plan || '-'}</td>
            <td className="px-3 py-2">{alloc.notes || '-'}</td>
            <td className="px-3 py-2 space-x-2">
              <Button
                className="text-blue-600 hover:underline"
                variant="link"
                size="sm"
                onClick={() => onEdit(alloc)}
              >
                Edit
              </Button>
              <Button
                className="text-red-600 hover:underline"
                variant="link"
                size="sm"
                onClick={() => onDelete(alloc.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
        {allocations.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center text-gray-400 py-8">
              No allocations found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

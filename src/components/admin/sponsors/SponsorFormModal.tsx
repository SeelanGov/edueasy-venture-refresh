import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type SponsorAllocation  } from '@/types/SponsorTypes';




interface SponsorFormModalProps {
  open: boolean;
  allocation?: SponsorAllocation | null;
  onSave: (values: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}

/**
 * SponsorFormModal
 * @description Function
 */
export const SponsorFormModal: React.FC<SponsorFormModalProps> = ({
  open,
  allocation,
  onSave,
  onClose,
}) => {
  const [values, setValues] = useState<Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>>(
    {
      sponsor_id: allocation?.sponsor_id || '',
      student_id: allocation?.student_id || '',
      allocated_on: allocation?.allocated_on || new Date().toISOString(),
      expires_on: allocation?.expires_on || '',
      status: allocation?.status || 'active',
      plan: allocation?.plan || '',
      notes: allocation?.notes || '',
    },
  );

  useEffect(() => {
    if (allocation) {
      setValues({
        sponsor_id: allocation.sponsor_id,
        student_id: allocation.student_id,
        allocated_on: allocation.allocated_on,
        expires_on: allocation.expires_on || '',
        status: allocation.status,
        plan: allocation.plan || '',
        notes: allocation.notes || '',
      });
    }
  }, [allocation]);

  if (!open) return null;

  return (
    <div className="fixed z-30 inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {allocation ? 'Edit Allocation' : 'Add Allocation'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sponsor ID</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={values.sponsor_id}
              onChange={(e) => setValues((v) => ({ ...v, sponsor_id: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={values.student_id}
              onChange={(e) => setValues((v) => ({ ...v, student_id: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Allocated On</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={values.allocated_on.slice(0, 10)}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  allocated_on: new Date(e.target.value).toISOString(),
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expires On</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={values.expires_on ? values.expires_on.slice(0, 10) : ''}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  expires_on: e.target.value ? new Date(e.target.value).toISOString() : '',
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Plan</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={values.plan || ''}
              onChange={(e) => setValues((v) => ({ ...v, plan: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={values.status}
              onChange={(e) => setValues((v) => ({ ...v, status: e.target.value }))}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="border rounded px-2 py-1 w-full"
              value={values.notes || ''}
              onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} aria-label="Cancel changes">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(values)} aria-label="Save allocation">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { Plus, Users } from 'lucide-react';

interface AllocationModalProps {
  sponsorId: string;
}

export const AllocationModal: React.FC<AllocationModalProps> = ({ sponsorId }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    plan: '',
    expires_on: '',
    notes: '',
  });

  const { createAllocation } = useSponsorAllocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating sponsor allocation:', { ...formData, sponsor_id: sponsorId });

    const allocationData = {
      sponsor_id: sponsorId,
      student_id: formData.student_id,
      plan: formData.plan,
      status: 'active' as const,
      allocated_on: new Date().toISOString(),
      expires_on: formData.expires_on || undefined,
      notes: formData.notes || undefined,
    };

    try {
      await createAllocation.mutateAsync(allocationData);
      setOpen(false);
      setFormData({
        student_id: '',
        plan: '',
        expires_on: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to create allocation:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Allocate Students
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Allocate Student to Sponsor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student_id">Student ID</Label>
            <Input
              id="student_id"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              placeholder="Enter student user ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="plan">Plan</Label>
            <Select
              value={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expires_on">Expires On (Optional)</Label>
            <Input
              id="expires_on"
              type="datetime-local"
              value={formData.expires_on}
              onChange={(e) => setFormData({ ...formData, expires_on: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this allocation"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAllocation.isPending}>
              Create Allocation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePartners } from '@/hooks/usePartnerData';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { SponsorAllocation, Partner } from '@/types/PartnerTypes';
import { Plus } from 'lucide-react';

interface SponsorAllocationFormProps {
  allocation?: SponsorAllocation;
  onClose?: () => void;
}

export const SponsorAllocationForm: React.FC<SponsorAllocationFormProps> = ({ 
  allocation, 
  onClose 
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sponsor_id: allocation?.sponsor_id || '',
    student_id: allocation?.student_id || '',
    plan: allocation?.plan || '',
    status: allocation?.status || 'active',
    expires_on: allocation?.expires_on || '',
    notes: allocation?.notes || '',
  });

  const { data: partners } = usePartners();
  const { createAllocation, updateAllocation } = useSponsorAllocations();

  const sponsors = partners?.filter((p: Partner) => p.type === 'sponsor') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting sponsor allocation form:', formData);

    const allocationData = {
      ...formData,
      allocated_on: allocation?.allocated_on || new Date().toISOString(),
      expires_on: formData.expires_on || null,
      notes: formData.notes || null,
    };

    if (allocation) {
      await updateAllocation.mutateAsync({
        id: allocation.id,
        updates: allocationData,
      });
    } else {
      await createAllocation.mutateAsync(allocationData);
    }

    setOpen(false);
    onClose?.();
    
    // Reset form if creating new allocation
    if (!allocation) {
      setFormData({
        sponsor_id: '',
        student_id: '',
        plan: '',
        status: 'active',
        expires_on: '',
        notes: '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!allocation ? (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Allocate Sponsorship
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {allocation ? 'Edit Sponsor Allocation' : 'Create Sponsor Allocation'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sponsor_id">Sponsor</Label>
            <Select
              value={formData.sponsor_id}
              onValueChange={(value) => setFormData({ ...formData, sponsor_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sponsor" />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((sponsor: Partner) => (
                  <SelectItem key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
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
            <Button type="submit" disabled={createAllocation.isPending || updateAllocation.isPending}>
              {allocation ? 'Update' : 'Create'} Allocation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

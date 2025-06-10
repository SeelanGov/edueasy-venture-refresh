
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSponsorAllocations } from '@/hooks/useSponsorAllocations';
import { SponsorAllocation } from '@/types/PartnerTypes';
import { Plus, Edit } from 'lucide-react';

interface SponsorAllocationFormProps {
  allocation?: SponsorAllocation;
  sponsorId?: string;
}

export const SponsorAllocationForm: React.FC<SponsorAllocationFormProps> = ({ 
  allocation, 
  sponsorId 
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sponsor_id: sponsorId || allocation?.sponsor_id || '',
    student_id: allocation?.student_id || '',
    plan: allocation?.plan || '',
    expires_on: allocation?.expires_on ? new Date(allocation.expires_on).toISOString().slice(0, 16) : '',
    notes: allocation?.notes || '',
  });

  const { createAllocation, updateAllocation } = useSponsorAllocations();
  const isEditing = !!allocation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting allocation form:', formData);

    try {
      if (isEditing) {
        await updateAllocation.mutateAsync({
          id: allocation.id,
          updates: {
            plan: formData.plan,
            expires_on: formData.expires_on || null,
            notes: formData.notes || null,
          }
        });
      } else {
        const allocationData = {
          sponsor_id: formData.sponsor_id,
          student_id: formData.student_id,
          plan: formData.plan,
          status: 'active' as const,
          allocated_on: new Date().toISOString(),
          expires_on: formData.expires_on || null,
          notes: formData.notes || null,
        };
        await createAllocation.mutateAsync(allocationData);
      }
      
      setOpen(false);
      if (!isEditing) {
        setFormData({
          sponsor_id: sponsorId || '',
          student_id: '',
          plan: '',
          expires_on: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Failed to save allocation:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEditing ? "outline" : "default"}>
          {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {isEditing ? '' : 'New Allocation'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Allocation' : 'Create Sponsor Allocation'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!sponsorId && (
            <div>
              <Label htmlFor="sponsor_id">Sponsor ID</Label>
              <Input
                id="sponsor_id"
                value={formData.sponsor_id}
                onChange={(e) => setFormData({ ...formData, sponsor_id: e.target.value })}
                placeholder="Enter sponsor ID"
                required
                disabled={isEditing}
              />
            </div>
          )}

          <div>
            <Label htmlFor="student_id">Student ID</Label>
            <Input
              id="student_id"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              placeholder="Enter student user ID"
              required
              disabled={isEditing}
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
            <Button 
              type="submit" 
              disabled={createAllocation.isPending || updateAllocation.isPending}
            >
              {isEditing ? 'Update' : 'Create'} Allocation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

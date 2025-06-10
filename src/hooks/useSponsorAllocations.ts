
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SponsorAllocation } from '@/types/PartnerTypes';

export const useSponsorAllocations = (sponsorId?: string) => {
  const queryClient = useQueryClient();

  // Fetch allocations for a specific sponsor or all allocations
  const { data: allocations, isLoading, error } = useQuery({
    queryKey: ['sponsor-allocations', sponsorId],
    queryFn: async () => {
      let query = supabase
        .from('sponsor_allocations')
        .select(`
          *,
          sponsors(name, email),
          profiles(full_name, email)
        `);

      if (sponsorId) {
        query = query.eq('sponsor_id', sponsorId);
      }

      const { data, error } = await query.order('allocated_on', { ascending: false });

      if (error) throw error;
      return data as SponsorAllocation[];
    },
    enabled: true,
  });

  // Create new allocation
  const createAllocation = useMutation({
    mutationFn: async (allocationData: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .insert(allocationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-allocations'] });
      toast({
        title: 'Success',
        description: 'Sponsor allocation created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating allocation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sponsor allocation',
        variant: 'destructive',
      });
    },
  });

  // Update allocation
  const updateAllocation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SponsorAllocation> }) => {
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-allocations'] });
      toast({
        title: 'Success',
        description: 'Sponsor allocation updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating allocation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sponsor allocation',
        variant: 'destructive',
      });
    },
  });

  // Delete allocation
  const deleteAllocation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sponsor_allocations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-allocations'] });
      toast({
        title: 'Success',
        description: 'Sponsor allocation deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting allocation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete sponsor allocation',
        variant: 'destructive',
      });
    },
  });

  return {
    allocations: allocations || [],
    isLoading,
    error,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SponsorAllocation } from '@/types/PartnerTypes';
import { useToast } from '@/hooks/use-toast';

export const useSponsorAllocations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allocations, isLoading } = useQuery({
    queryKey: ['sponsor-allocations'],
    queryFn: async () => {
      console.log('Fetching sponsor allocations...');
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .select(`
          *,
          partners!sponsor_allocations_sponsor_id_fkey(name, email),
          users!sponsor_allocations_student_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sponsor allocations:', error);
        throw error;
      }

      console.log('Fetched sponsor allocations:', data);
      return data;
    },
  });

  const createAllocation = useMutation({
    mutationFn: async (allocation: Omit<SponsorAllocation, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating sponsor allocation:', allocation);
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .insert([allocation])
        .select()
        .single();

      if (error) {
        console.error('Error creating sponsor allocation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-allocations'] });
      toast({
        title: "Success",
        description: "Sponsor allocation created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating allocation:', error);
      toast({
        title: "Error",
        description: "Failed to create sponsor allocation",
        variant: "destructive",
      });
    },
  });

  const updateAllocation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SponsorAllocation> }) => {
      console.log('Updating sponsor allocation:', id, updates);
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating sponsor allocation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-allocations'] });
      toast({
        title: "Success",
        description: "Sponsor allocation updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating allocation:', error);
      toast({
        title: "Error",
        description: "Failed to update sponsor allocation",
        variant: "destructive",
      });
    },
  });

  const deleteAllocation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting sponsor allocation:', id);
      const { error } = await supabase
        .from('sponsor_allocations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting sponsor allocation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-allocations'] });
      toast({
        title: "Success",
        description: "Sponsor allocation deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting allocation:', error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor allocation",
        variant: "destructive",
      });
    },
  });

  return {
    allocations,
    isLoading,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  };
};

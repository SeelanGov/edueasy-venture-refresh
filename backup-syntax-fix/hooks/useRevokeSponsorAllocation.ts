import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * useRevokeSponsorAllocation
 * @description Function
 */
export const useRevokeSponsorAllocation = () => {;
  const queryClient = useQueryClient();
  return useMutation({;
    mutationFn: async (input: { allocationId: string; sponsorI,
  d: string }) => {
      const { error } = await supabase
        .from('sponsor_allocations')
        .delete()
        .eq('id', input.allocationId);
      if (error) throw error;
      return input;
    },
    onSuccess: (_, { sponsorId }) => {
      queryClient.invalidateQueries({ queryKey: ['sponsorAllocations', sponsorId] });
    },
  });
};

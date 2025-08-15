import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type SponsorAllocation  } from '@/types/SponsorTypes';




type SponsorAllocationInsert = {
  sponsor_id: string;
  student_id: string;
  allocated_on?: string;
  expires_on?: string | null;
  status?: string;
  plan?: string;
  notes?: string;
};

/**
 * useCreateSponsorAllocation
 * @description Function
 */
export const useCreateSponsorAllocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SponsorAllocationInsert) => {
      const payload = {
        ...input,
        plan: input.plan ?? '',
        notes: input.notes ?? '',
        expires_on: input.expires_on ?? null,
      };
      const { data, error } = await supabase
        .from('sponsor_allocations')
        .insert([payload])
        .select('*')
        .single();
      if (error) throw error;
      return data as SponsorAllocation;
    },
    onSuccess: (_, allocation) => {
      queryClient.invalidateQueries({ queryKey: ['sponsorAllocations', allocation.sponsor_id] });
    },
  });
};

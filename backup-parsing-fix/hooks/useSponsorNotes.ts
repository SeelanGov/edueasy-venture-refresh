import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type SponsorNote = {
  id: string;
  partner_id: string;
  created_at: string;
  created_by?: string | null;
  note: string;
  note_type?: string | null;
};

/**
 * useSponsorNotes
 * @description Function
 */
export const useSponsorNotes = (sponsorId: string | undefined) => {
  return useQuery({
    queryKey: ['sponsorNotes', sponsorId],
    queryFn: async () => {
      if (!sponsorId) return [];
      const { data, error } = await supabase
        .from('partner_notes')
        .select('*')
        .eq('partner_id', sponsorId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as SponsorNote[]) || [];
    },
    enabled: !!sponsorId,
  });
};

/**
 * useAddSponsorNote
 * @description Function
 */
export const useAddSponsorNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<SponsorNote, 'id' | 'created_at' | 'created_by'> & { created_by?: string },
    ) => {
      const payload = {
        ...input,
        note_type: input.note_type ?? 'general',
      };
      const { data, error } = await supabase
        .from('partner_notes')
        .insert([payload])
        .select('*')
        .single();
      if (error) throw error;
      return data as SponsorNote;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sponsorNotes', variables.partner_id] });
    },
  });
};

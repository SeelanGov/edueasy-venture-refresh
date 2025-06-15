
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SponsorNote = {
  id: string;
  partner_id: string;
  created_at: string;
  created_by: string;
  note: string;
  note_type?: string;
};

export const useSponsorNotes = (sponsorId: string | undefined) => {
  return useQuery({
    queryKey: ["sponsorNotes", sponsorId],
    queryFn: async () => {
      if (!sponsorId) return [];
      const { data, error } = await supabase
        .from("partner_notes")
        .select("*")
        .eq("partner_id", sponsorId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as SponsorNote[]) || [];
    },
    enabled: !!sponsorId,
  });
};

export const useAddSponsorNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { partner_id: string, note: string, note_type?: string }) => {
      const { data, error } = await supabase
        .from("partner_notes")
        .insert([input])
        .select("*")
        .single();
      if (error) throw error;
      return data as SponsorNote;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["sponsorNotes", vars.partner_id] });
    },
  });
};

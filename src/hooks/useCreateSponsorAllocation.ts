
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsorAllocation } from "@/types/SponsorTypes";

export const useCreateSponsorAllocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<SponsorAllocation, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("sponsor_allocations")
        .insert([input])
        .select("*")
        .single();
      if (error) throw error;
      return data as SponsorAllocation;
    },
    onSuccess: (_, allocation) => {
      queryClient.invalidateQueries({ queryKey: ["sponsorAllocations", allocation.sponsor_id] });
    },
  });
};

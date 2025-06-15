
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUpdatePartnerTier = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const updateTier = async (partnerId: string, newTier: string) => {
    setIsUpdating(true);
    setError(undefined);
    const { error } = await supabase
      .from("partners")
      .update({ tier: newTier })
      .eq("id", partnerId);
    setIsUpdating(false);
    if (error) setError(error.message);
    return !error;
  };
  return { isUpdating, error, updateTier };
};

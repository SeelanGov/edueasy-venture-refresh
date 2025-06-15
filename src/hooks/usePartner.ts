
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePartner = (id?: string) => {
  const [partner, setPartner] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    supabase.from("partners")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setPartner(data ?? null))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { partner, isLoading };
};

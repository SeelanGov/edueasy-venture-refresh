
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePartners = ({ type, search }: { type?: string; search?: string }) => {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let query = supabase.from("partners").select("*");
    if (type) query = query.eq("type", type);
    if (search)
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%`
      );
    setIsLoading(true);
    query.order("created_at", { ascending: false })
      .then(({ data }) => setPartners(data ?? []))
      .finally(() => setIsLoading(false));
  }, [type, search]);

  return { partners, isLoading };
};

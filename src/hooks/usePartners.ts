
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VALID_PARTNER_TYPES = ["university", "tvet", "funder", "seta", "other", "sponsor"];

export const usePartners = ({ type, search }: { type?: string; search?: string }) => {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPartners = async () => {
      setIsLoading(true);
      let query = supabase.from("partners").select("*");
      if (type && VALID_PARTNER_TYPES.includes(type)) query = query.eq("type", type);
      if (search)
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%`
        );
      try {
        const { data } = await query.order("created_at", { ascending: false });
        if (isMounted) setPartners(data ?? []);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPartners();
    return () => { isMounted = false; };
  }, [type, search]);

  return { partners, isLoading };
};

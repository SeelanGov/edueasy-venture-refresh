
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useSponsorApplications({ asSponsor = false } = {}) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let resp;
    if (asSponsor) {
      const sponsor_id = localStorage.getItem("sponsor_id");
      if (!sponsor_id) { setApplications([]); setLoading(false); return; }
      resp = await supabase
        .from("application_fee_sponsorships")
        .select("*, sponsor_applications(*, student_id), sponsor_id")
        .eq("sponsor_id", sponsor_id);
    } else {
      resp = await supabase
        .from("sponsor_applications")
        .select("*")
        .eq("student_id", user.id);
    }
    setApplications(resp.data || []);
    setLoading(false);
  }, [user, asSponsor]);

  useEffect(() => { fetch(); }, [fetch]);
  return { applications, loading, refresh: fetch };
}


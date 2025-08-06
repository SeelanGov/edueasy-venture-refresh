import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * usePartnerNotes
 * @description Function
 */
export const usePartnerNotes = (partnerId?: string): void => {
  const [notes, setNotes] = useState<any[]>([]);
  useEffect(() => {
    if (!partnerId) return;
    supabase
      .from('partner_notes')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setNotes(data ?? []));
  }, [partnerId]);
  return { notes };
};

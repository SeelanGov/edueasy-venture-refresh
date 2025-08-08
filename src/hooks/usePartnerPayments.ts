import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * usePartnerPayments
 * @description Function
 */
export const usePartnerPayments = (partnerId?: string) => {
  const [payments, setPayments] = useState<any[]>([]);
  useEffect(() => {
    if (!partnerId) return;
    supabase
      .from('partner_payments')
      .select('*')
      .eq('partner_id', partnerId)
      .order('payment_date', { ascending: false })
      .then(({ data }) => setPayments(data ?? []));
  }, [partnerId]);
  return { payments };
};

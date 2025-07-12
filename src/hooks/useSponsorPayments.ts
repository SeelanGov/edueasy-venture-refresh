import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type SponsorPayment = {
  id: string;
  partner_id: string;
  amount: number;
  payment_date: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  notes?: string | null;
  status: string;
  payment_method?: string | null;
  invoice_number?: string | null;
  reference_number?: string | null;
};

export const useSponsorPayments = (sponsorId: string | undefined) => {
  return useQuery({
    queryKey: ['sponsorPayments', sponsorId],
    queryFn: async () => {
      if (!sponsorId) return [];
      const { data, error } = await supabase
        .from('partner_payments')
        .select('*')
        .eq('partner_id', sponsorId)
        .order('payment_date', { ascending: false });
      if (error) throw error;
      return (data as SponsorPayment[]) || [];
    },
    enabled: !!sponsorId,
  });
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Step 1: Define the valid partner types as a type and an array
export type PartnerType = 'university' | 'tvet' | 'funder' | 'seta' | 'other' | 'sponsor';
const VALID_PARTNER_TYPES: PartnerType[] = [
  'university',
  'tvet',
  'funder',
  'seta',
  'other',
  'sponsor',
];

// Step 2: Accept only the allowed types for `type`

/**
 * usePartners
 * @description Function
 */
export const usePartners = ({ type, search }: { type?: PartnerType; search?: string }) => {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPartners = async () => {
      setIsLoading(true);
      let query = supabase.from('partners').select('*');
      if (type && VALID_PARTNER_TYPES.includes(type)) {
        query = query.eq('type', type as PartnerType);
      }
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      try {
        const { data } = await query.order('created_at', { ascending: false });
        if (isMounted) setPartners(data ?? []);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPartners();
    return () => {
      isMounted = false;
    };
  }, [type, search]);

  return { partners, isLoading };
};

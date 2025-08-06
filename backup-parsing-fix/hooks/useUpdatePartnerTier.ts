import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type PartnerTier = 'basic' | 'standard' | 'premium';

/**
 * useUpdatePartnerTier
 * @description Function
 */
export const useUpdatePartnerTier = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const updateTier = async (partnerId: string, newTier: PartnerTier) => {
    setIsUpdating(true);
    setError(undefined);
    const { error } = await supabase.from('partners').update({ tier: newTier }).eq('id', partnerId);
    setIsUpdating(false);
    if (error) setError(error.message);
    return !error;
  };
  return { isUpdating, error, updateTier };
};

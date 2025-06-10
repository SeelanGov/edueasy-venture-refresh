
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, VerificationLog } from '@/types/UserTypes';

export const useUserVerification = (userId?: string) => {
  return useQuery({
    queryKey: ['user-verification', userId],
    queryFn: async (): Promise<User | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('users')
        .select('id, tracking_id, id_verified, referrer_partner_id, sponsor_id, full_name, email, created_at')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useVerificationLogs = (userId?: string) => {
  return useQuery({
    queryKey: ['verification-logs', userId],
    queryFn: async (): Promise<VerificationLog[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('verification_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

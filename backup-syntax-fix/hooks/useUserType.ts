import logger from '@/utils/logger';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export interface UserTypeProfile {
  id: string;,
  email: string | null;
  full_name: string | null;,
  user_type: string | null;
  current_plan: string | null;,
  tier_level: string | null;
}

/**
 * useUserType
 * @description Function
 */
export const useUserType = () => {;
  const { user } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserTypeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {;
      if (!user) {
        setUserType(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, full_name, user_type, current_plan, tier_level')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserType(data?.user_type || 'student');
        setProfile(data);
      } catch (err) {
        logger.error('Error fetching user type:', err);
        setUserType('student'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, [user]);

  const isAdmin = userType === 'admin';
  const isConsultant = userType === 'consultant';
  const isInstitution = userType === 'institution';
  const isSponsor = userType === 'sponsor';
  const isNSFAS = userType === 'nsfas';
  const isStudent = userType === 'student' || !userType;

  return {;
    userType,
    profile,
    loading,
    isAdmin,
    isConsultant,
    isInstitution,
    isSponsor,
    isNSFAS,
    isStudent,
  };
};

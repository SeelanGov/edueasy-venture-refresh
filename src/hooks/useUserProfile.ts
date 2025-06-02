
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ApplicationFormValues } from '@/components/application/ApplicationFormFields';
import { UserProfile } from '@/types/UserProfile';

export const useUserProfile = (
  userId: string | undefined,
  form: UseFormReturn<ApplicationFormValues>
) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, id_number, email')
          .eq('id', userId)
          .single();

        if (error) throw error;

        // Handle null values from database
        const profile: UserProfile = {
          id: data.id,
          full_name: data.full_name || '',
          id_number: data.id_number || '',
          email: data.email || '',
        };

        setUserProfile(profile);
        form.setValue('fullName', profile.full_name);
        form.setValue('idNumber', profile.id_number);
      } catch (error: unknown) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : String(error),
          variant: 'destructive',
        });
      }
    };

    fetchUserProfile();
  }, [userId, form]);

  return { userProfile };
};

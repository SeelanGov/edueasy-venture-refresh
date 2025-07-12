import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UseFormReturn } from 'react-hook-form';
import type { ApplicationFormValues } from '@/components/application/ApplicationFormFields';

/**
 * Hook for loading draft applications from Supabase
 */
export const useDraftLoading = (
  userId: string | undefined,
  isOnline: boolean,
  form: UseFormReturn<ApplicationFormValues>,
  setHasSavedDraft: (value: boolean) => void,
) => {
  // Check for existing drafts
  useEffect(() => {
    const checkForDrafts = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'Draft')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          // Load the draft into the form
          form.setValue('grade12Results', data[0].grade12_results || '');
          form.setValue('university', data[0].institution_id || '');
          form.setValue('program', data[0].program_id || '');

          // Check if personal_statement exists before trying to access it
          // This is a TypeScript safe way to handle potentially missing properties
          const personalStatement =
            'personal_statement' in data[0] ? (data[0] as any).personal_statement : '';

          form.setValue('personalStatement', personalStatement);
          setHasSavedDraft(true);
        }
      } catch (error) {
        console.error('Error checking for drafts:', error);
      }
    };

    if (isOnline && userId) {
      checkForDrafts();
    }
  }, [userId, isOnline, form, setHasSavedDraft]);
};

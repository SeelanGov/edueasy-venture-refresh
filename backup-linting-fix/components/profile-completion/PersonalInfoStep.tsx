import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { PersonalInfoForm } from './personal/PersonalInfoForm';
import type { PersonalInfoFormValues } from './personal/types';
import { logError } from '@/utils/logging';
import { parseError } from '@/utils/errorHandler';
import { Card, CardContent } from '@/components/ui/card';

interface PersonalInfoStepProps {
  onComplete: () => void;
}

/**
 * PersonalInfoStep
 * @description Function
 */
export const PersonalInfoStep = ({ onComplete }: PersonalInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { personalInfo, setPersonalInfo } = useProfileCompletionStore();

  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Save data to Supabase
      const { error: dbError } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          id_number: data.idNumber,
        })
        .eq('id', user.id);
      if (dbError) throw dbError;

      // Save to store
      setPersonalInfo({
        fullName: data.fullName,
        idNumber: data.idNumber,
        gender: data.gender,
      });

      onComplete();
    } catch (err) {
      const parsed = parseError(err);
      logError(parsed);
      setError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
        <p className="text-gray-600">Please provide your personal details to continue</p>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 p-3 mb-5 rounded-lg text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <PersonalInfoForm
            initialValues={{
              fullName: personalInfo.fullName || '',
              idNumber: personalInfo.idNumber || '',
              gender: personalInfo.gender || '',
            }}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Your information is secure and will only be shared with your selected institutions.
        </p>
      </div>
    </div>
  );
};

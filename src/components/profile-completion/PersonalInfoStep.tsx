import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { PersonalInfoForm } from "./personal/PersonalInfoForm";
import { PersonalInfoFormValues } from "./personal/types";
import { logError } from "@/utils/logging";
import { parseError } from "@/utils/errorHandler";

interface PersonalInfoStepProps {
  onComplete: () => void;
}

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
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      {error && (
        <div className="text-red-500 p-2 mb-2 text-center" role="alert">{error}</div>
      )}
      <PersonalInfoForm
        initialValues={{
          fullName: personalInfo.fullName || "",
          idNumber: personalInfo.idNumber || "",
          gender: personalInfo.gender || "",
        }}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

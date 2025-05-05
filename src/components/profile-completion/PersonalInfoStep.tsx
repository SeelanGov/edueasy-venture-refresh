
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { PersonalInfoForm } from "./personal/PersonalInfoForm";
import { PersonalInfoFormValues } from "./personal/types";

interface PersonalInfoStepProps {
  onComplete: () => void;
}

export const PersonalInfoStep = ({ onComplete }: PersonalInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personalInfo, setPersonalInfo } = useProfileCompletionStore();
  
  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save data to Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          id_number: data.idNumber,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Save to store
      setPersonalInfo({
        fullName: data.fullName,
        idNumber: data.idNumber,
        gender: data.gender,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving personal info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
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


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Returns the current step index and completion status for each journey step.
 */
export function useApplicationJourneyStep() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<(boolean | undefined)[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the steps in order
  const steps = [
    "Personal Information",
    "Contact Details",
    "Address Information",
    "Education History",
    "Document Upload",
    "Review & Submit",
  ];

  useEffect(() => {
    async function checkProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Personal Info: check full_name and id_number in users table
      let completed = [];
      // FIX: Select all the needed fields!
      const { data: userData } = await supabase
        .from("users")
        .select("full_name, id_number, phone_number, contact_email")
        .eq("id", user.id)
        .single();
      completed[0] = !!userData?.full_name && !!userData?.id_number;

      // 2. Contact Details: check phone_number and contact_email in users table
      completed[1] = !!userData?.phone_number || !!userData?.contact_email;

      // 3. Address: check if address exists in addresses table
      const { data: address } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      completed[2] = !!address;

      // 4. Education: check education record in education_records
      const { data: education } = await supabase
        .from("education_records")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      completed[3] = !!education;

      // 5. Document upload: at least one document required in documents table
      const { data: documentList } = await supabase
        .from("documents")
        .select("id")
        .eq("user_id", user.id);

      completed[4] = Array.isArray(documentList) && documentList.length > 0;

      // 6. Review/Submit: has at least one application submitted (status !== 'draft')
      const { data: apps } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", user.id);

      completed[5] = Array.isArray(apps) && apps.some(app => app.status && app.status !== 'draft');

      // Set stepStatus and currentStep (first incomplete)
      setStepStatus(completed);
      setCurrentStep(completed.findIndex(c => !c) === -1 ? steps.length - 1 : completed.findIndex(c => !c));
      setLoading(false);
    }

    checkProgress();
  }, [user]);

  return {
    steps,
    currentStep,
    stepStatus,
    loading,
  };
}

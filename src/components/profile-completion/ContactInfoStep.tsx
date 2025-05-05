
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { ContactForm } from "./contact/ContactForm";
import { ContactFormValues } from "./contact/types";

interface ContactInfoStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ContactInfoStep = ({ onComplete, onBack }: ContactInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contactInfo, setContactInfo } = useProfileCompletionStore();

  const onSubmit = async (data: ContactFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save data to Supabase
      const { error } = await supabase
        .from('users')
        .update({
          phone_number: data.phoneNumber,
          contact_email: data.contactEmail,
          emergency_contact_name: data.emergencyContactName,
          emergency_contact_phone: data.emergencyContactPhone,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Save to store
      setContactInfo({
        phoneNumber: data.phoneNumber,
        contactEmail: data.contactEmail,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving contact info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
      <ContactForm
        initialValues={{
          phoneNumber: contactInfo.phoneNumber || "",
          contactEmail: contactInfo.contactEmail || user?.email || "",
          emergencyContactName: contactInfo.emergencyContactName || "",
          emergencyContactPhone: contactInfo.emergencyContactPhone || "",
        }}
        onSubmit={onSubmit}
        onBack={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

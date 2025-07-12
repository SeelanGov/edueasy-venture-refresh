import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { ContactForm } from './contact/ContactForm';
import type { ContactFormValues } from './contact/types';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';

interface ContactInfoStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ContactInfoStep = ({ onComplete, onBack }: ContactInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contactInfo, setContactInfo } = useProfileCompletionStore();

  const onSubmit = async (data: ContactFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Save data to Supabase
      const { error: dbError } = await supabase
        .from('users')
        .update({
          phone_number: data.phoneNumber,
          contact_email: data.contactEmail,
          emergency_contact_name: data.emergencyContactName,
          emergency_contact_phone: data.emergencyContactPhone,
        })
        .eq('id', user.id);
      if (dbError) throw dbError;
      // Save to store
      setContactInfo({
        phoneNumber: data.phoneNumber,
        contactEmail: data.contactEmail,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
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
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      <ContactForm
        initialValues={contactInfo}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        onBack={onBack}
      />
      {error && (
        <div className="text-red-500 p-2 mb-2 text-center" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

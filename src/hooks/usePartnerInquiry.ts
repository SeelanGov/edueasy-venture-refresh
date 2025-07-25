import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PartnerInquiryData {
  institutionName: string;
  institutionType: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  studentCount?: string;
  interestedTier?: string;
  message?: string;
}


/**
 * usePartnerInquiry
 * @description Function
 */
export const usePartnerInquiry = (): void => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitInquiry = async (data: PartnerInquiryData) => {
    try {
      setIsSubmitting(true);

      // Direct table insert to partner_inquiries table
      const { error } = await supabase.from('partner_inquiries').insert({
        institution_name: data.institutionName,
        institution_type: data.institutionType,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        website: data.website,
        student_count: data.studentCount,
        interested_tier: data.interestedTier,
        message: data.message,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Partnership inquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitInquiry, isSubmitting, isSubmitted };
};

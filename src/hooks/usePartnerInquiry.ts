
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

export const usePartnerInquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitInquiry = async (data: PartnerInquiryData) => {
    try {
      setIsSubmitting(true);
      
      // Use direct SQL insert since the table might not be in types yet
      const { error } = await supabase.rpc('insert_partner_inquiry', {
        p_institution_name: data.institutionName,
        p_institution_type: data.institutionType,
        p_contact_name: data.contactName,
        p_contact_email: data.contactEmail,
        p_contact_phone: data.contactPhone,
        p_website: data.website,
        p_student_count: data.studentCount,
        p_interested_tier: data.interestedTier,
        p_message: data.message,
      });

      if (error) {
        // Fallback to direct table insert if RPC doesn't exist
        const { error: insertError } = await supabase
          .from('partner_inquiries' as any)
          .insert({
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
        
        if (insertError) throw insertError;
      }

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

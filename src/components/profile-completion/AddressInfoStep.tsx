import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { AddressForm } from './address/AddressForm';
import { AddressFormValues } from './address/types';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';

interface AddressInfoStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AddressInfoStep = ({ onComplete, onBack }: AddressInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addressInfo, setAddressInfo } = useProfileCompletionStore();

  const onSubmit = async (data: AddressFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Save data to Supabase
      const { error: dbError } = await supabase.from('addresses').insert({
        user_id: user.id,
        address_type: data.addressType,
        street_address: data.streetAddress,
        suburb: data.suburb,
        city: data.city,
        province: data.province,
        postal_code: data.postalCode,
      });
      if (dbError) throw dbError;
      // Save to store
      setAddressInfo({
        addressType: data.addressType,
        streetAddress: data.streetAddress,
        suburb: data.suburb,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
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
      <h2 className="text-2xl font-bold mb-6">Address Information</h2>

      <AddressForm
        initialValues={addressInfo}
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

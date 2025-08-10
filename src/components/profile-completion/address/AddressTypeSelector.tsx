import { React } from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { type Control  } from 'react-hook-form';
import { type AddressFormValues  } from './types';






interface AddressTypeSelectorProps {
  control: Control<AddressFormValues>;
}

/**
 * AddressTypeSelector
 * @description Function
 */
export const AddressTypeSelector: React.FC<AddressTypeSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="addressType"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="residential" id="residential" />
                <label htmlFor="residential" className="cursor-pointer">
                  Residential
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="postal" id="postal" />
                <label htmlFor="postal" className="cursor-pointer">
                  Postal
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

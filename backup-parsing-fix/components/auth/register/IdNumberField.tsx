import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { RegisterFormValues } from '../RegisterForm';
import { SecurityBadge } from '@/components/ui/SecurityBadge';

interface IdNumberFieldProps {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}

/**
 * IdNumberField
 * @description Function
 */
export const IdNumberField = ({ control, isLoading }: IdNumberFieldProps) => {
  return (
    <FormField
      control={control}
      name="idNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 flex items-center gap-2">
            South African ID Number *
            <SecurityBadge type="verification" size="sm" showLabel={false} />
          </FormLabel>
          <FormControl>
            <Input
              placeholder="1234567890123"
              {...field}
              disabled={isLoading}
              className="text-gray-900"
              maxLength={13}
              pattern="[0-9]{13}"
              aria-describedby="idnumber-helper"
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                field.onChange(value);
              }}
            />
          </FormControl>
          <div id="idnumber-helper" className="text-xs text-gray-500 mt-1">
            13-digit South African ID number. This will be verified for identity confirmation.
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

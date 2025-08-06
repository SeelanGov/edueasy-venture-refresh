import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { RegisterFormValues } from '../RegisterForm';
import { SecurityBadge } from '@/components/ui/SecurityBadge';

interface FullNameFieldProps {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}

/**
 * FullNameField
 * @description Function
 */
export const FullNameField = ({ control, isLoading }: FullNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 flex items-center gap-2">
            Full Name *
            <SecurityBadge type="privacy" size="sm" showLabel={false} />
          </FormLabel>
          <FormControl>
            <Input
              placeholder="John Doe"
              {...field}
              disabled={isLoading}
              className="text-gray-900"
              maxLength={50}
              aria-describedby="fullname-helper"
            />
          </FormControl>
          <div id="fullname-helper" className="text-xs text-gray-500 mt-1">
            Enter your full legal name as it appears on your ID document.
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

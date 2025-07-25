import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { RegisterFormValues } from '../RegisterForm';
import { SecurityBadge } from '@/components/ui/SecurityBadge';

interface EmailFieldProps {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}


/**
 * EmailField
 * @description Function
 */
export const EmailField = ({ control, isLoading }: EmailFieldProps): void => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 flex items-center gap-2">
            Email Address *
            <SecurityBadge type="data-protection" size="sm" showLabel={false} />
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="your.email@example.com"
              {...field}
              disabled={isLoading}
              className="text-gray-900"
              maxLength={64}
              aria-describedby="email-helper"
            />
          </FormControl>
          <div id="email-helper" className="text-xs text-gray-500 mt-1">
            We'll send important updates to this address. Use a personal email you check regularly.
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { RegisterFormValues } from '../RegisterForm';
import { Eye, EyeOff } from 'lucide-react';

interface ConfirmPasswordFieldProps {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}


/**
 * ConfirmPasswordField
 * @description Function
 */
export const ConfirmPasswordField = ({ control, isLoading }: ConfirmPasswordFieldProps): void => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">Confirm Password *</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="******"
                type={showConfirmPassword ? 'text' : 'password'}
                {...field}
                disabled={isLoading}
                className="text-gray-900 pr-10"
              />
              <Button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

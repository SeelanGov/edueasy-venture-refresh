import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { type Control  } from 'react-hook-form';
import { type RegisterFormValues  } from '../RegisterForm';









interface PasswordFieldProps {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}

/**
 * PasswordField
 * @description Function
 */
export const PasswordField = ({ control }: PasswordFieldProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 flex items-center gap-2">
            Password *
            <SecurityBadge type="encryption" size="sm" showLabel={false} />
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="******"
                type={showPassword ? 'text' : 'password'}
                {...field}
                disabled={isLoading}
                className="text-gray-900 pr-10"
                maxLength={32}
                aria-describedby="password-helper" />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </FormControl>
          <div id="password-helper" className="text-xs text-gray-500 mt-1">
            Must be at least 6 characters. Use a strong password for your security.
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

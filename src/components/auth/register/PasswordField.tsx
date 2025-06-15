
import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { SecurityBadge } from "@/components/ui/SecurityBadge";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface Props {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}
export const PasswordField = ({ control, isLoading }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 flex items-center gap-2">
            Password
            <SecurityBadge type="encryption" size="sm" showLabel={false} />
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="******"
                type={showPassword ? "text" : "password"}
                {...field}
                disabled={isLoading}
                className="text-gray-900 pr-10"
                maxLength={32}
                aria-describedby="password-helper"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormControl>
          <div
            id="password-helper"
            className="text-xs text-gray-500 mt-1 animate-fade-in"
          >
            Must be at least 6 characters. Use a strong password for your security.
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

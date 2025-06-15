
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
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface Props {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}
export const ConfirmPasswordField = ({ control, isLoading }: Props) => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">Confirm Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="******"
                type={showConfirmPassword ? "text" : "password"}
                {...field}
                disabled={isLoading}
                className="text-gray-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

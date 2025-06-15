
import { EnhancedFormField } from "@/components/ui/EnhancedFormField";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface Props {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}
export const EmailField = ({ control, isLoading }: Props) => (
  <EnhancedFormField
    control={control}
    name="email"
    label="Email"
    required
    type="email"
    placeholder="your.email@example.com"
    tooltip="We'll send important updates to this address."
    helperText="Use a personal email you check regularly."
    disabled={isLoading}
    securityBadgeType="data-protection"
    maxLength={64}
  />
);

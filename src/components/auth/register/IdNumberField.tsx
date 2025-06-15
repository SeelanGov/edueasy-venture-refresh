
import { EnhancedFormField } from "@/components/ui/EnhancedFormField";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface Props {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}
export const IdNumberField = ({ control, isLoading }: Props) => (
  <EnhancedFormField
    control={control}
    name="idNumber"
    label="ID Number"
    required
    placeholder="1234567890123"
    tooltip="South African 13-digit ID number. Digits only."
    helperText="Used for identity verification."
    disabled={isLoading}
    securityBadgeType="verification"
    maxLength={13}
    patternExample="1234567890123"
  />
);


import { EnhancedFormField } from "@/components/ui/EnhancedFormField";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface Props {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}
export const FullNameField = ({ control, isLoading }: Props) => (
  <EnhancedFormField
    control={control}
    name="fullName"
    label="Full Name"
    required
    placeholder="John Doe"
    tooltip="Enter your full legal name as it appears on your ID."
    helperText="This will be used for your application documents."
    disabled={isLoading}
    securityBadgeType="privacy"
    maxLength={50}
  />
);

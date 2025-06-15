
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { RegisterFormValues } from "../RegisterForm";

interface Props {
  control: Control<RegisterFormValues>;
  isLoading: boolean;
}

export const GenderField = ({ control, isLoading }: Props) => (
  <FormField
    control={control}
    name="gender"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-700">Gender</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={isLoading}
        >
          <FormControl>
            <SelectTrigger className="text-gray-900">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

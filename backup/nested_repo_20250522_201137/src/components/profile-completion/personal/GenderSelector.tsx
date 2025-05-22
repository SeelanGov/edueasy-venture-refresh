
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { PersonalInfoFormValues } from "./types";

interface GenderSelectorProps {
  control: Control<PersonalInfoFormValues>;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger
                aria-required="true"
                aria-invalid={field.value === "" ? "true" : "false"}
                className="focus-visible-ring rounded-lg transition-all hover:border-primary/50"
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
            </FormControl>
            <SelectContent position="popper" className="bg-background border rounded-lg shadow-soft">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

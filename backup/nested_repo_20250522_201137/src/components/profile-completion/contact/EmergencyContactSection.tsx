
import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ContactFormValues } from "./types";

interface EmergencyContactSectionProps {
  control: Control<ContactFormValues>;
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({ control }) => {
  return (
    <div className="space-y-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="text-lg font-medium">Emergency Contact</h3>
      
      <FormField
        control={control}
        name="emergencyContactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Name of your emergency contact"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="emergencyContactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Phone</FormLabel>
            <FormControl>
              <Input 
                placeholder="0821234567 or +27821234567"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Enter a valid South African phone number
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

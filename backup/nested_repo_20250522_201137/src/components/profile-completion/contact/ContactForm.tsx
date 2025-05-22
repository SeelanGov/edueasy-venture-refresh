
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/Spinner";
import { ContactFormValues } from "./types";
import { EmergencyContactSection } from "./EmergencyContactSection";

// South African phone number validation
const validateSAPhoneNumber = (phone: string) => {
  // Allow formats: +27XXXXXXXXX, 0XXXXXXXXX (10 digits)
  return /^(\+27|0)[1-9][0-9]{8}$/.test(phone);
};

const contactInfoSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .refine(validateSAPhoneNumber, "Invalid South African phone number"),
  contactEmail: z.string().email("Please enter a valid email address"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .refine(validateSAPhoneNumber, "Invalid South African phone number"),
});

interface ContactFormProps {
  initialValues: ContactFormValues;
  onSubmit: (data: ContactFormValues) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const ContactForm = ({ initialValues, onSubmit, onBack, isSubmitting }: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
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
        
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <EmergencyContactSection control={form.control} />
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="border-cap-teal text-cap-teal hover:bg-cap-teal/10"
          >
            Back
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-cap-teal hover:bg-cap-teal/90"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

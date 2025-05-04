
import { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { Spinner } from "@/components/Spinner";

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

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ContactInfoStep = ({ onComplete, onBack }: ContactInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contactInfo, setContactInfo } = useProfileCompletionStore();
  
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phoneNumber: contactInfo.phoneNumber || "",
      contactEmail: contactInfo.contactEmail || user?.email || "",
      emergencyContactName: contactInfo.emergencyContactName || "",
      emergencyContactPhone: contactInfo.emergencyContactPhone || "",
    },
  });

  const onSubmit = async (data: ContactInfoFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save data to Supabase
      const { error } = await supabase
        .from('users')
        .update({
          phone_number: data.phoneNumber,
          contact_email: data.contactEmail,
          emergency_contact_name: data.emergencyContactName,
          emergency_contact_phone: data.emergencyContactPhone,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Save to store
      setContactInfo({
        phoneNumber: data.phoneNumber,
        contactEmail: data.contactEmail,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving contact info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
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
          
          <div className="space-y-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-lg font-medium">Emergency Contact</h3>
            
            <FormField
              control={form.control}
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
              control={form.control}
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
    </div>
  );
};

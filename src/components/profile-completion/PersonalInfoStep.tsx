
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { Spinner } from "@/components/Spinner";

// South African ID validation
const validateSAID = (id: string) => {
  // ID must be 13 digits
  if (!/^\d{13}$/.test(id)) return false;
  
  // Check checksum digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i]) * (i % 2 === 0 ? 1 : 2);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(id[12]);
};

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  idNumber: z.string()
    .length(13, "ID Number must be exactly 13 digits")
    .regex(/^\d+$/, "ID Number must contain only digits")
    .refine(validateSAID, "Invalid South African ID number"),
  gender: z.string().min(1, "Gender is required"),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  onComplete: () => void;
}

export const PersonalInfoStep = ({ onComplete }: PersonalInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personalInfo, setPersonalInfo } = useProfileCompletionStore();
  
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: personalInfo.fullName || "",
      idNumber: personalInfo.idNumber || "",
      gender: personalInfo.gender || "",
    },
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save data to Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          id_number: data.idNumber,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Save to store
      setPersonalInfo({
        fullName: data.fullName,
        idNumber: data.idNumber,
        gender: data.gender,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving personal info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="13 digit South African ID number" 
                    {...field} 
                    maxLength={13}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
          
          <div className="flex justify-end pt-4">
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

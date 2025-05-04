
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// South African postal code validation
const validatePostalCode = (code: string) => {
  return /^\d{4}$/.test(code);
};

// South African provinces
const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

const addressSchema = z.object({
  addressType: z.enum(["residential", "postal"]),
  streetAddress: z.string().min(5, "Street address is required"),
  suburb: z.string().min(2, "Suburb is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string()
    .min(4, "Postal code must be 4 digits")
    .max(4, "Postal code must be 4 digits")
    .refine(validatePostalCode, "Invalid South African postal code"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressInfoStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AddressInfoStep = ({ onComplete, onBack }: AddressInfoStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addressInfo, setAddressInfo } = useProfileCompletionStore();
  
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressType: addressInfo.addressType || "residential",
      streetAddress: addressInfo.streetAddress || "",
      suburb: addressInfo.suburb || "",
      city: addressInfo.city || "",
      province: addressInfo.province || "",
      postalCode: addressInfo.postalCode || "",
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Save data to Supabase
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          address_type: data.addressType,
          street_address: data.streetAddress,
          suburb: data.suburb,
          city: data.city,
          province: data.province,
          postal_code: data.postalCode,
        });
        
      if (error) throw error;
      
      // Save to store
      setAddressInfo({
        addressType: data.addressType,
        streetAddress: data.streetAddress,
        suburb: data.suburb,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving address info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Address Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="addressType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="residential" id="residential" />
                      <label htmlFor="residential" className="cursor-pointer">Residential</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="postal" id="postal" />
                      <label htmlFor="postal" className="cursor-pointer">Postal</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="suburb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suburb</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your suburb" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="4-digit code" 
                      maxLength={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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

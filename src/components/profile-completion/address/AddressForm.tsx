import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/Spinner';
import { type AddressFormValues  } from './types';
import { ProvinceSelector } from './ProvinceSelector';
import { AddressTypeSelector } from './AddressTypeSelector';




import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';






// South African postal code validation
const validatePostalCode = (code: string): boolean => {
  return /^\d{4}$/.test(code);
};

const addressSchema = z.object({
  addressType: z.enum(['residential', 'postal']),
  streetAddress: z.string().min(5, 'Street address is required'),
  suburb: z.string().min(2, 'Suburb is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z
    .string()
    .min(4, 'Postal code must be 4 digits')
    .max(4, 'Postal code must be 4 digits')
    .refine(validatePostalCode, 'Invalid South African postal code'),
});

interface AddressFormProps {
  initialValues: AddressFormValues;
  onSubmit: (data: AddressFormValues) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

/**
 * AddressForm
 * @description Function
 */
export const AddressForm = ({
  initialValues,
  onSubmit,
  onBack,
  isSubmitting,
}: AddressFormProps): JSX.Element => {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AddressTypeSelector control={form.control} />

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
                  <Input placeholder="4-digit code" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ProvinceSelector control={form.control} />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-cap-teal text-cap-teal hover:bg-cap-teal/10">
            Back
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-cap-teal hover:bg-cap-teal/90">
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
};


import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/Spinner';
import { PersonalInfoFormValues } from './types';
import { GenderSelector } from './GenderSelector';

// South African ID validation
const validateSAID = (id: string) => {
  // ID must be 13 digits
  if (!/^\d{13}$/.test(id)) return false;

  // Check checksum digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(id[i]);
    if (isNaN(digit)) return false;
    sum += digit * (i % 2 === 0 ? 1 : 2);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(id[12]);
  return !isNaN(lastDigit) && checkDigit === lastDigit;
};

const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  idNumber: z
    .string()
    .length(13, 'ID Number must be exactly 13 digits')
    .regex(/^\d+$/, 'ID Number must contain only digits')
    .refine(validateSAID, 'Invalid South African ID number'),
  gender: z.string().min(1, 'Gender is required'),
});

interface PersonalInfoFormProps {
  initialValues: PersonalInfoFormValues;
  onSubmit: (data: PersonalInfoFormValues) => void;
  isSubmitting: boolean;
}

export const PersonalInfoForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
}: PersonalInfoFormProps) => {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialValues,
  });

  return (
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
                <Input placeholder="13 digit South African ID number" {...field} maxLength={13} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <GenderSelector control={form.control} />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-cap-teal hover:bg-cap-teal/90"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

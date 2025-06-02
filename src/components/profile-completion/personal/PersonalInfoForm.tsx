
import { Spinner } from '@/components/Spinner';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GenderSelector } from './GenderSelector';
import { PersonalInfoFormValues } from './types';

// South African ID validation
const validateSAID = (id: string): boolean => {
  // Check if id is undefined or not a string
  if (!id || typeof id !== 'string') return false;

  // Check if id has exactly 13 digits
  if (!/^\d{13}$/.test(id)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    // Safely access characters with bounds checking
    if (i >= id.length) return false;

    const char = id.charAt(i);
    const digit = parseInt(char, 10);
    if (isNaN(digit)) return false;

    // Apply Luhn algorithm
    sum += digit * (i % 2 === 0 ? 1 : 2);
  }

  // Calculate check digit
  const checkDigit = (10 - (sum % 10)) % 10;

  // Safely access the last character
  if (id.length < 13) return false;

  const lastChar = id.charAt(12);
  const lastDigit = parseInt(lastChar, 10);
  return !isNaN(lastDigit) && checkDigit === lastDigit;
};

const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  idNumber: z
    .string()
    .length(13, 'ID Number must be exactly 13 digits')
    .regex(/^\d+$/, 'ID Number must contain only digits')
    .refine((val) => validateSAID(val || ''), 'Invalid South African ID number'),
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

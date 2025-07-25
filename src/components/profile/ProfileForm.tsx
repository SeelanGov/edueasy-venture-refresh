import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/Spinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';

const profileFormSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  idNumber: z
    .string()
    .length(13, 'ID Number must be exactly 13 digits')
    .regex(/^\d+$/, 'ID Number must contain only digits'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User | null;
  initialData: {
    email: string;
    fullName: string;
    idNumber: string;
  };
}


/**
 * ProfileForm
 * @description Function
 */
export const ProfileForm = ({ user, initialData }: ProfileFormProps): void => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: initialData.email || '',
      fullName: initialData.fullName || '',
      idNumber: initialData.idNumber || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: dbError } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          id_number: data.idNumber,
        })
        .eq('id', user.id);
      if (dbError) throw dbError;
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (err) {
      const parsed = parseError(err);
      logError(parsed);
      setError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} disabled className="bg-gray-100" />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} disabled={isSubmitting} />
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
                <Input placeholder="13-digit ID number" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-cap-teal hover:bg-cap-teal/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

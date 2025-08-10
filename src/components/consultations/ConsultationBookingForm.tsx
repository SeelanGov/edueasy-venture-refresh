import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z  from 'zod';
import { PaymentForm } from '@/components/subscription/PaymentForm';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';











import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



// Define the form schema
const formSchema = z.object({
  bookingDate: z.date({
    required_error: 'Please select a date for your consultation.',
  }),
  timeSlot: z.string({
    required_error: 'Please select a time slot.',
  }),
  duration: z.string({
    required_error: 'Please select a duration.',
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ConsultationBookingFormProps {
  onSubmit: (date: Date, durationMinutes: number, notes?: string) => void;
  onCancel: () => void;
  consultationPrice: number;
}

/**
 * ConsultationBookingForm
 * @description Function
 */
export function ConsultationBookingForm({
  onSubmit,
  onCancel,
  consultationPrice,
}: any): JSX.Element {
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<{
    date: Date;
    duration: number;
    notes?: string;
  } | null>(null);

  // Define available time slots
  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // Define available durations
  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
  ];

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
    },
  });

  // Handle form submission
  const handleFormSubmit = (values: FormValues): void => {
    // Combine date and time
    const [hours, minutes] = values.timeSlot.split(':').map(Number);
    const bookingDateTime = new Date(values.bookingDate);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    // Fix duration parsing with proper validation
    const durationValue = parseInt(values.duration, 10);
    if (isNaN(durationValue) || durationValue <= 0) {
      form.setError('duration', { message: 'Please select a valid duration' });
      return;
    }

    // Fix notes handling - properly handle undefined for exactOptionalPropertyTypes
    const notesValue = values.notes?.trim();
    const formDataToSet: {
      date: Date;
      duration: number;
      notes?: string;
    } = {
      date: bookingDateTime,
      duration: durationValue,
    };

    // Only add notes if it has a value
    if (notesValue && notesValue !== '') {
      formDataToSet.notes = notesValue;
    }

    setFormData(formDataToSet);

    // Show payment form
    setShowPayment(true);
  };

  // Handle payment completion
  const handlePaymentComplete = (): void => {
    if (formData) {
      onSubmit(formData.date, formData.duration, formData.notes);
    }
  };

  // If showing payment form
  if (showPayment && formData) {
    return (
      <div className="space-y-4">
        <Card className="border border-gray-100">
          <CardHeader>
            <h3 className="font-medium text-gray-800">Booking Summary</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Date: {format(formData.date, 'PPP')}</p>
            <p className="text-sm text-gray-600">Time: {format(formData.date, 'p')}</p>
            <p className="text-sm text-gray-600">Duration: {formData.duration} minutes</p>
            {formData.notes && <p className="text-sm text-gray-600">Notes: {formData.notes}</p>}
          </CardContent>
        </Card>

        <PaymentForm
          amount={consultationPrice * (formData.duration / 30)} // Price scales with duration
          description={`Consultation Booking (${formData.duration} minutes)`}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    );
  }

  // Booking form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bookingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-700">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-gray-500',
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0 || date.getDay() === 6
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-gray-600">
                Select a weekday for your consultation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-gray-200 focus:border-cap-teal">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-cap-teal" />
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-600">
                Choose a time that works for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-gray-200 focus:border-cap-teal">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label} (R{consultationPrice * (parseInt(duration.value) / 30)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-600">
                Longer sessions allow for more in-depth guidance.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any specific topics or questions you'd like to discuss"
                  className="resize-none border-gray-200 focus:border-cap-teal"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-600">
                Help us prepare for your consultation by providing additional details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Continue to Payment
          </Button>
        </div>
      </form>
    </Form>
  );
}

import React from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import type { SubjectMark } from '@/hooks/useProfileCompletionStore';
import { GradeSubjectsTab } from './GradeSubjectsTab';

// South African provinces
const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

// Ensure Zod schema matches the SubjectMark interface
const subjectMarkSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  mark: z.coerce
    .number()
    .min(0, 'Mark must be between 0 and 100')
    .max(100, 'Mark must be between 0 and 100'),
});

const educationSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  province: z.string().min(2, 'Province is required'),
  completionYear: z.coerce
    .number()
    .min(1990, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  grade11Subjects: z
    .array(subjectMarkSchema)
    .min(6, 'You must include at least 6 subjects for Grade 11'),
  grade12Subjects: z
    .array(subjectMarkSchema)
    .min(6, 'You must include at least 6 subjects for Grade 12'),
});

export type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationFormProps {
  initialValues: EducationFormValues;
  onSubmit: (data: EducationFormValues) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

/**
 * EducationForm
 * @description Function
 */
export const EducationForm: React.FC<EducationFormProps> = ({
  initialValues,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const [activeTab, setActiveTab] = React.useState('grade11');

  // Helper function to create a properly typed SubjectMark object
  const createSubject = (): SubjectMark => {
    return {
      id: uuidv4(),
      subject: '',
      mark: 0,
    };
  };

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialValues,
  });

  const {
    fields: grade11Fields,
    append: appendGrade11,
    remove: removeGrade11,
  } = useFieldArray({
    control: form.control,
    name: 'grade11Subjects',
  });

  const {
    fields: grade12Fields,
    append: appendGrade12,
    remove: removeGrade12,
  } = useFieldArray({
    control: form.control,
    name: 'grade12Subjects',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
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
        </div>

        <FormField
          control={form.control}
          name="completionYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Completion</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="YYYY"
                  min={1990}
                  max={new Date().getFullYear()}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <h3 className="text-lg font-medium mb-4">Subject Marks</h3>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grade11">Grade 11</TabsTrigger>
              <TabsTrigger value="grade12">Grade 12</TabsTrigger>
            </TabsList>

            <TabsContent value="grade11">
              <GradeSubjectsTab
                gradeFields={grade11Fields}
                control={form.control}
                fieldName="grade11Subjects"
                append={appendGrade11}
                remove={removeGrade11}
                createSubject={createSubject}
              />
            </TabsContent>

            <TabsContent value="grade12">
              <GradeSubjectsTab
                gradeFields={grade12Fields}
                control={form.control}
                fieldName="grade12Subjects"
                append={appendGrade12}
                remove={removeGrade12}
                createSubject={createSubject}
              />
            </TabsContent>
          </Tabs>
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
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import { useInstitutionsAndPrograms } from '@/hooks/useInstitutionsAndPrograms';
import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export interface ApplicationFormValues {
  fullName: string;
  idNumber: string;
  grade12Results: string;
  university: string;
  program: string;
  documentFile?: File;
  personalStatement?: string;
}

interface ApplicationFormFieldsProps {
  form: UseFormReturn<ApplicationFormValues>;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


/**
 * ApplicationFormFields
 * @description Function
 */
export const ApplicationFormFields = ({
  form,
  isSubmitting,
  handleFileChange,
}: ApplicationFormFieldsProps): void => {
  const {
    institutions,
    filteredPrograms,
    loading,
    error,
    selectedInstitutionId,
    setSelectedInstitutionId,
  } = useInstitutionsAndPrograms();

  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Your full name"
                {...field}
                readOnly
                disabled
                className="md:text-base"
              />
            </FormControl>
            <FormDescription className="md:text-sm">
              Name as it appears in your ID document
            </FormDescription>
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
                placeholder="13-digit ID number"
                {...field}
                readOnly
                disabled
                className="md:text-base"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="grade12Results"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade 12 Results</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. 80%"
                {...field}
                disabled={isSubmitting}
                className="md:text-base"
              />
            </FormControl>
            <FormDescription className="md:text-sm">Your final overall percentage</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading institutions or programs. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedInstitutionId(value);
                  // Reset program when university changes
                  form.setValue('program', '');
                }}
                defaultValue={field.value}
                disabled={isSubmitting || loading}
              >
                <FormControl>
                  <SelectTrigger className="md:h-11">
                    <SelectValue placeholder="Select a university" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loading ? (
                    <div className="flex justify-center p-2">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting || !selectedInstitutionId}
              >
                <FormControl>
                  <SelectTrigger className="md:h-11">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredPrograms.length === 0 && selectedInstitutionId ? (
                    <div className="p-2 text-center text-sm text-gray-500">No programs found</div>
                  ) : (
                    filteredPrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))
                  )}
                  {!selectedInstitutionId && (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Select a university first
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="personalStatement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Personal Statement</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us why you're interested in this program..."
                {...field}
                disabled={isSubmitting}
                className="min-h-[120px] md:min-h-[150px] md:text-base"
              />
            </FormControl>
            <FormDescription className="md:text-sm">
              Briefly explain why you're applying for this program
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="documentFile"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Upload Document (PDF only)</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Input
                  type="file"
                  accept="application/pdf"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => {
                    handleFileChange(e);
                    onChange(e.target.files?.[0] || null);
                  }}
                  className="md:text-base md:py-2"
                />
              </div>
            </FormControl>
            <FormDescription className="md:text-sm">
              Upload your ID copy, transcript, or other supporting documents
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

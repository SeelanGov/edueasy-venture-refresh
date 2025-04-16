
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export interface ApplicationFormValues {
  fullName: string;
  idNumber: string;
  grade12Results: string;
  university: string;
  program: string;
  documentFile?: File;
}

interface ApplicationFormFieldsProps {
  form: UseFormReturn<ApplicationFormValues>;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ApplicationFormFields = ({ form, isSubmitting, handleFileChange }: ApplicationFormFieldsProps) => {
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
              />
            </FormControl>
            <FormDescription>
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
              />
            </FormControl>
            <FormDescription>
              Your final overall percentage
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a university" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UCT">University of Cape Town (UCT)</SelectItem>
                  <SelectItem value="Wits">University of Witwatersrand (Wits)</SelectItem>
                  <SelectItem value="UP">University of Pretoria (UP)</SelectItem>
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
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BSc">Bachelor of Science (BSc)</SelectItem>
                  <SelectItem value="BA">Bachelor of Arts (BA)</SelectItem>
                  <SelectItem value="BCom">Bachelor of Commerce (BCom)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                />
              </div>
            </FormControl>
            <FormDescription>
              Upload your ID copy, transcript, or other supporting documents
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

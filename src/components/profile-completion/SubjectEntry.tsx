import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { type Control  } from 'react-hook-form';



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



// Common South African high school subjects
const commonSubjects = [
  'English',
  'Afrikaans',
  'isiZulu',
  'isiXhosa',
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'Geography',
  'History',
  'Accounting',
  'Business Studies',
  'Economics',
  'Life Orientation',
  'Computer Applications Technology',
  'Information Technology',
  'Consumer Studies',
  'Tourism',
];

interface SubjectEntryProps {
  index: number;
  control: Control<any>;
  fieldName: string;
  canDelete: boolean;
  onDelete: () => void;
}

/**
 * SubjectEntry
 * @description Function
 */
export const SubjectEntry = ({
  index,
  control,
  fieldName,
  canDelete,
  onDelete,
}: SubjectEntryProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center mb-4">
      <div className="col-span-8">
        <FormField
          control={control}
          name={`${fieldName}.${index}.subject` as any}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {commonSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-3">
        <FormField
          control={control}
          name={`${fieldName}.${index}.mark` as any}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="number" placeholder="%" min={0} max={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        {canDelete && (
          <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import type { SubjectMark } from '@/hooks/useProfileCompletionStore';
import { SubjectEntry } from './SubjectEntry';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Control } from 'react-hook-form';

interface EducationFormData {
  province: string;
  schoolName: string;
  completionYear: number;
  grade11Subjects: SubjectMark[];
  grade12Subjects: SubjectMark[];
}

interface GradeSubjectsTabProps {
  gradeFields: Record<'id', string>[];
  control: Control<EducationFormData>;
  fieldName: string;
  append: (value: SubjectMark) => void;
  remove: (index: number) => void;
  createSubject: () => SubjectMark;
}

/**
 * GradeSubjectsTab
 * @description Function
 */
export const GradeSubjectsTab: React.FC<GradeSubjectsTabProps> = ({
  gradeFields,
  control,
  fieldName,
  append,
  remove,
  createSubject,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        {gradeFields.map((field, index) => (
          <SubjectEntry
            key={field.id}
            index={index}
            control={control as any}
            fieldName={fieldName}
            canDelete={index > 5}
            onDelete={() => remove(index)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createSubject())}
          className="mt-2 text-cap-teal border-cap-teal hover:bg-cap-teal/10"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </CardContent>
    </Card>
  );
};

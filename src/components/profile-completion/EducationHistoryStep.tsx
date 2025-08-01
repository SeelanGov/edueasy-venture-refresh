import { useAuth } from '@/hooks/useAuth';
import { useProfileCompletionStore, type SubjectMark } from '@/hooks/useProfileCompletionStore';
import { supabase } from '@/integrations/supabase/client';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EducationForm, type EducationFormValues } from './EducationForm';

interface EducationHistoryStepProps {
  onComplete: () => void;
  onBack: () => void;
}

/**
 * EducationHistoryStep
 * @description Function
 */
export const EducationHistoryStep = ({ onComplete, onBack }: EducationHistoryStepProps): JSX.Element => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { educationInfo, setEducationInfo } = useProfileCompletionStore();

  // Helper function to create a properly typed SubjectMark object
  const createSubject = (subject: string = '', mark: number = 0): SubjectMark => {
    return {
      id: uuidv4(),
      subject,
      mark,
    };
  };

  // Create default subject entries with guaranteed typing
  const createDefaultSubjects = (): SubjectMark[] => {
    return Array(7)
      .fill(0)
      .map(() => createSubject());
  };

  // Ensure stored subjects are properly typed
  const ensureValidSubjects = (subjects: unknown[] | undefined): SubjectMark[] => {
    if (!subjects || subjects.length === 0) {
      return createDefaultSubjects();
    }

    // Map each subject to ensure it has all required properties
    return subjects.map((subject) => {
      return {
        id: (subject as SubjectMark).id || uuidv4(),
        subject: (subject as SubjectMark).subject || '',
        mark: typeof (subject as SubjectMark).mark === 'number' ? (subject as SubjectMark).mark : 0,
      };
    });
  };

  // Prepare initial values for the form with explicit typing
  const initialValues: EducationFormValues = {
    schoolName: educationInfo.schoolName || '',
    province: educationInfo.province || '',
    completionYear: educationInfo.completionYear || new Date().getFullYear(),
    grade11Subjects: ensureValidSubjects(educationInfo.grade11Subjects),
    grade12Subjects: ensureValidSubjects(educationInfo.grade12Subjects),
  };

  const onSubmit = async (data: EducationFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);
    try {
      // Save education record to Supabase
      const { data: educationRecord, error: educationError } = await supabase
        .from('education_records')
        .insert({
          user_id: user.id,
          school_name: data.schoolName,
          province: data.province,
          completion_year: data.completionYear,
        })
        .select()
        .single();

      if (educationError) throw educationError;

      // Save Grade 11 subject marks
      if (educationRecord) {
        const grade11Marks = data.grade11Subjects.map((subject) => ({
          education_record_id: educationRecord.id,
          subject_name: subject.subject,
          grade_level: 'grade11',
          mark: subject.mark,
        }));

        const { error: grade11Error } = await supabase.from('subject_marks').insert(grade11Marks);

        if (grade11Error) throw grade11Error;

        // Save Grade 12 subject marks
        const grade12Marks = data.grade12Subjects.map((subject) => ({
          education_record_id: educationRecord.id,
          subject_name: subject.subject,
          grade_level: 'grade12',
          mark: subject.mark,
        }));

        const { error: grade12Error } = await supabase.from('subject_marks').insert(grade12Marks);

        if (grade12Error) throw grade12Error;
      }

      // Save to store - ensuring we explicitly cast to the expected type to guarantee type safety
      setEducationInfo({
        schoolName: data.schoolName,
        province: data.province,
        completionYear: data.completionYear,
        grade11Subjects: data.grade11Subjects as SubjectMark[],
        grade12Subjects: data.grade12Subjects as SubjectMark[],
      });

      onComplete();
    } catch (err) {
      const parsed = parseError(err);
      logError(parsed);
      setError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Education History</h2>
      {error && (
        <div className="text-red-500 p-2 mb-2 text-center" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <EducationForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onBack={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

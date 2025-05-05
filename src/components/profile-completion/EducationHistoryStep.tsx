
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { EducationForm, EducationFormValues } from "./EducationForm";

interface EducationHistoryStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const EducationHistoryStep = ({ onComplete, onBack }: EducationHistoryStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { educationInfo, setEducationInfo } = useProfileCompletionStore();
  
  // Helper function to create a properly typed SubjectMark object
  const createSubject = (subject: string = "", mark: number = 0) => {
    return {
      id: uuidv4(),
      subject,
      mark
    };
  };
  
  // Create default subject entries with guaranteed typing
  const createDefaultSubjects = () => {
    return Array(7).fill(0).map(() => createSubject());
  };
  
  // Prepare initial values for the form
  const initialValues: EducationFormValues = {
    schoolName: educationInfo.schoolName || "",
    province: educationInfo.province || "",
    completionYear: educationInfo.completionYear || new Date().getFullYear(),
    grade11Subjects: educationInfo.grade11Subjects && educationInfo.grade11Subjects.length > 0 
      ? educationInfo.grade11Subjects.map(subject => createSubject(subject.subject, subject.mark))
      : createDefaultSubjects(),
    grade12Subjects: educationInfo.grade12Subjects && educationInfo.grade12Subjects.length > 0
      ? educationInfo.grade12Subjects.map(subject => createSubject(subject.subject, subject.mark))
      : createDefaultSubjects(),
  };

  const onSubmit = async (data: EducationFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
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
        const grade11Marks = data.grade11Subjects.map(subject => ({
          education_record_id: educationRecord.id,
          subject_name: subject.subject,
          grade_level: 'grade11',
          mark: subject.mark,
        }));
        
        const { error: grade11Error } = await supabase
          .from('subject_marks')
          .insert(grade11Marks);
          
        if (grade11Error) throw grade11Error;
        
        // Save Grade 12 subject marks
        const grade12Marks = data.grade12Subjects.map(subject => ({
          education_record_id: educationRecord.id,
          subject_name: subject.subject,
          grade_level: 'grade12',
          mark: subject.mark,
        }));
        
        const { error: grade12Error } = await supabase
          .from('subject_marks')
          .insert(grade12Marks);
          
        if (grade12Error) throw grade12Error;
      }
      
      // Save to store
      setEducationInfo({
        schoolName: data.schoolName,
        province: data.province,
        completionYear: data.completionYear,
        grade11Subjects: data.grade11Subjects,
        grade12Subjects: data.grade12Subjects,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving education info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Education History</h2>
      <EducationForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onBack={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

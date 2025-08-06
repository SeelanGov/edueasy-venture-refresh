// Define shared types for application form data
export interface DraftFormData {
  grade12Results: string;
  university: string;
  program: string;
  personalStatement?: string;
}

export interface ApplicationFormValues extends DraftFormData {
  fullName: string;
  idNumber: string;
}

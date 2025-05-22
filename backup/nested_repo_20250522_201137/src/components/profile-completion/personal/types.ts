
export interface PersonalInfoFormValues {
  fullName: string;
  idNumber: string;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say" | string;
}

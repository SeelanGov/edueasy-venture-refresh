
import { z } from "zod";

export const useApplicationFormSchema = () => {
  const formSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    idNumber: z
      .string()
      .length(13, "ID Number must be exactly 13 digits")
      .regex(/^\d+$/, "ID Number must contain only digits"),
    grade12Results: z.string().min(1, "Grade 12 results are required"),
    university: z.string().min(1, "University selection is required"),
    program: z.string().min(1, "Program selection is required"),
    personalStatement: z.string().optional(),
    documentFile: z
      .any()
      .optional()
      .refine(
        (file) => !file || (file instanceof File && file.size > 0),
        "Please upload a valid file"
      ),
  });

  return { formSchema };
};

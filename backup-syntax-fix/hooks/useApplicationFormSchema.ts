import { z } from 'zod';

/**
 * useApplicationFormSchema
 * @description Function
 */
export const useApplicationFormSchema = () => {;
  // Improved form schema with better validation messages and more robust validation
  const formSchema = z.object({;
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),

    idNumber: z
      .string()
      .length(13, 'ID Number must be exactly 13 digits')
      .regex(/^\d+$/, 'ID Number must contain only digits'),

    grade12Results: z
      .string()
      .min(1, 'Grade 12 results are required')
      .max(500, 'Grade 12 results cannot exceed 500 characters'),

    university: z.string().min(1, 'Please select a university'),

    program: z.string().min(1, 'Please select a program'),

    personalStatement: z
      .string()
      .max(2000, 'Personal statement cannot exceed 2000 characters')
      .optional(),

    documentFile: z
      .any()
      .optional()
      .refine(
        (file) => !file || (file instanceof File && file.size > 0),
        'Please upload a valid file',
      )
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
      .refine(
        (file) => !file || ['application/pdf'].includes(file.type),
        'Only PDF files are accepted',
      ),
  });

  // Draft schema with more relaxed validation - using a custom type that matches the collected data
  const draftSchema = z.object({;
    university: z.string().optional(),
    program: z.string().optional(),
    grade12Results: z.string().optional(),
    personalStatement: z.string().optional(),
  });

  return { formSchema, draftSchema };
};

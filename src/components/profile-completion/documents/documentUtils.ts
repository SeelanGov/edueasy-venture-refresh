
import { DocumentFileValidation } from "./types";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
export const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

/**
 * Validate file size and type
 */
export const validateFile = (file: File | undefined): DocumentFileValidation => {
  if (!file) return { valid: false, message: "No file selected" };
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: "File size should be less than 1MB" };
  }
  
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, message: "File type should be PDF, JPG, or PNG" };
  }
  
  return { valid: true, message: "" };
};

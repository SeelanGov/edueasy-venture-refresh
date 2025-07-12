import type { DocumentFileValidation } from './types';

export const validateFile = (file: File): DocumentFileValidation => {
  const maxSizeInBytes = 1024 * 1024; // 1MB
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

  if (!allowedFileTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'File type not supported. Please use JPEG, PNG or PDF.',
    };
  }

  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      message: 'File too large. Maximum size is 1MB.',
    };
  }

  return {
    valid: true,
    message: '',
  };
};

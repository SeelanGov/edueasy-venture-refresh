import { useState } from "react";
import { validateFile } from "@/components/profile-completion/documents/documentUtils";
import { DocumentType, RetryData, DocumentUploadState } from "@/components/profile-completion/documents/types";
import { compressImage } from "@/utils/imageCompression";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";

export const useFileProcessing = (
  setDocumentState: (documentType: DocumentType, state: Partial<DocumentUploadState>) => void,
  user?: { id?: string } | null
) => {
  const processFile = async (
    file: File,
    documentType: DocumentType,
    isResubmission: boolean = false
  ): Promise<{ valid: boolean; file: File | null; error?: unknown }> => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setDocumentState(documentType, { 
        file: null, 
        error: validation.message, 
        uploaded: false 
      });
      return { valid: false, file: null };
    }

    // Start upload
    setDocumentState(documentType, { 
      file,
      uploading: true, 
      progress: 0, 
      error: null, 
      uploaded: false,
      isResubmission: isResubmission
    });
    
    // Check if file is an image and needs compression
    const compressionNeeded = file.type.startsWith('image/') && file.size > 500 * 1024; // Compress if > 500KB
    
    // Process file (compress if needed)
    let fileToUpload = file;
    
    try {
      if (compressionNeeded) {
        setDocumentState(documentType, { progress: 10 });
        
        const { data: compressedFile, error: compressionError } = await safeAsyncWithLogging(
          () => compressImage(file),
          {
            component: "DocumentUpload",
            action: "CompressImage",
            userId: user?.id,
            severity: ErrorSeverity.WARNING,
            errorMessage: "Failed to compress image, uploading original file"
          }
        );
        
        if (compressedFile && !compressionError) {
          fileToUpload = compressedFile;
        }
        
        setDocumentState(documentType, { progress: 30 });
      }
      
      // Simulate progress
      setDocumentState(documentType, { progress: 50 });
      
      return { valid: true, file: fileToUpload };
    } catch (error: unknown) {
      console.error(`Error processing file for ${documentType}:`, error);
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : "File processing failed"
      });
      return { valid: false, file: null, error };
    }
  };

  const handleRetry = (
    documentType: DocumentType,
    currentState: DocumentUploadState,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => void
  ) => {
    if (currentState.retryData && currentState.retryData.file) {
      // Create a fake event object with the existing file
      const fakeEvent = {
        target: {
          files: [currentState.retryData.file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      // Clear error state
      setDocumentState(documentType, { 
        error: null, 
        retryData: null 
      });
      
      // Retry upload
      handleFileChange(fakeEvent, documentType);
    } else {
      // If no retry data, reset state
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: null, 
        uploaded: false 
      });
    }
  };

  return {
    processFile,
    handleRetry
  };
};

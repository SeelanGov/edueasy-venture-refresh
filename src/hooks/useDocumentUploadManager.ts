
import { useState, useEffect } from "react";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { useDocumentUploadWithErrorHandling } from "@/hooks/useDocumentUploadWithErrorHandling";
import { useStepperManager } from "@/hooks/useStepperManager";
import { DocumentType, DocumentUploadState } from "@/components/profile-completion/documents/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentInfo } from "@/types/ApplicationTypes";

const schema = z.object({
  idDocument: z.any().optional(),
  proofOfResidence: z.any().optional(),
  grade11Results: z.any().optional(),
  grade12Results: z.any().optional(),
});

type DocumentsFormValues = z.infer<typeof schema>;

export const useDocumentUploadManager = () => {
  const { user } = useAuth();
  const [uploadSteps, setUploadSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const { documents } = useProfileCompletionStore();
  
  const [documentStates, setDocumentStates] = useState<Record<DocumentType, DocumentUploadState>>({
    idDocument: {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
    },
    proofOfResidence: {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
    },
    grade11Results: {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
    },
    grade12Results: {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
    },
  });
  
  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(schema),
  });
  
  // Get document state based on type
  const getDocumentState = (documentType: string): DocumentUploadState => {
    return documentStates[documentType as DocumentType] || {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
    };
  };
  
  // Set document state based on type
  const setDocumentState = (documentType: string, state: Partial<DocumentUploadState>) => {
    setDocumentStates(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType as DocumentType],
        ...state,
      },
    }));
  };
  
  // Document upload handler with error handling
  const {
    handleFileChange,
    handleRetry,
    triggerVerification,
    isVerifying,
    verificationResult,
  } = useDocumentUploadWithErrorHandling(
    getDocumentState,
    setDocumentState,
    setCurrentDocumentType,
    form
  );
  
  // Use the stepper manager for updates
  useStepperManager(
    currentDocumentType,
    getDocumentState,
    setUploadSteps,
    setCurrentStep,
    isVerifying,
    verificationResult
  );
  
  // Initialize document states from store
  useEffect(() => {
    if (!documents) return;
    
    Object.entries(documents).forEach(([key, doc]) => {
      if (doc && typeof doc !== 'string' && 'file' in doc && doc.file && doc.path) {
        setDocumentState(key, {
          file: doc.file,
          uploaded: true,
          uploading: false,
          progress: 100,
          error: null,
          documentId: doc.documentId,
          filePath: doc.path,
        });
        
        form.setValue(key as keyof DocumentsFormValues, doc.file);
      }
    });
  }, [documents, form]);
  
  // Check if required documents are uploaded
  const checkCompletion = () => {
    const idDocumentState = getDocumentState('idDocument');
    const grade12ResultsState = getDocumentState('grade12Results');
    
    if (idDocumentState.uploaded && grade12ResultsState.uploaded) {
      toast("All required documents uploaded successfully");
      return true;
    }
    
    return false;
  };
  
  // Handle verify button click
  const handleVerify = (documentType: DocumentType) => {
    const docState = getDocumentState(documentType);
    
    if (docState.documentId && user?.id && docState.filePath) {
      const callVerify = async () => {
        await triggerVerification(
          docState.documentId as string, 
          user.id, 
          documentType, 
          docState.filePath as string,
          docState.isResubmission
        );
      };
      
      callVerify();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (data: DocumentsFormValues) => {
    const allUploaded = checkCompletion();
    
    if (!allUploaded) {
      toast("Please upload all required documents (ID and Grade 12 Results)");
      return false;
    }
    
    return true;
  };
  
  // Handle document resubmission
  const handleResubmit = () => {
    if (!currentDocumentType) return;
    
    toast("Please select a new document to resubmit");
    
    // Mark this document as previously rejected to track resubmission
    setDocumentState(currentDocumentType, {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
      previouslyRejected: true,
      isResubmission: true,
    });
    
    // Trigger the file input
    const input = document.getElementById(`dropzone-file-${currentDocumentType}`) as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  };

  return {
    form,
    documentStates,
    uploadSteps,
    currentStep,
    currentDocumentType,
    isVerifying,
    verificationResult,
    getDocumentState,
    setDocumentState,
    handleFileChange,
    handleRetry,
    handleVerify,
    handleResubmit,
    handleSubmit,
    checkCompletion
  };
};


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DocumentUploadInput } from "./documents/DocumentUploadInput";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { DocumentType, DocumentUploadState } from "./documents/types";
import { useDocumentUploadWithErrorHandling } from "@/hooks/useDocumentUploadWithErrorHandling";
import { useStepperManager } from "@/hooks/useStepperManager";
import { toast } from "sonner";
import { Stepper } from "@/components/ui/stepper";

interface DocumentsUploadStepProps {
  onComplete: () => void;
  onBack: () => void;
}

const schema = z.object({
  idDocument: z.any().optional(),
  proofOfResidence: z.any().optional(),
  grade11Results: z.any().optional(),
  grade12Results: z.any().optional(),
});

type DocumentsFormValues = z.infer<typeof schema>;

export const DocumentsUploadStep = ({ onComplete, onBack }: DocumentsUploadStepProps) => {
  const { user } = useAuth();
  const [uploadSteps, setUploadSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const { documents } = useProfileCompletionStore();
  const [documentStates, setDocumentStates] = useState<Record<string, DocumentUploadState>>({
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
  
  // Get document upload state
  const getDocumentState = (documentType: string): DocumentUploadState => {
    return documentStates[documentType as DocumentType] || {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
    };
  };
  
  // Set document upload state
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
  
  // Initialize document states
  useEffect(() => {
    if (!documents) return;
    
    // Set initial document states from store
    Object.entries(documents).forEach(([key, doc]) => {
      if (doc && doc.file && doc.path) {
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
  
  // Complete step if all required documents are uploaded
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
  const onSubmit = async (data: DocumentsFormValues) => {
    const allUploaded = checkCompletion();
    
    if (!allUploaded) {
      toast("Please upload all required documents (ID and Grade 12 Results)");
      return;
    }
    
    onComplete();
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Document Upload</h2>
        <p className="text-gray-600 mb-6">
          Please upload the required documents. We need your ID document and Grade 12 results.
          Grade 11 results and proof of residence are optional.
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {currentDocumentType && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-3">
                <p className="font-semibold">
                  Document: {currentDocumentType.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
              <Stepper
                steps={uploadSteps}
                currentStep={currentStep}
              />
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUploadInput
            documentType="idDocument"
            label="ID Document"
            description="Upload your South African ID or passport"
            state={getDocumentState('idDocument')}
            onFileChange={handleFileChange}
            onRetry={handleRetry}
            onVerify={handleVerify}
            onResubmit={handleResubmit}
            verificationResult={verificationResult}
            isVerifying={isVerifying}
            setCurrentDocumentType={setCurrentDocumentType}
            currentDocumentType={currentDocumentType}
            uploadSteps={uploadSteps}
            currentStep={currentStep}
            accept="image/*, application/pdf"
          />
            
          <DocumentUploadInput
            documentType="proofOfResidence"
            label="Proof of Residence (Optional)"
            description="Upload a utility bill or bank statement"
            state={getDocumentState('proofOfResidence')}
            onFileChange={handleFileChange}
            onRetry={handleRetry}
            onVerify={handleVerify}
            onResubmit={handleResubmit}
            verificationResult={verificationResult}
            isVerifying={isVerifying}
            setCurrentDocumentType={setCurrentDocumentType}
            currentDocumentType={currentDocumentType}
            uploadSteps={uploadSteps}
            currentStep={currentStep}
            accept="image/*, application/pdf"
          />
            
          <DocumentUploadInput
            documentType="grade11Results"
            label="Grade 11 Results (Optional)"
            description="Upload your Grade 11 final results"
            state={getDocumentState('grade11Results')}
            onFileChange={handleFileChange}
            onRetry={handleRetry}
            onVerify={handleVerify}
            onResubmit={handleResubmit}
            verificationResult={verificationResult}
            isVerifying={isVerifying}
            setCurrentDocumentType={setCurrentDocumentType}
            currentDocumentType={currentDocumentType}
            uploadSteps={uploadSteps}
            currentStep={currentStep}
            accept="image/*, application/pdf"
          />
            
          <DocumentUploadInput
            documentType="grade12Results"
            label="Grade 12 Results"
            description="Upload your Grade 12 final results or latest available results"
            state={getDocumentState('grade12Results')}
            onFileChange={handleFileChange}
            onRetry={handleRetry}
            onVerify={handleVerify}
            onResubmit={handleResubmit}
            verificationResult={verificationResult}
            isVerifying={isVerifying}
            setCurrentDocumentType={setCurrentDocumentType}
            currentDocumentType={currentDocumentType}
            uploadSteps={uploadSteps}
            currentStep={currentStep}
            accept="image/*, application/pdf"
          />
        </div>
        
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={!checkCompletion()}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

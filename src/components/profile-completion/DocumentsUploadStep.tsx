import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DocumentType } from "./documents/types";
import { DocumentUploadInput } from "./documents/DocumentUploadInput";
import { useDocumentUploadState } from "@/hooks/useDocumentUploadState";
import { useDocumentUploadWithErrorHandling } from "@/hooks/useDocumentUploadWithErrorHandling";
import { useStepperManager } from "@/hooks/useStepperManager";
import { ACCEPTED_FILE_TYPES } from "./documents/documentUtils";
import { ErrorBoundary } from "@/components/error-handling/ErrorBoundary";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";
import { OfflineErrorDisplay } from "@/components/error-handling/OfflineErrorDisplay";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const documentsSchema = z.object({
  idDocument: z.any()
    .refine((file) => file?.size > 0, "ID document is required")
    .refine(
      (file) => !file || file.size <= 1024 * 1024,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
  proofOfResidence: z.any()
    .refine((file) => file?.size > 0, "Proof of residence is required")
    .refine(
      (file) => !file || file.size <= 1024 * 1024,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
  grade11Results: z.any()
    .refine((file) => file?.size > 0, "Grade 11 results are required")
    .refine(
      (file) => !file || file.size <= 1024 * 1024,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
  grade12Results: z.any()
    .refine((file) => file?.size > 0, "Grade 12 results are required")
    .refine(
      (file) => !file || file.size <= 1024 * 1024,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
});

type DocumentsFormValues = z.infer<typeof documentsSchema>;

interface DocumentsUploadStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const DocumentsUploadStep = ({ onComplete, onBack }: DocumentsUploadStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOnline } = useNetworkStatus();
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  // Initialize document upload state management
  const {
    currentDocumentType,
    setCurrentDocumentType,
    currentStep,
    setCurrentStep,
    uploadSteps,
    setUploadSteps,
    idDocumentState,
    proofOfResidenceState,
    grade11ResultsState,
    grade12ResultsState,
    getDocumentState,
    setDocumentState
  } = useDocumentUploadState();
  
  // Initialize the form
  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
  });

  // Initialize document upload handlers with error handling
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
  
  // Initialize stepper manager
  useStepperManager(
    currentDocumentType,
    getDocumentState,
    setUploadSteps,
    setCurrentStep,
    isVerifying,
    verificationResult
  );

  const checkConnection = async () => {
    setIsReconnecting(true);
    
    // Wait a moment and then update the online status
    setTimeout(() => {
      setIsReconnecting(false);
    }, 1500);
  };

  const onSubmit = async (data: DocumentsFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Check if all documents are uploaded
      const allUploaded = [
        idDocumentState.uploaded,
        proofOfResidenceState.uploaded,
        grade11ResultsState.uploaded,
        grade12ResultsState.uploaded,
      ].every(Boolean);
      
      if (!allUploaded) {
        toast({
          title: "Missing documents",
          description: "Please upload all required documents",
          variant: "destructive",
        });
        return;
      }
      
      // Use enhanced error handling
      const { error } = await safeAsyncWithLogging(
        async () => {
          // Additional validation could happen here
          return true;
        },
        {
          component: "DocumentsUploadStep",
          action: "ValidateAndSubmit",
          userId: user?.id,
          errorMessage: "Failed to process documents",
          severity: ErrorSeverity.ERROR
        }
      );
      
      if (!error) {
        // All documents are validated and uploaded, proceed to next step
        onComplete();
      }
    } catch (error) {
      console.error("Error in document submission:", error);
      toast({
        title: "Error",
        description: "Failed to process documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary component="DocumentsUploadStep">
      <div>
        <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
        <p className="text-gray-600 mb-6">
          Please upload the following documents. All files must be in PDF, JPG, or PNG format and less than 1MB in size.
          Each document will be automatically verified using AI technology.
        </p>
        
        {!isOnline && (
          <OfflineErrorDisplay 
            message="You appear to be offline. Document uploads require an internet connection." 
            onRetryConnection={checkConnection}
            isRetrying={isReconnecting}
            className="mb-6"
          />
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <DocumentUploadInput
                  documentType="idDocument"
                  label="ID Document Copy"
                  description="Upload a clear copy of your South African ID or passport"
                  state={idDocumentState}
                  onFileChange={handleFileChange}
                  onRetry={handleRetry}
                  onVerify={triggerVerification}
                  onResubmit={() => setDocumentState("idDocument", {
                    file: null,
                    uploading: false,
                    progress: 0,
                    error: null,
                    uploaded: false,
                    previouslyRejected: true,
                    isResubmission: true,
                  })}
                  verificationResult={verificationResult}
                  isVerifying={isVerifying}
                  setCurrentDocumentType={setCurrentDocumentType}
                  currentDocumentType={currentDocumentType}
                  uploadSteps={uploadSteps}
                  currentStep={currentStep}
                />
                
                <DocumentUploadInput
                  documentType="proofOfResidence"
                  label="Proof of Residence"
                  description="A utility bill, bank statement or affidavit confirming your address (less than 3 months old)"
                  state={proofOfResidenceState}
                  onFileChange={handleFileChange}
                  onRetry={handleRetry}
                  onVerify={triggerVerification}
                  onResubmit={() => setDocumentState("proofOfResidence", {
                    file: null,
                    uploading: false,
                    progress: 0,
                    error: null,
                    uploaded: false,
                    previouslyRejected: true,
                    isResubmission: true,
                  })}
                  verificationResult={verificationResult}
                  isVerifying={isVerifying}
                  setCurrentDocumentType={setCurrentDocumentType}
                  currentDocumentType={currentDocumentType}
                  uploadSteps={uploadSteps}
                  currentStep={currentStep}
                />
                
                <DocumentUploadInput
                  documentType="grade11Results"
                  label="Grade 11 Results"
                  description="Upload your Grade 11 final report or certificate"
                  state={grade11ResultsState}
                  onFileChange={handleFileChange}
                  onRetry={handleRetry}
                  onVerify={triggerVerification}
                  onResubmit={() => setDocumentState("grade11Results", {
                    file: null,
                    uploading: false,
                    progress: 0,
                    error: null,
                    uploaded: false,
                    previouslyRejected: true,
                    isResubmission: true,
                  })}
                  verificationResult={verificationResult}
                  isVerifying={isVerifying}
                  setCurrentDocumentType={setCurrentDocumentType}
                  currentDocumentType={currentDocumentType}
                  uploadSteps={uploadSteps}
                  currentStep={currentStep}
                />
                
                <DocumentUploadInput
                  documentType="grade12Results"
                  label="Grade 12 Results"
                  description="Upload your Grade 12 certificate or results statement"
                  state={grade12ResultsState}
                  onFileChange={handleFileChange}
                  onRetry={handleRetry}
                  onVerify={triggerVerification}
                  onResubmit={() => setDocumentState("grade12Results", {
                    file: null,
                    uploading: false,
                    progress: 0,
                    error: null,
                    uploaded: false,
                    previouslyRejected: true,
                    isResubmission: true,
                  })}
                  verificationResult={verificationResult}
                  isVerifying={isVerifying}
                  setCurrentDocumentType={setCurrentDocumentType}
                  currentDocumentType={currentDocumentType}
                  uploadSteps={uploadSteps}
                  currentStep={currentStep}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="border-cap-teal text-cap-teal hover:bg-cap-teal/10"
              >
                Back
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || 
                  idDocumentState.uploading || 
                  proofOfResidenceState.uploading || 
                  grade11ResultsState.uploading || 
                  grade12ResultsState.uploading ||
                  !isOnline}
                className="bg-cap-teal hover:bg-cap-teal/90"
              >
                {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ErrorBoundary>
  );
};

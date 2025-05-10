
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { Spinner } from "@/components/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload, CheckCircle, XCircle, FileIcon, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { compressImage } from "@/utils/imageCompression";
import { DocumentUploadStepper, Step } from "@/components/documents/DocumentUploadStepper";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { VerificationResultDisplay } from "@/components/documents/VerificationResultDisplay";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";
import { playNotificationSound } from "@/utils/notificationSound";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

// Validate file size and type
const validateFile = (file: File | undefined): { valid: boolean; message: string } => {
  if (!file) return { valid: false, message: "No file selected" };
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: "File size should be less than 1MB" };
  }
  
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, message: "File type should be PDF, JPG, or PNG" };
  }
  
  return { valid: true, message: "" };
};

const documentsSchema = z.object({
  idDocument: z.any()
    .refine((file) => file?.size > 0, "ID document is required")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
  proofOfResidence: z.any()
    .refine((file) => file?.size > 0, "Proof of residence is required")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
  grade11Results: z.any()
    .refine((file) => file?.size > 0, "Grade 11 results are required")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File size should be less than 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "File type should be PDF, JPG, or PNG"
    ),
  grade12Results: z.any()
    .refine((file) => file?.size > 0, "Grade 12 results are required")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
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

interface DocumentUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  uploaded: boolean;
  documentId?: string;
  filePath?: string;
  verificationTriggered?: boolean;
}

export const DocumentsUploadStep = ({ onComplete, onBack }: DocumentsUploadStepProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documents, setDocuments } = useProfileCompletionStore();
  const { verifyDocument, isVerifying, verificationResult } = useDocumentVerification();
  
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadSteps, setUploadSteps] = useState<Step[]>([
    { id: 1, label: 'Select', status: 'current' },
    { id: 2, label: 'Upload', status: 'pending' },
    { id: 3, label: 'Verify', status: 'pending' },
    { id: 4, label: 'Complete', status: 'pending' },
  ]);
  
  // Document upload states
  const [idDocumentState, setIdDocumentState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });
  
  const [proofOfResidenceState, setProofOfResidenceState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });
  
  const [grade11ResultsState, setGrade11ResultsState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });
  
  const [grade12ResultsState, setGrade12ResultsState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });
  
  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
  });

  // Update steps based on current document upload process
  useEffect(() => {
    if (!currentDocumentType) return;
    
    const documentState = getDocumentState(currentDocumentType);
    
    const newSteps: Step[] = [
      { 
        id: 1, 
        label: 'Select', 
        description: 'Choose file',
        status: documentState.file ? 'complete' : 'current'
      },
      { 
        id: 2, 
        label: 'Upload', 
        description: 'Upload to server',
        status: documentState.uploaded 
          ? 'complete' 
          : documentState.uploading 
            ? 'current' 
            : documentState.file 
              ? 'current' 
              : 'pending'
      },
      { 
        id: 3, 
        label: 'Verify', 
        description: 'AI verification',
        status: documentState.verificationTriggered
          ? isVerifying
            ? 'current'
            : verificationResult?.status === 'approved'
              ? 'complete'
              : verificationResult?.status === 'rejected' || verificationResult?.status === 'request_resubmission'
                ? 'error'
                : 'current'
          : documentState.uploaded
            ? 'current'
            : 'pending'
      },
      { 
        id: 4, 
        label: 'Complete', 
        description: 'Document ready',
        status: documentState.uploaded && verificationResult?.status === 'approved'
          ? 'complete'
          : 'pending'
      },
    ];
    
    setUploadSteps(newSteps);
    
    // Calculate current step
    let step = 1;
    if (documentState.file) step = 2;
    if (documentState.uploaded) step = 3;
    if (documentState.uploaded && verificationResult?.status === 'approved') step = 4;
    
    setCurrentStep(step);
    
  }, [currentDocumentType, idDocumentState, proofOfResidenceState, grade11ResultsState, grade12ResultsState, isVerifying, verificationResult]);
  
  // Get document state based on type
  const getDocumentState = (documentType: string): DocumentUploadState => {
    switch (documentType) {
      case "idDocument":
        return idDocumentState;
      case "proofOfResidence":
        return proofOfResidenceState;
      case "grade11Results":
        return grade11ResultsState;
      case "grade12Results":
        return grade12ResultsState;
      default:
        return {
          file: null,
          uploading: false,
          progress: 0,
          error: null,
          uploaded: false,
        };
    }
  };
  
  // Set document state based on type
  const setDocumentState = (
    documentType: string, 
    state: Partial<DocumentUploadState>
  ) => {
    switch (documentType) {
      case "idDocument":
        setIdDocumentState(prev => ({ ...prev, ...state }));
        break;
      case "proofOfResidence":
        setProofOfResidenceState(prev => ({ ...prev, ...state }));
        break;
      case "grade11Results":
        setGrade11ResultsState(prev => ({ ...prev, ...state }));
        break;
      case "grade12Results":
        setGrade12ResultsState(prev => ({ ...prev, ...state }));
        break;
    }
  };

  const handleFileChange = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: "idDocument" | "proofOfResidence" | "grade11Results" | "grade12Results"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set current document type for stepper
    setCurrentDocumentType(documentType);
    
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setDocumentState(documentType, { 
        file: null, 
        error: validation.message, 
        uploaded: false 
      });
      return;
    }
    
    // Check if file is an image and needs compression
    const compressionNeeded = file.type.startsWith('image/') && file.size > 500 * 1024; // Compress if > 500KB
    
    // Start upload
    setDocumentState(documentType, { 
      file,
      uploading: true, 
      progress: 0, 
      error: null, 
      uploaded: false 
    });
    
    try {
      // Process file (compress if needed)
      let fileToUpload = file;
      if (compressionNeeded) {
        setDocumentState(documentType, { progress: 10 });
        fileToUpload = await compressImage(file);
        setDocumentState(documentType, { progress: 30 });
      }
      
      // Simulate progress (real upload progress would be handled differently)
      setDocumentState(documentType, { progress: 50 });
      
      // Upload to Supabase
      if (user) {
        const filePath = `${user.id}/${documentType}-${new Date().getTime()}`;
        const { error: uploadError, data } = await supabase.storage
          .from('user_documents')
          .upload(filePath, fileToUpload);
          
        if (uploadError) throw new Error(uploadError.message);
        
        setDocumentState(documentType, { progress: 80 });
        
        // Store document reference in documents table
        const { error: documentError, data: documentData } = await supabase
          .from('documents')
          .insert({
            application_id: documents.applicationId || null,
            user_id: user.id,
            document_type: documentType,
            file_path: data.path,
          })
          .select('id')
          .single();
        
        if (documentError) throw new Error(documentError.message);
        
        // Update document state
        setDocumentState(documentType, { 
          uploading: false, 
          progress: 100, 
          uploaded: true,
          documentId: documentData.id,
          filePath: data.path,
          verificationTriggered: false
        });
        
        // Update form state
        form.setValue(documentType, fileToUpload);
        
        // Update store
        setDocuments({
          ...documents,
          [documentType]: {
            file: fileToUpload,
            path: data.path,
            documentId: documentData.id,
          }
        });
        
        // Auto-trigger verification
        triggerVerification(documentData.id, user.id, documentType, data.path);
      }
    } catch (error: any) {
      console.error(`Error uploading ${documentType}:`, error);
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: error.message || "Upload failed" 
      });
    }
  }, [user, documents, form, setDocuments]);

  const triggerVerification = useCallback(async (
    documentId: string,
    userId: string,
    documentType: string,
    filePath: string
  ) => {
    setDocumentState(documentType, { verificationTriggered: true });
    
    const result = await verifyDocument(documentId, userId, documentType, filePath);
    
    // Play notification sound for verification results
    if (result && (result.status === 'rejected' || result.status === 'request_resubmission')) {
      playNotificationSound();
      
      toast({
        title: result.status === 'rejected' ? 'Document Rejected' : 'Resubmission Required',
        description: result.failureReason || 'Please check your document and try again',
        variant: "destructive",
      });
    } else if (result && result.status === 'approved') {
      playNotificationSound();
      
      toast({
        title: 'Document Verified',
        description: 'Your document has been successfully verified',
      });
    }
  }, [verifyDocument]);
  
  const handleManualVerify = useCallback((
    documentType: "idDocument" | "proofOfResidence" | "grade11Results" | "grade12Results"
  ) => {
    const docState = getDocumentState(documentType);
    
    if (docState.documentId && user?.id && docState.filePath) {
      triggerVerification(docState.documentId, user.id, documentType, docState.filePath);
    }
  }, [getDocumentState, user, triggerVerification]);
  
  const handleRetry = useCallback((
    documentType: "idDocument" | "proofOfResidence" | "grade11Results" | "grade12Results",
    currentState: DocumentUploadState
  ) => {
    if (!currentState.file) return;
    
    // Reset state and try upload again with the same file
    setDocumentState(documentType, { 
      uploading: false, 
      progress: 0, 
      error: null, 
      uploaded: false 
    });
    
    // Create a fake event object with the existing file
    const fakeEvent = {
      target: {
        files: [currentState.file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleFileChange(fakeEvent, documentType);
  }, [handleFileChange]);

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
      
      // All documents are validated and uploaded, proceed to next step
      onComplete();
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

  const renderUploadInput = (
    documentType: "idDocument" | "proofOfResidence" | "grade11Results" | "grade12Results", 
    label: string,
    description: string,
    state: DocumentUploadState,
    accept: string = ".pdf,.jpg,.jpeg,.png"
  ) => {
    const { file, uploading, progress, error, uploaded } = state;
    
    const handleDocumentClick = () => {
      setCurrentDocumentType(documentType);
    };
    
    return (
      <div className="mb-6" onClick={handleDocumentClick}>
        <FormField
          control={form.control}
          name={documentType}
          render={() => (
            <FormItem>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <FormLabel className="text-base">{label}</FormLabel>
                  <FormDescription className="mt-1">{description}</FormDescription>
                </div>
                
                {currentDocumentType === documentType && (
                  <div className="mt-2 md:mt-0 md:ml-4">
                    <DocumentUploadStepper 
                      steps={uploadSteps}
                      currentStep={currentStep}
                    />
                  </div>
                )}
              </div>
              
              {!file && !uploaded && (
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor={`dropzone-file-${documentType}`}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, JPG or PNG (Max. 1MB)</p>
                      </div>
                      <input
                        id={`dropzone-file-${documentType}`}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={(e) => handleFileChange(e, documentType)}
                      />
                    </label>
                  </div>
                </FormControl>
              )}
              
              {(file || uploaded) && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex items-center flex-wrap md:flex-nowrap">
                    <div className="mr-4 mb-4 md:mb-0">
                      <DocumentPreview 
                        filePath={state.filePath || ''}
                        fileName={file?.name || label}
                        fileType={file?.type}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">
                        {file?.name || label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file && (file.size / 1024).toFixed(1)} KB
                      </p>
                      
                      {uploading && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            Uploading... {progress}%
                          </p>
                        </div>
                      )}
                      
                      {error && (
                        <div className="mt-2">
                          <Alert variant="destructive" className="p-2">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              <AlertDescription className="text-xs">{error}</AlertDescription>
                            </div>
                          </Alert>
                          
                          <div className="flex justify-between mt-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleRetry(documentType, state)}
                              className="text-xs"
                            >
                              Retry
                            </Button>
                            
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Reset input
                                const input = document.getElementById(`dropzone-file-${documentType}`) as HTMLInputElement;
                                if (input) input.value = '';
                                
                                // Reset state
                                setDocumentState(documentType, {
                                  file: null,
                                  uploading: false,
                                  progress: 0,
                                  error: null,
                                  uploaded: false,
                                });
                                
                                // Clear form value
                                form.setValue(documentType, undefined);
                              }}
                              className="text-xs"
                            >
                              Change File
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-2 mt-2 md:mt-0">
                      {uploaded && !state.verificationTriggered && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleManualVerify(documentType)}
                        >
                          Verify Now
                        </Button>
                      )}
                      
                      {uploaded && (
                        <div className="mt-2 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">Uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentDocumentType === documentType && state.verificationTriggered && (
                    <div className="mt-4">
                      <VerificationResultDisplay 
                        result={verificationResult}
                        isVerifying={isVerifying}
                        documentType={label}
                        onResubmit={() => {
                          // Reset input
                          const input = document.getElementById(`dropzone-file-${documentType}`) as HTMLInputElement;
                          if (input) input.value = '';
                          
                          // Reset state
                          setDocumentState(documentType, {
                            file: null,
                            uploading: false,
                            progress: 0,
                            error: null,
                            uploaded: false,
                            verificationTriggered: false
                          });
                          
                          // Clear form value
                          form.setValue(documentType, undefined);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
      <p className="text-gray-600 mb-6">
        Please upload the following documents. All files must be in PDF, JPG, or PNG format and less than 1MB in size.
        Each document will be automatically verified using AI technology.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              {renderUploadInput(
                "idDocument",
                "ID Document Copy",
                "Upload a clear copy of your South African ID or passport",
                idDocumentState
              )}
              
              {renderUploadInput(
                "proofOfResidence",
                "Proof of Residence",
                "A utility bill, bank statement or affidavit confirming your address (less than 3 months old)",
                proofOfResidenceState
              )}
              
              {renderUploadInput(
                "grade11Results",
                "Grade 11 Results",
                "Upload your Grade 11 final report or certificate",
                grade11ResultsState
              )}
              
              {renderUploadInput(
                "grade12Results",
                "Grade 12 Results",
                "Upload your Grade 12 certificate or results statement",
                grade12ResultsState
              )}
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
                grade12ResultsState.uploading}
              className="bg-cap-teal hover:bg-cap-teal/90"
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

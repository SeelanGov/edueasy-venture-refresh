
import { XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { VerificationResult } from "@/hooks/useDocumentVerification";
import { ValidationResultsList } from "./ValidationResultsList";
import { DocumentGuidance } from "./DocumentGuidance";

interface RejectedDocumentProps {
  result: VerificationResult;
  documentType: string;
  onResubmit?: () => void;
}

export const RejectedDocument = ({ result, documentType, onResubmit }: RejectedDocumentProps) => {
  const { failureReason, validationResults, extractedFields } = result;
  
  return (
    <Alert variant="destructive" className="mt-4">
      <XCircle className="h-5 w-5" />
      <AlertTitle>Document Verification Failed</AlertTitle>
      <AlertDescription>
        <p>Your {documentType} could not be verified.</p>
        {failureReason && (
          <p className="text-sm mt-1 font-medium">Reason: {failureReason}</p>
        )}
        
        <DocumentGuidance failureReason={failureReason} />
        
        <ValidationResultsList validationResults={validationResults} extractedFields={extractedFields} />
        
        {onResubmit && (
          <Button 
            onClick={onResubmit} 
            size="sm" 
            variant="outline" 
            className="mt-3 border-red-200 bg-red-50 hover:bg-red-100 text-red-900"
          >
            Upload New Document
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

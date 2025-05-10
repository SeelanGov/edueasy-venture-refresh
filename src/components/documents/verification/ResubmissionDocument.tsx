
import { FileWarning } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { VerificationResult } from "@/hooks/useDocumentVerification";
import { DocumentGuidance } from "./DocumentGuidance";

interface ResubmissionDocumentProps {
  result: VerificationResult;
  documentType: string;
  onResubmit?: () => void;
}

export const ResubmissionDocument = ({ result, documentType, onResubmit }: ResubmissionDocumentProps) => {
  const { failureReason } = result;
  
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300 mt-4">
      <FileWarning className="h-5 w-5 text-amber-500" />
      <AlertTitle>Document Resubmission Required</AlertTitle>
      <AlertDescription>
        <p>Your {documentType} requires resubmission.</p>
        {failureReason && (
          <p className="text-sm mt-1 font-medium">Reason: {failureReason}</p>
        )}
        
        <DocumentGuidance failureReason={failureReason} />
        
        {onResubmit && (
          <Button 
            onClick={onResubmit} 
            size="sm" 
            variant="outline" 
            className="mt-3 border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900"
          >
            Upload New Document
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

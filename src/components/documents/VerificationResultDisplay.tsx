
import { CheckCircle, XCircle, AlertCircle, Loader2, FileWarning, Clock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { VerificationResult } from "@/hooks/useDocumentVerification";
import { Button } from "@/components/ui/button";

interface VerificationResultDisplayProps {
  result: VerificationResult | null;
  isVerifying: boolean;
  documentType: string;
  onResubmit?: () => void;
}

export const VerificationResultDisplay = ({
  result,
  isVerifying,
  documentType,
  onResubmit
}: VerificationResultDisplayProps) => {
  if (isVerifying) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-4 mt-4">
        <div className="flex items-center mb-2">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
          <span className="font-medium text-sm">Verifying document...</span>
        </div>
        <Progress value={50} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">
          We're checking your {documentType} for accuracy and completeness.
        </p>
      </div>
    );
  }
  
  if (!result) return null;
  
  const { status, confidence, validationResults, failureReason, processingTimeMs } = result;
  
  // Format document type for display
  const formatDocumentType = (type: string) => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };
  
  const displayDocumentType = formatDocumentType(documentType);
  
  // Helper function to get guidance based on failure reason
  const getGuidanceForFailure = (reason: string | null | undefined): string => {
    if (!reason) return "Make sure your document is clear and all information is visible.";
    
    if (reason.includes("ID number")) {
      return "Make sure your ID number is clearly visible and not obscured.";
    }
    
    if (reason.includes("outdated")) {
      return "Please upload a more recent document (less than 3 months old).";
    }
    
    if (reason.includes("address")) {
      return "Ensure your address is clearly visible on the document.";
    }
    
    if (reason.includes("clear")) {
      return "Try uploading a clearer image with better lighting and focus.";
    }
    
    return "Make sure all required information is visible and the document is properly oriented.";
  };
  
  if (status === 'approved') {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 mt-4">
        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
        <AlertTitle className="flex items-center">
          Document Verified Successfully
          {confidence !== undefined && (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
              {Math.round(confidence * 100)}% Confidence
            </Badge>
          )}
        </AlertTitle>
        <AlertDescription>
          <p className="mt-1">Your {displayDocumentType} has been verified and approved.</p>
          
          {processingTimeMs && (
            <div className="mt-1 flex items-center text-xs text-green-700 dark:text-green-400">
              <Clock className="h-3 w-3 mr-1" />
              Processed in {(processingTimeMs / 1000).toFixed(1)} seconds
            </div>
          )}
          
          {validationResults && Object.keys(validationResults).length > 0 && (
            <div className="mt-2">
              <Separator className="my-2" />
              <div className="text-xs space-y-1">
                {Object.entries(validationResults).map(([key, value]) => (
                  key !== 'documentType' && (
                    <div key={key} className="flex items-center">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <CheckCircle className="h-3 w-3 text-green-500 dark:text-green-400 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 dark:text-red-400 mr-1" />
                        )
                      ) : null}
                      <span>
                        {key.replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}:
                        {typeof value === 'boolean' 
                          ? '' 
                          : ` ${value}`}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'rejected') {
    return (
      <Alert variant="destructive" className="mt-4">
        <XCircle className="h-5 w-5" />
        <AlertTitle>Document Verification Failed</AlertTitle>
        <AlertDescription>
          <p>Your {displayDocumentType} could not be verified.</p>
          {failureReason && (
            <p className="text-sm mt-1 font-medium">Reason: {failureReason}</p>
          )}
          
          <div className="bg-red-50 text-red-800 p-2 rounded mt-2 text-sm">
            <p className="font-medium">Guidance:</p>
            <p className="text-xs mt-1">{getGuidanceForFailure(failureReason)}</p>
          </div>
          
          {validationResults && Object.keys(validationResults).length > 0 && (
            <div className="mt-2">
              <Separator className="my-2" />
              <div className="text-xs space-y-1">
                {Object.entries(validationResults).map(([key, value]) => (
                  key !== 'documentType' && key !== 'error' && (
                    <div key={key} className="flex items-center">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )
                      ) : null}
                      <span>
                        {key.replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}:
                        {typeof value === 'boolean' 
                          ? '' 
                          : ` ${value}`}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
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
  }
  
  if (status === 'request_resubmission') {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300 mt-4">
        <FileWarning className="h-5 w-5 text-amber-500" />
        <AlertTitle>Document Resubmission Required</AlertTitle>
        <AlertDescription>
          <p>Your {displayDocumentType} requires resubmission.</p>
          {failureReason && (
            <p className="text-sm mt-1 font-medium">Reason: {failureReason}</p>
          )}
          
          <div className="bg-amber-100 text-amber-800 p-2 rounded mt-2 text-sm">
            <p className="font-medium">Guidance:</p>
            <p className="text-xs mt-1">{getGuidanceForFailure(failureReason)}</p>
          </div>
          
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
  }
  
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300 mt-4">
      <AlertCircle className="h-5 w-5 text-blue-500" />
      <AlertTitle>Document Verification In Progress</AlertTitle>
      <AlertDescription>
        Your {displayDocumentType} is currently being processed.
      </AlertDescription>
    </Alert>
  );
};

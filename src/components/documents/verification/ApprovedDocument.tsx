
import { CheckCircle, Clock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { VerificationResult } from "@/hooks/useDocumentVerification";

interface ApprovedDocumentProps {
  result: VerificationResult;
  documentType: string;
}

export const ApprovedDocument = ({ result, documentType }: ApprovedDocumentProps) => {
  const { confidence, processingTimeMs, validationResults } = result;
  
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
        <p className="mt-1">Your {documentType} has been verified and approved.</p>
        
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
                        <div className="h-3 w-3 bg-red-500 rounded-full mr-1" />
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
};

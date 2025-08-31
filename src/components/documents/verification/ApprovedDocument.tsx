import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { type VerificationResult  } from '@/hooks/useDocumentVerification';
import { ValidationResultsList } from './ValidationResultsList';





interface ApprovedDocumentProps {
  result: VerificationResult;
  documentType: string;
}

/**
 * ApprovedDocument
 * @description Function
 */
export const ApprovedDocument = ({ result, documentType }: ApprovedDocumentProps): JSX.Element => {
  const { validationResults, confidence, extractedFields } = result;

  const confidencePercent = confidence ? Math.round(confidence * 100) : undefined;

  return (
    <Alert className="border-success/20 bg-success/10 text-success dark:border-success/20 dark:bg-success/10 dark:text-success mt-4">
      <CheckCircle className="h-5 w-5 text-success" />
      <AlertTitle>Document Verified Successfully</AlertTitle>
      <AlertDescription>
        <p>Your {documentType} has been verified successfully.</p>

        {confidencePercent && (
          <p className="text-sm mt-1">Verification confidence: {confidencePercent}%</p>
        )}

        <ValidationResultsList
          validationResults={validationResults || {}}
          extractedFields={extractedFields || {}}
        />
      </AlertDescription>
    </Alert>
  );
};

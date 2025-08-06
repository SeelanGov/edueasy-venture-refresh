import { CheckCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { VerificationResult } from '@/hooks/useDocumentVerification';
import { ValidationResultsList } from './ValidationResultsList';

interface ApprovedDocumentProps {
  result: VerificationResult;
  documentType: string;
}

/**
 * ApprovedDocument
 * @description Function
 */
export const ApprovedDocument = ({ result, documentType }: ApprovedDocumentProps) => {
  const { validationResults, confidence, extractedFields } = result;

  const confidencePercent = confidence ? Math.round(confidence * 100) : undefined;

  return (
    <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300 mt-4">
      <CheckCircle className="h-5 w-5 text-green-500" />
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

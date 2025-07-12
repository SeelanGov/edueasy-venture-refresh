import { FileWarning } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { VerificationResult } from '@/hooks/useDocumentVerification';
import { DocumentGuidance } from './DocumentGuidance';
import { ValidationResultsList } from './ValidationResultsList';

interface ResubmissionDocumentProps {
  result: VerificationResult;
  documentType: string;
  onResubmit: () => void;
}

export const ResubmissionDocument = ({
  result,
  documentType,
  onResubmit,
}: ResubmissionDocumentProps) => {
  const { failureReason, validationResults, extractedFields } = result;

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300 mt-4">
      <FileWarning className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-base">Document Resubmission Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Your {documentType} requires resubmission.</p>
        {failureReason && <p className="text-sm font-medium">Reason: {failureReason}</p>}

        <DocumentGuidance failureReason={failureReason} documentType={documentType} />

        <ValidationResultsList
          validationResults={validationResults || {}}
          extractedFields={extractedFields || {}}
        />

        <div className="mt-4">
          <Button
            onClick={onResubmit}
            size="sm"
            variant="outline"
            className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium"
          >
            Resubmit Document
          </Button>
          <p className="text-xs mt-2 text-amber-700">
            Please follow the guidance above to ensure successful verification.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

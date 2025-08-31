import { AlertDescription, Alert, AlertTitle } from '@/components/ui/alert';
import { FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type VerificationResult  } from '@/hooks/useDocumentVerification';
import { DocumentGuidance } from './DocumentGuidance';
import { ValidationResultsList } from './ValidationResultsList';







interface ResubmissionDocumentProps {
  result: VerificationResult;
  documentType: string;
  onResubmit: () => void;
}

/**
 * ResubmissionDocument
 * @description Function
 */
export const ResubmissionDocument = ({
  result,
  documentType,
  onResubmit,
}: ResubmissionDocumentProps): JSX.Element => {
  const { failureReason, validationResults, extractedFields } = result;

  return (
    <Alert className="border-warning/20 bg-warning/10 text-warning dark:border-warning/20 dark:bg-warning/10 dark:text-warning mt-4">
      <FileWarning className="h-5 w-5 text-warning" />
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
            className="border-warning/20 bg-warning/10 hover:bg-warning/20 text-warning font-medium">
            Resubmit Document
          </Button>
          <p className="text-xs mt-2 text-warning">
            Please follow the guidance above to ensure successful verification.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};


import { XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { VerificationResult } from '@/hooks/useDocumentVerification';
import { ValidationResultsList } from './ValidationResultsList';
import { DocumentGuidance } from './DocumentGuidance';

interface RejectedDocumentProps {
  result: VerificationResult;
  documentType: string;
  onResubmit: () => void;
}

export const RejectedDocument = ({ result, documentType, onResubmit }: RejectedDocumentProps) => {
  const { failureReason, validationResults, extractedFields } = result;

  return (
    <Alert variant="destructive" className="mt-4">
      <XCircle className="h-5 w-5" />
      <AlertTitle className="text-base">Document Verification Failed</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Your {documentType} could not be verified.</p>
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
            className="border-red-200 bg-red-50 hover:bg-red-100 text-red-900 font-medium"
          >
            Resubmit Document
          </Button>
          <p className="text-xs mt-2 text-red-600">
            Please address the issues above before resubmitting your {documentType}.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

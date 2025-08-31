import { AlertDescription, Alert } from '@/components/ui/alert';
import { Loader } from 'lucide-react';

interface VerifyingDocumentProps {
  documentType: string;
  isResubmission?: boolean;
}

/**
 * VerifyingDocument
 * @description Function
 */
export const VerifyingDocument = ({
  documentType,
  isResubmission = false,
}: VerifyingDocumentProps): JSX.Element => {
  return (
    <Alert className="bg-info/10 border-info/20 text-info mt-4">
      <div className="flex items-center">
        <Loader className="h-5 w-5 mr-2 animate-spin text-info" />
        <AlertDescription>
          <p className="font-medium">
            {isResubmission
              ? `Verifying your resubmitted ${documentType.toLowerCase()}...`
              : `Verifying your ${documentType.toLowerCase()}...`}
          </p>
          <p className="text-sm mt-1">
            {isResubmission
              ? "We're carefully reviewing your resubmitted document. This may take a moment."
              : 'This may take a moment. Please wait while our system verifies your document.'}
          </p>
        </AlertDescription>
      </div>
    </Alert>
  );
};

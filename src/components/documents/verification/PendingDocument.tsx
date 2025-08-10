import { AlertDescription, Alert } from '@/components/ui/alert';
import { Clock } from 'lucide-react';

interface PendingDocumentProps {
  documentType: string;
  isResubmission?: boolean;
}

/**
 * PendingDocument
 * @description Function
 */
export const PendingDocument = ({
  documentType,
  isResubmission = false,
}: PendingDocumentProps): JSX.Element => {
  return (
    <Alert className="bg-blue-50 border-blue-200 text-blue-800 mt-4">
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-500" />
        <AlertDescription>
          <p className="font-medium">
            {isResubmission
              ? `Your resubmitted ${documentType.toLowerCase()} is pending verification`
              : `Your ${documentType.toLowerCase()} is pending verification`}
          </p>
          <p className="text-sm mt-1">
            {isResubmission
              ? "We'll notify you when your resubmitted document has been processed."
              : "We'll notify you when your document has been processed."}
          </p>
        </AlertDescription>
      </div>
    </Alert>
  );
};

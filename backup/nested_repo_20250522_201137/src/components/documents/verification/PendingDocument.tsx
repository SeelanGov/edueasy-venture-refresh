
import { Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PendingDocumentProps {
  documentType: string;
  isResubmission?: boolean;
}

export const PendingDocument = ({ documentType, isResubmission = false }: PendingDocumentProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200 text-blue-800 mt-4">
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-500" />
        <AlertDescription>
          <p className="font-medium">
            {isResubmission 
              ? `Your resubmitted ${documentType.toLowerCase()} is pending verification` 
              : `Your ${documentType.toLowerCase()} is pending verification`
            }
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

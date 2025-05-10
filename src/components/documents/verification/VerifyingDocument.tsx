
import { Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VerifyingDocumentProps {
  documentType: string;
  isResubmission?: boolean;
}

export const VerifyingDocument = ({ documentType, isResubmission = false }: VerifyingDocumentProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200 text-blue-800 mt-4">
      <div className="flex items-center">
        <Loader className="h-5 w-5 mr-2 animate-spin text-blue-500" />
        <AlertDescription>
          <p className="font-medium">
            {isResubmission 
              ? `Verifying your resubmitted ${documentType.toLowerCase()}...` 
              : `Verifying your ${documentType.toLowerCase()}...`
            }
          </p>
          <p className="text-sm mt-1">
            {isResubmission
              ? "We're carefully reviewing your resubmitted document. This may take a moment."
              : "This may take a moment. Please wait while our system verifies your document."}
          </p>
        </AlertDescription>
      </div>
    </Alert>
  );
};

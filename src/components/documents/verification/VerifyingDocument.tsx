
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VerifyingDocumentProps {
  documentType: string;
}

export const VerifyingDocument = ({ documentType }: VerifyingDocumentProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-4 mt-4">
      <div className="flex items-center mb-2">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
        <span className="font-medium text-sm">Verifying document...</span>
      </div>
      <Progress value={50} className="h-2" />
      <p className="text-xs text-gray-500 mt-2">
        We're checking your {documentType} for accuracy and completeness.
      </p>
    </div>
  );
};

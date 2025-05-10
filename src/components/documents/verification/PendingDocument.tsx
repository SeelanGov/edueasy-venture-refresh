
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PendingDocumentProps {
  documentType: string;
}

export const PendingDocument = ({ documentType }: PendingDocumentProps) => {
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300 mt-4">
      <AlertCircle className="h-5 w-5 text-blue-500" />
      <AlertTitle>Document Verification In Progress</AlertTitle>
      <AlertDescription>
        Your {documentType} is currently being processed.
      </AlertDescription>
    </Alert>
  );
};

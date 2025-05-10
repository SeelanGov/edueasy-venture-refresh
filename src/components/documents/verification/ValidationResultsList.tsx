
import { CheckCircle, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ValidationResultsListProps {
  validationResults: Record<string, any> | undefined;
}

export const ValidationResultsList = ({ validationResults }: ValidationResultsListProps) => {
  if (!validationResults || Object.keys(validationResults).length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <Separator className="my-2" />
      <div className="text-xs space-y-1">
        {Object.entries(validationResults).map(([key, value]) => (
          key !== 'documentType' && key !== 'error' && (
            <div key={key} className="flex items-center">
              {typeof value === 'boolean' ? (
                value ? (
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500 mr-1" />
                )
              ) : null}
              <span>
                {key.replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim()}:
                {typeof value === 'boolean' 
                  ? '' 
                  : ` ${value}`}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

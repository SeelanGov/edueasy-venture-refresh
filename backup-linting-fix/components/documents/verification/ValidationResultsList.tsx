import { Separator } from '@/components/ui/separator';
import { CheckCircle, ClipboardList, XCircle } from 'lucide-react';

interface ValidationResultsListProps {
  validationResults: Record<string, unknown> | undefined;
  extractedFields?: Record<string, string> | undefined;
}

/**
 * ValidationResultsList
 * @description Function
 */
export const ValidationResultsList = ({
  validationResults,
  extractedFields,
}: ValidationResultsListProps) => {
  if (!validationResults && !extractedFields) {
    return null;
  }

  return (
    <div className="mt-2">
      <Separator className="my-2" />

      {validationResults && Object.keys(validationResults).length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-1">Validation Results:</h4>
          <div className="text-xs space-y-1">
            {Object.entries(validationResults).map(
              ([key, value]) =>
                key !== 'documentType' &&
                key !== 'error' &&
                key !== 'failureReason' &&
                key !== 'isValid' && (
                  <div key={key} className="flex items-center">
                    {typeof value === 'boolean' ? (
                      value ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )
                    ) : null}
                    <span>
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
                      :
                      {typeof value === 'boolean'
                        ? ''
                        : ` ${typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}`}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>
      )}

      {extractedFields && Object.keys(extractedFields).length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-medium mb-1 flex items-center">
            <ClipboardList className="h-3 w-3 mr-1" />
            Extracted Information:
          </h4>
          <div className="text-xs space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
            {Object.entries(extractedFields).map(([key, value]) => {
              if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                try {
                  const parsed = JSON.parse(value);
                  if (key === 'subjects' && Array.isArray(parsed)) {
                    return (
                      <div key={key} className="mt-1">
                        <div className="font-medium">Subjects:</div>
                        <div className="pl-2">
                          {parsed.map((subject: unknown, index: number) => {
                            if (
                              typeof subject === 'object' &&
                              subject !== null &&
                              'name' in subject &&
                              'mark' in subject
                            ) {
                              return (
                                <div key={index}>
                                  {subject.name}: {subject.mark}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  }
                } catch (_e) {
                  // If parsing fails, display as regular string
                }
              }

              return (
                <div key={key} className="flex flex-col">
                  <span className="font-medium">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim()}
                    :
                  </span>
                  <span className="text-gray-700 ml-2 break-words">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

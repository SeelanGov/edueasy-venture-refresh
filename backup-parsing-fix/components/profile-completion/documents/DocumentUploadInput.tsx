import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentUploadStepper } from '@/components/documents/DocumentUploadStepper';
import { VerificationResultDisplay } from '@/components/documents/VerificationResultDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, RefreshCw, Upload } from 'lucide-react';
import type { DocumentUploadInputProps } from './types';

/**
 * DocumentUploadInput
 * @description Function
 */
export const DocumentUploadInput = ({
  documentType,
  label,
  description,
  state,
  accept = '.pdf,.jpg,.jpeg,.png',
  onFileChange,
  onRetry,
  onVerify,
  onResubmit,
  verificationResult,
  isVerifying,
  setCurrentDocumentType,
  currentDocumentType,
  uploadSteps,
}: DocumentUploadInputProps) => {
  const { file, uploading, progress, error, uploaded, isResubmission } = state;

  const handleDocumentClick = () => {
    setCurrentDocumentType(documentType);
  };

  return (
    <div className="mb-6" onClick={handleDocumentClick}>
      <FormField
        name={documentType}
        render={() => (
          <FormItem>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center">
                  <FormLabel className="text-base flex items-center gap-2">
                    {label}
                    <SecurityBadge type="data-protection" size="sm" showLabel={false} />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          tabIndex={0}
                          aria-label="Data protection info"
                          className="ml-1 cursor-pointer"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="#60A5FA" strokeWidth="2" />
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#60A5FA">
                              i
                            </text>
                          </svg>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        All uploaded documents are protected and stored securely.
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  {isResubmission && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      Resubmission
                    </span>
                  )}
                </div>
                <FormDescription className="mt-1">{description}</FormDescription>
              </div>

              {currentDocumentType === documentType && (
                <div className="mt-2 md:mt-0 md:ml-4">
                  <DocumentUploadStepper steps={uploadSteps} />
                </div>
              )}
            </div>

            {!file && !uploaded && (
              <FormControl>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor={`dropzone-file-${documentType}`}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                    ${
                      isResubmission
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isResubmission ? (
                        <RefreshCw className="w-8 h-8 mb-3 text-amber-500" />
                      ) : (
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      )}

                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          {isResubmission ? 'Click to resubmit' : 'Click to upload'}
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG or PNG (Max. 1MB)</p>
                      {isResubmission && (
                        <p className="text-xs text-amber-600 mt-1">
                          Please address previous issues before resubmitting
                        </p>
                      )}
                    </div>
                    <input
                      id={`dropzone-file-${documentType}`}
                      type="file"
                      className="hidden"
                      accept={accept}
                      onChange={(e) => onFileChange(e, documentType)}
                    />
                  </label>
                </div>
              </FormControl>
            )}

            {(file || uploaded) && (
              <div
                className={`border rounded-lg p-4 ${isResubmission ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center flex-wrap md:flex-nowrap">
                  <div className="mr-4 mb-4 md:mb-0">
                    <DocumentPreview
                      filePath={state.filePath || ''}
                      fileName={file?.name || label}
                      fileType={file?.type || undefined}
                      size="sm"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium truncate">{file?.name || label}</p>
                      {isResubmission && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-full">
                          Resubmitted
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      {file && (file.size / 1024).toFixed(1)} KB
                    </p>

                    {uploading && (
                      <div className="mt-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {isResubmission ? 'Resubmitting' : 'Uploading'}... {progress}%
                        </p>
                      </div>
                    )}

                    {error && (
                      <div className="mt-2">
                        <Alert variant="destructive" className="p-2">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <AlertDescription className="text-xs">{error}</AlertDescription>
                          </div>
                        </Alert>

                        <div className="flex justify-between mt-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => onRetry(documentType, state)}
                            className="text-xs"
                          >
                            Retry
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              // Reset input
                              const input = document.getElementById(
                                `dropzone-file-${documentType}`,
                              ) as HTMLInputElement;
                              if (input) input.value = '';

                              // Trigger onResubmit to reset state
                              onResubmit();
                            }}
                            className="text-xs"
                          >
                            Change File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-2 mt-2 md:mt-0">
                    {uploaded && !state.verificationTriggered && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-primary border-primary/20 hover:bg-primary/10"
                        onClick={() => onVerify(documentType)}
                      >
                        Verify Now
                      </Button>
                    )}

                    {uploaded && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="text-green-500 h-5 w-5" />
                        <span className="text-green-700 text-xs font-medium">
                          Uploaded successfully
                        </span>
                        <SecurityBadge type="verification" size="sm" showLabel={false} />
                      </div>
                    )}
                  </div>
                </div>

                {currentDocumentType === documentType && state.verificationTriggered && (
                  <div className="mt-4">
                    <VerificationResultDisplay
                      result={verificationResult}
                      isVerifying={isVerifying}
                      documentType={label}
                      onResubmit={onResubmit}
                      isResubmission={isResubmission || false}
                    />
                  </div>
                )}
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

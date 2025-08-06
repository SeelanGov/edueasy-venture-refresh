import type { VerificationResult } from '@/hooks/useDocumentVerification';
import { VerifyingDocument } from './verification/VerifyingDocument';
import { ApprovedDocument } from './verification/ApprovedDocument';
import { RejectedDocument } from './verification/RejectedDocument';
import { ResubmissionDocument } from './verification/ResubmissionDocument';
import { PendingDocument } from './verification/PendingDocument';
import { formatDocumentType } from './verification/DocumentTypeFormatter';

interface VerificationResultDisplayProps {
  result: VerificationResult | null;
  isVerifying: boolean;
  documentType: string;
  onResubmit?: () => void;
  isResubmission?: boolean;
}

/**
 * VerificationResultDisplay
 * @description Function
 */
export const VerificationResultDisplay = ({
  result,
  isVerifying,
  documentType,
  onResubmit,
  isResubmission = false,
}: VerificationResultDisplayProps) => {
  if (isVerifying) {
    return (
      <VerifyingDocument
        documentType={formatDocumentType(documentType)}
        isResubmission={isResubmission}
      />
    );
  }

  if (!result) return null;

  const { status } = result;

  // Format document type for display
  const displayDocumentType = formatDocumentType(documentType);

  if (status === 'approved') {
    return <ApprovedDocument result={result} documentType={displayDocumentType} />;
  }

  if (status === 'rejected' && onResubmit) {
    return (
      <RejectedDocument
        result={result}
        documentType={displayDocumentType}
        onResubmit={onResubmit}
      />
    );
  }

  if (status === 'request_resubmission' && onResubmit) {
    return (
      <ResubmissionDocument
        result={result}
        documentType={displayDocumentType}
        onResubmit={onResubmit}
      />
    );
  }

  return <PendingDocument documentType={displayDocumentType} isResubmission={isResubmission} />;
};

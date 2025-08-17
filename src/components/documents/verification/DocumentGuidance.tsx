import { AlertCircle } from 'lucide-react';

interface DocumentGuidanceProps {
  failureReason: string | null | undefined;
  documentType?: string;
}

/**
 * DocumentGuidance
 * @description Function
 */
export const DocumentGuidance = ({
  failureReason,
  documentType = 'document',
}: DocumentGuidanceProps): JSX.Element => {
  // Helper function to get guidance based on failure reason
  const getGuidanceForFailure = (reason: string | null | undefined): string => {
    if (!reason) return `Make sure your ${documentType} is clear and all information is visible.`;

    if (reason.includes('ID number')) {
      return `Make sure your ID number is clearly visible and not obscured. Position the ${documentType} on a flat surface with good lighting.`;
    }

    if (reason.includes('outdated')) {
      return `Please upload a more recent ${documentType} (less than 3 months old). The system requires up-to-date documentation.`;
    }

    if (reason.includes('address')) {
      return `Ensure your address is clearly visible on the ${documentType}. All address lines must be legible and complete.`;
    }

    if (reason.includes('clear') || reason.includes('blurry') || reason.includes('quality')) {
      return `Try uploading a clearer image with better lighting and focus. Avoid glare and shadows on the ${documentType}.`;
    }

    if (reason.includes('incomplete') || reason.includes('missing')) {
      return `Your ${documentType} appears to be incomplete. Please ensure all required information is included and clearly visible.`;
    }

    if (reason.includes('format') || reason.includes('file type')) {
      return `Please upload the ${documentType} in the correct format (PDF, JPG, or PNG) with all pages included.`;
    }

    return `Make sure all required information is visible on your ${documentType} and the document is properly oriented. Try taking a new photo in good lighting.`;
  };

  // Get specific document tips based on document type
  const getDocumentSpecificTips = (): string => {
    if (documentType.toLowerCase().includes('id')) {
      return 'For ID documents: Ensure both sides are clearly visible if needed, and all text is legible.';
    }

    if (
      documentType.toLowerCase().includes('proof of residence') ||
      documentType.toLowerCase().includes('address')
    ) {
      return 'For proof of residence: Ensure the document shows your full name, address, and is dated within the last 3 months.';
    }

    if (
      documentType.toLowerCase().includes('grade') ||
      documentType.toLowerCase().includes('result')
    ) {
      return "For academic results: Make sure all subjects, grades, and the school's official stamp or signature are visible.";
    }

    return '';
  };

  const specificTip = getDocumentSpecificTips();

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded mt-2 text-sm">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Resubmission Guidance:</p>
          <p className="mt-1">{getGuidanceForFailure(failureReason)}</p>
          {specificTip && <p className="mt-2 text-xs">{specificTip}</p>}
          <p className="mt-2 text-xs font-medium">Try these tips for better results:</p>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li>Use a flat, well-lit surface</li>
            <li>Avoid shadows and glare</li>
            <li>Ensure the entire document is in the frame</li>
            <li>Use a direct scan when possible instead of a photo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

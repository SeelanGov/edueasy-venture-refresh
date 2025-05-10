
interface DocumentGuidanceProps {
  failureReason: string | null | undefined;
}

export const DocumentGuidance = ({ failureReason }: DocumentGuidanceProps) => {
  // Helper function to get guidance based on failure reason
  const getGuidanceForFailure = (reason: string | null | undefined): string => {
    if (!reason) return "Make sure your document is clear and all information is visible.";
    
    if (reason.includes("ID number")) {
      return "Make sure your ID number is clearly visible and not obscured.";
    }
    
    if (reason.includes("outdated")) {
      return "Please upload a more recent document (less than 3 months old).";
    }
    
    if (reason.includes("address")) {
      return "Ensure your address is clearly visible on the document.";
    }
    
    if (reason.includes("clear")) {
      return "Try uploading a clearer image with better lighting and focus.";
    }
    
    return "Make sure all required information is visible and the document is properly oriented.";
  };

  return (
    <div className="bg-red-50 text-red-800 p-2 rounded mt-2 text-sm">
      <p className="font-medium">Guidance:</p>
      <p className="text-xs mt-1">{getGuidanceForFailure(failureReason)}</p>
    </div>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";

interface DocumentFormActionsProps {
  onBack: () => void;
  isComplete: boolean;
}

export const DocumentFormActions: React.FC<DocumentFormActionsProps> = ({
  onBack,
  isComplete
}) => {
  return (
    <div className="flex justify-between pt-6">
      <Button type="button" variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button type="submit" disabled={!isComplete}>
        Next
      </Button>
    </div>
  );
};

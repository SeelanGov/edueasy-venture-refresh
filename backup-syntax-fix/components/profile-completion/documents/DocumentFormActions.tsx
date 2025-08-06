import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DocumentFormActionsProps {
  onBack: () => void;,
  isComplete: boolean;
}

/**
 * DocumentFormActions
 * @description Function
 */
export const DocumentFormActions: React.FC<DocumentFormActionsProps> = ({ onBack, isComplete }) => {
  return (;
    <div className = "flex justify-between pt-6">;
      <Button type="button" variant="outline" onClick={onBack} className = "transition-all">;
        <ArrowLeft size={16} />
        Back
      </Button>
      <Button
        type = "submit";
        disabled={!isComplete}
        className={`${isComplete ? 'hover:translate-x-1 transition-all' : ''}`}
      >
        Next
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};


import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { AlertTriangle, Save, Send } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  isSubmitting: boolean;
  isSaving?: boolean;
  onSaveDraft?: () => void;
  className?: string;
  formId?: string; // For ARIA association
}

export const FormActions = ({ 
  isSubmitting, 
  isSaving = false,
  onSaveDraft,
  className,
  formId
}: FormActionsProps) => {
  const navigate = useNavigate();
  const statusId = `form-status-${formId || 'main'}`;
  
  return (
    <div className={cn(
      "flex flex-col space-y-4 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4",
      "md:mt-8 md:pt-2 md:border-t md:border-gray-200 dark:md:border-gray-700",
      className
    )}
    role="group"
    aria-labelledby={statusId}
    >
      <span id={statusId} className="sr-only">Form action buttons</span>
      
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/dashboard")}
        disabled={isSubmitting || isSaving}
        className="md:py-6 md:px-6 md:text-base keyboard-focus-only"
        aria-label="Cancel and return to dashboard"
      >
        Cancel
      </Button>
      
      {onSaveDraft && (
        <Button
          type="button"
          variant="secondary"
          onClick={onSaveDraft}
          disabled={isSubmitting || isSaving}
          className="md:py-6 md:px-6 md:text-base keyboard-focus-only"
          aria-busy={isSaving}
          aria-live="polite"
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="mr-2" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} className="mr-2 md:size-5" aria-hidden="true" />
              <span>Save Draft</span>
            </>
          )}
        </Button>
      )}
      
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground md:py-6 md:px-8 md:text-base keyboard-focus-only"
        disabled={isSubmitting || isSaving}
        aria-busy={isSubmitting}
        aria-live="assertive"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="mr-2" aria-hidden="true" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send size={16} className="mr-2 md:size-5" aria-hidden="true" />
            <span>Submit Application</span>
          </>
        )}
      </Button>
      
      {(isSubmitting || isSaving) && (
        <div 
          className="flex items-center mt-2 text-sm sm:mt-0 md:ml-4 md:text-base"
          aria-live="polite"
        >
          <AlertTriangle size={16} className="mr-1 text-warning md:size-5" aria-hidden="true" />
          <Typography variant="small" color="warning" className="md:text-sm">
            {isSubmitting 
              ? "Please wait while your application is being submitted" 
              : "Saving your progress..."}
          </Typography>
        </div>
      )}
    </div>
  );
};

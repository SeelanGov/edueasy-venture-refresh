
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
}

export const FormActions = ({ 
  isSubmitting, 
  isSaving = false,
  onSaveDraft,
  className
}: FormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "flex flex-col space-y-4 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4",
      "md:mt-8 md:pt-2 md:border-t md:border-gray-200 dark:md:border-gray-700",
      className
    )}>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/dashboard")}
        disabled={isSubmitting || isSaving}
        className="md:py-6 md:px-6 md:text-base"
      >
        Cancel
      </Button>
      
      {onSaveDraft && (
        <Button
          type="button"
          variant="secondary"
          onClick={onSaveDraft}
          disabled={isSubmitting || isSaving}
          className="md:py-6 md:px-6 md:text-base"
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2 md:size-5" />
              Save Draft
            </>
          )}
        </Button>
      )}
      
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground md:py-6 md:px-8 md:text-base"
        disabled={isSubmitting || isSaving}
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={16} className="mr-2 md:size-5" />
            Submit Application
          </>
        )}
      </Button>
      
      {(isSubmitting || isSaving) && (
        <div className="flex items-center mt-2 text-sm sm:mt-0 md:ml-4 md:text-base">
          <AlertTriangle size={16} className="mr-1 text-warning md:size-5" />
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

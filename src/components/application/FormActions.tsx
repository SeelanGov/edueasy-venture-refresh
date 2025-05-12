
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { AlertTriangle, Save, Send } from "lucide-react";
import { Typography } from "@/components/ui/typography";

interface FormActionsProps {
  isSubmitting: boolean;
  isSaving?: boolean;
  onSaveDraft?: () => void;
}

export const FormActions = ({ 
  isSubmitting, 
  isSaving = false,
  onSaveDraft 
}: FormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/dashboard")}
        disabled={isSubmitting || isSaving}
      >
        Cancel
      </Button>
      
      {onSaveDraft && (
        <Button
          type="button"
          variant="secondary"
          onClick={onSaveDraft}
          disabled={isSubmitting || isSaving}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Draft
            </>
          )}
        </Button>
      )}
      
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isSubmitting || isSaving}
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={16} className="mr-2" />
            Submit Application
          </>
        )}
      </Button>
      
      {(isSubmitting || isSaving) && (
        <div className="flex items-center mt-2 text-sm text-warning sm:mt-0">
          <AlertTriangle size={16} className="mr-1" />
          <Typography variant="small" color="warning">
            {isSubmitting 
              ? "Please wait while your application is being submitted" 
              : "Saving your progress..."}
          </Typography>
        </div>
      )}
    </div>
  );
};

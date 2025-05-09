
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { AlertTriangle, Save, Send } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
}

export const FormActions = ({ isSubmitting }: FormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/dashboard")}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        className="bg-cap-teal hover:bg-cap-teal/90"
        disabled={isSubmitting}
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
      
      {isSubmitting && (
        <div className="flex items-center mt-2 text-sm text-amber-700 sm:mt-0">
          <AlertTriangle size={16} className="mr-1" />
          <span>Please wait while your application is being submitted</span>
        </div>
      )}
    </div>
  );
};

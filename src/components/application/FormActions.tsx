
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";

interface FormActionsProps {
  isSubmitting: boolean;
}

export const FormActions = ({ isSubmitting }: FormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
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
          "Submit Application"
        )}
      </Button>
    </div>
  );
};

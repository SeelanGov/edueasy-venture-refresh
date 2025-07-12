import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        
        <div className="mt-8 space-y-3">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
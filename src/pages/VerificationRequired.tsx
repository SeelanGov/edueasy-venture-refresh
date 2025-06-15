
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VerificationRequired = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center border">
      <h1 className="text-2xl font-semibold mb-2 text-red-600">Verification Required</h1>
      <p className="mb-6 text-gray-600">
        You need to complete identity verification before accessing your dashboard and other features.
      </p>
      <Button asChild className="w-full mb-4 bg-cap-teal" size="lg">
        <a href="/register">Retry Verification</a>
      </Button>
      <div className="text-gray-500 text-sm">
        Having trouble? <a href="/contact" className="text-cap-coral underline">Contact support</a>
      </div>
    </div>
  </div>
);

export default VerificationRequired;

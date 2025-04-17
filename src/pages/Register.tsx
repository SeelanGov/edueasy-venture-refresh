
import { Link } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterHeader } from "@/components/auth/RegisterHeader";

const Register = () => {
  return (
    <div className="min-h-screen bg-cap-dark text-white">
      {/* Header with Pattern */}
      <RegisterHeader />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <RegisterForm />

        <div className="mt-8 text-center">
          <Link to="/" className="text-white hover:text-cap-coral">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

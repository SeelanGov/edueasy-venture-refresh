
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { PageLayout } from '@/components/layout/PageLayout';

const Register = () => {
  return (
    <PageLayout
      title="Create Your Account"
      subtitle="Join thousands of students who are already transforming their educational journey"
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-cap-teal p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Sign Up for EduEasy</h2>
            <p className="mt-2 text-sm opacity-90">Start your educational journey today</p>
          </div>

          <div className="p-6">
            <RegisterForm />
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cap-teal hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-600 hover:text-cap-teal">
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;

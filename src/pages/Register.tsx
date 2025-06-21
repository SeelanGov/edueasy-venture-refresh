
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { PageLayout } from '@/components/layout/PageLayout';
import { Logo } from '@/components/Logo';

const Register = () => {
  return (
    <PageLayout
      title="Create Your Account"
      subtitle="Join thousands of students who are already transforming their educational journey"
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cap-teal to-cap-teal/90 p-6 text-white text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Logo size="small" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Join EduEasy</h2>
            <p className="text-white/90 text-sm">Start your educational journey today</p>
          </div>

          <div className="p-6">
            <RegisterForm />
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cap-teal hover:text-cap-teal/80 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-600 hover:text-cap-teal inline-flex items-center gap-2 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;

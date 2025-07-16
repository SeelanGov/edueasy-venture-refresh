import { RegisterForm } from '@/components/auth/RegisterForm';
import { PageLayout } from '@/components/layout/PageLayout';
import { Logo } from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Register = () => {
  const location = useLocation();
  const pendingPlan = sessionStorage.getItem('pending_plan');
  
  // Plan context for paid plans
  const plans = {
    essential: { name: 'Essential Plan', price: 'R199' },
    'pro-ai': { name: 'Pro + AI Plan', price: 'R300' }
  };
  
  const selectedPlan = plans[pendingPlan as keyof typeof plans];

  return (
    <PageLayout
      title={selectedPlan ? `Complete Your ${selectedPlan.name} Purchase` : "Create Your Account"}
      subtitle={selectedPlan 
        ? "Create your account to secure your purchase and get immediate access"
        : "Join thousands of students who are already transforming their educational journey"
      }
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        {/* Plan context banner for paid plans */}
        {selectedPlan && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Complete your {selectedPlan.name} purchase
                </p>
                <p className="text-sm text-blue-700">
                  Create your account to secure your {selectedPlan.price} purchase
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plan-specific benefits */}
        {selectedPlan && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-900 mb-2">What you'll get:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Secure payment processing with tracking</li>
              <li>• Immediate access to your dashboard</li>
              <li>• Personalized application guidance</li>
              <li>• Document management system</li>
            </ul>
          </div>
        )}

        <Card className="shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cap-teal to-cap-teal/90 p-6 text-white text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Logo size="small" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {selectedPlan ? 'Create Your Account' : 'Join EduEasy'}
            </h2>
            <p className="text-white/90 text-sm">
              {selectedPlan 
                ? 'Complete your purchase and get access to your personalized dashboard'
                : 'Start your educational journey today'
              }
            </p>
          </div>

          <CardContent className="p-6">
            <RegisterForm hasPendingPlan={!!selectedPlan} />

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-cap-teal hover:text-cap-teal/80 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-cap-teal inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;

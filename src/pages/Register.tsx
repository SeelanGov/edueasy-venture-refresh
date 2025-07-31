import { RegisterForm } from '@/components/auth/RegisterForm';
import { PageLayout } from '@/components/layout/PageLayout';
import { Logo } from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressIndicator, createAuthFlowSteps } from '@/components/ui/ProgressIndicator';
import { secureStorage } from '@/utils/secureStorage';
import { CheckCircle, CreditCard, Shield, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const pendingPlan = secureStorage.getItem('pending_plan');

  // Plan context for paid plans
  const plans = {
    essential: { name: 'Essential Plan', price: 'R199' },
    'pro-ai': { name: 'Pro + AI Plan', price: 'R300' },
  };

  const selectedPlan = plans[pendingPlan as keyof typeof plans];

  return (
    <PageLayout
      title={selectedPlan ? `Complete Your ${selectedPlan.name} Purchase` : 'Create Your Account'}
      subtitle={
        selectedPlan
          ? 'Create your account to secure your purchase and get immediate access'
          : 'Join thousands of students who are already transforming their educational journey'
      }
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        {/* Progress Indicator for paid plans */}
        {selectedPlan && (
          <div className="mb-8">
            <ProgressIndicator
              steps={createAuthFlowSteps('register')}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            />
          </div>
        )}

        {/* Enhanced Plan context banner for paid plans */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <p className="font-semibold text-blue-900">Plan Selected: {selectedPlan.name}</p>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Create your account to secure your {selectedPlan.price} purchase
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-600">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span>Account Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Plan-specific benefits */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              What you'll get with {selectedPlan.name}:
            </h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Secure payment processing with full tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Immediate access to your personalized dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>AI-powered application guidance and support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Advanced document management system</span>
              </li>
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
                : 'Start your educational journey today'}
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

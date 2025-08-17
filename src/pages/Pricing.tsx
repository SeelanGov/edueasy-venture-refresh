import { PatternBorder } from '@/components/PatternBorder';
import { Button } from '@/components/ui/button';
import { ErrorRecovery } from '@/components/ui/ErrorRecovery';
import { Typography } from '@/components/ui/typography';
import { secureStorage } from '@/utils/secureStorage';
import { Bot, Check, CreditCard, Shield, Sparkles } from '@/ui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Pricing = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Simplified error handler for demonstration  
  const handleSessionStorageError = (operation: string) => ({
    title: 'Storage Error',
    message: `Failed during ${operation}. Using fallback method.`,
    variant: 'warning' as const,
    canRetry: true
  });

  // Enhanced plan selection handler with error recovery
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);

    if (planId === 'starter') {
      navigate('/register');
    } else {
      // For paid plans, always require registration
      try {
        secureStorage.setItem('pending_plan', planId);
        navigate('/register', {
          state: {
            from: `/checkout?plan=${planId}`,
            message: 'Create your account to continue with your purchase',
          },
        });
      } catch (error) {
        // Enhanced error handling with recovery options
        const sessionStorageError = handleSessionStorageError('plan selection');
        setError(sessionStorageError);

        // Fallback to URL params if sessionStorage fails
        setTimeout(() => {
          navigate(`/register?plan=${planId}`);
        }, 2000);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    if (selectedPlan) {
      handlePlanSelection(selectedPlan);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'R0',
      priceType: 'Once-Off',
      description: 'Get started with basic application tools and Thandi',
      features: [
        '1 application (any institution)',
        'Basic Thandi AI chat support',
        'Basic APS calculator',
        'Application deadline alerts',
        'Program browsing',
        'Community support',
      ],
      thandiFeatures: ['Basic Q&A about applications', 'General guidance'],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      id: 'essential',
      name: 'Essential',
      price: 'R199',
      priceType: 'Once-Off',
      description: 'Everything you need with enhanced Thandi guidance',
      features: [
        'Up to 3 applications',
        'Thandi AI guidance & support',
        'Document management system',
        'Form auto-fill technology',
        'NSFAS guidance & tracking',
        'Email support',
        'Branded application PDFs',
      ],
      thandiFeatures: [
        'Application guidance',
        'Deadline management',
        'Document help',
        'NSFAS assistance',
      ],
      buttonText: 'Choose Essential',
      popular: true,
    },
    {
      id: 'pro-ai',
      name: 'Pro + AI',
      price: 'R300',
      priceType: 'Once-Off',
      description: 'Complete package with advanced Thandi career guidance',
      features: [
        'Up to 6 applications',
        'Advanced Thandi career counseling',
        'Document reviews & feedback',
        'Priority processing queue',
        'Application success insights',
        'Personalized career roadmap',
        'Interview preparation',
      ],
      thandiFeatures: [
        'Career counseling',
        'Personalized recommendations',
        'Interview prep',
        'Program matching',
      ],
      buttonText: 'Choose Pro + AI',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        <PatternBorder position="top" />
      </div>

      {/* Back to Home Button */}
      <div className="container mx-auto px-4 mt-8 mb-0 flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="px-3 py-1 rounded-lg flex items-center text-cap-teal hover:bg-cap-teal/10 transition-colors">
          <span className="mr-2 text-lg">&#8592</span>
          Back to Home
        </Button>
      </div>

      <div className="container mx-auto py-20 px-4">
        {/* Error Recovery Display */}
        {error && (
          <div className="mb-8">
            <ErrorRecovery error={error} onRetry={handleRetry} className="max-w-2xl mx-auto" />
          </div>
        )}

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-cap-teal" />
            <Typography variant="h1" className="mb-0">
              Choose Your Plan
            </Typography>
          </div>
          <Typography variant="lead" className="max-w-2xl mx-auto">
            Pay once for the entire application season - no monthly fees, no surprises
          </Typography>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Bot className="h-6 w-6 text-cap-teal" />
            <Typography variant="body" className="text-cap-teal font-semibold">
              All plans include Thandi AI Assistant with increasing capabilities
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                plan.popular
                  ? 'border-cap-teal shadow-lg scale-105 ring-2 ring-cap-teal/20'
                  : 'border-gray-200 hover:border-cap-teal/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cap-teal to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-cap-teal mb-2">{plan.price}</div>
                <Typography variant="small" className="text-gray-500">
                  {plan.priceType}
                </Typography>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-cap-teal" />
                    <Typography variant="small" className="font-semibold text-cap-teal">
                      Thandi AI Capabilities
                    </Typography>
                  </div>
                  <ul className="space-y-1">
                    {plan.thandiFeatures.map((feature, idx) => (
                      <li key={idx} className="text-xs text-blue-700 flex items-start">
                        <span className="text-cap-teal mr-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cap-teal to-blue-600 hover:from-cap-teal/90 hover:to-blue-700 shadow-lg'
                      : 'bg-gray-900 hover:bg-gray-800'
                  } text-white font-semibold py-3`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Typography variant="p" className="text-gray-600 mb-4">
            Need personalized guidance? Book a 1-on-1 session with our experts
          </Typography>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>Card Payments</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Secure Processing</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>Instant Access</span>
            </div>
          </div>
          <Typography variant="small" className="text-gray-500 mt-2">
            All plans include lifetime access for the application season. Pay with card, airtime, or
            at any service provider.
          </Typography>
        </div>

        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <Typography variant="h4" className="mb-2">
                1-on-1 Expert Sessions
              </Typography>
              <Typography variant="large" className="text-blue-600 mb-2">
                R600 per session
              </Typography>
              <Typography variant="small" className="text-gray-600 mb-4">
                Career coaching, interview prep, application reviews
              </Typography>
              <Button variant="outline" className="w-full hover:bg-blue-100 transition-colors">
                Book Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative w-full">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default Pricing;

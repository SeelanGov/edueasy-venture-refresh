
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PatternBorder } from "@/components/PatternBorder";
import { Typography } from "@/components/ui/typography";

const Pricing = () => {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "R0",
      priceType: "Once-Off",
      description: "Get started with basic application tools",
      features: [
        "1 application (any institution)",
        "Basic APS calculator",
        "Application deadline alerts",
        "Program browsing",
        "Community support"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      id: "essential",
      name: "Essential",
      price: "R199",
      priceType: "Once-Off",
      description: "Everything you need for multiple applications",
      features: [
        "Up to 3 applications",
        "Document management system", 
        "Form auto-fill technology",
        "NSFAS guidance & tracking",
        "Email support",
        "Branded application PDFs"
      ],
      buttonText: "Choose Essential",
      popular: true
    },
    {
      id: "pro-ai",
      name: "Pro + AI",
      price: "R300",
      priceType: "Once-Off", 
      description: "Complete package with AI-powered guidance",
      features: [
        "Up to 6 applications",
        "Career guidance with Thandi AI",
        "Document reviews & feedback",
        "Priority processing queue",
        "Application success insights",
        "Personalized career roadmap"
      ],
      buttonText: "Choose Pro + AI",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        <PatternBorder position="top" />
      </div>

      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <Typography variant="h1" className="mb-4">
            Choose Your Plan
          </Typography>
          <Typography variant="lead" className="max-w-2xl mx-auto">
            Pay once for the entire application season - no monthly fees, no surprises
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-cap-teal shadow-lg scale-105' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-cap-teal text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-cap-teal mb-2">{plan.price}</div>
                <Typography variant="small" className="text-gray-500">{plan.priceType}</Typography>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link to={plan.id === 'starter' ? '/register' : `/checkout?plan=${plan.id}`} className="w-full">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-cap-teal hover:bg-cap-teal/90' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Typography variant="p" className="text-gray-600 mb-4">
            Need personalized guidance? Book a 1-on-1 session with our experts
          </Typography>
          <Typography variant="small" className="text-gray-500">
            All plans include lifetime access for the application season. Pay with card, airtime, or at any service provider.
          </Typography>
        </div>

        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <Typography variant="h4" className="mb-2">1-on-1 Expert Sessions</Typography>
              <Typography variant="large" className="text-blue-600 mb-2">R600 per session</Typography>
              <Typography variant="small" className="text-gray-600 mb-4">
                Career coaching, interview prep, application reviews
              </Typography>
              <Button variant="outline" className="w-full">
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

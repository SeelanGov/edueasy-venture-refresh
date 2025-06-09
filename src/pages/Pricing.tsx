
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PatternBorder } from "@/components/PatternBorder";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started with your education journey",
      features: [
        "Profile creation and completion",
        "Basic application assistance",
        "Access to educational resources",
        "Community support"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      price: "R99/month",
      description: "Enhanced support and personalized guidance",
      features: [
        "Everything in Basic",
        "Priority application processing",
        "One-on-one mentorship sessions",
        "Advanced career guidance",
        "Document review and feedback",
        "Interview preparation"
      ],
      buttonText: "Choose Premium",
      popular: true
    },
    {
      name: "Institution",
      price: "Custom",
      description: "Tailored solutions for educational institutions",
      features: [
        "Bulk student management",
        "Custom branding",
        "Analytics and reporting",
        "API access",
        "Dedicated support team",
        "Training and onboarding"
      ],
      buttonText: "Contact Sales",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to support your educational journey and career goals
          </p>
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
                <Link to="/register" className="w-full">
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
          <p className="text-gray-600 mb-4">
            All plans include our core features and 24/7 support
          </p>
          <p className="text-sm text-gray-500">
            Prices are in South African Rand (ZAR). No hidden fees or setup costs.
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default Pricing;

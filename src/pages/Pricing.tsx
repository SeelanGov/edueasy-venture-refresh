import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Shield, Users, Zap, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { PatternBorder } from "@/components/PatternBorder";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "R0",
      period: "Once-Off",
      description: "Perfect for getting started with your education journey",
      features: [
        "1 Application (any institution)",
        "Basic APS calculator",
        "Application deadline alerts",
        "Program browsing",
        "Community support"
      ],
      buttonText: "Get Started",
      popular: false,
      buttonVariant: "outline" as const,
      route: "/register?plan=starter"
    },
    {
      name: "Essential",
      price: "R199",
      period: "Once-Off",
      description: "Essential tools for serious applicants",
      features: [
        "Up to 3 applications",
        "Document management system",
        "Form auto-fill technology",
        "NSFAS guidance",
        "Email support",
        "Application tracking"
      ],
      buttonText: "Choose Essential",
      popular: true,
      buttonVariant: "default" as const,
      route: "/checkout?plan=essential"
    },
    {
      name: "Pro + AI",
      price: "R300",
      period: "Once-Off",
      description: "Complete support with AI-powered guidance",
      features: [
        "Up to 6 applications",
        "Career guidance with Thandi AI",
        "Document reviews",
        "Priority processing",
        "Priority support",
        "Application tracking",
        "Interview preparation"
      ],
      buttonText: "Choose Pro + AI",
      popular: false,
      buttonVariant: "default" as const,
      route: "/checkout?plan=pro-ai"
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Expert Guidance",
      description: "AI-powered assistance from Thandi, your personal education advisor"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your documents and data are protected with enterprise-grade security"
    },
    {
      icon: Users,
      title: "Proven Success",
      description: "Join 2,500+ students who achieved their academic goals with EduEasy"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Streamlined applications that save you hours of paperwork"
    },
    {
      icon: Heart,
      title: "South African",
      description: "Built specifically for South African students and institutions"
    },
    {
      icon: Award,
      title: "95% Success Rate",
      description: "Our students have the highest application acceptance rates"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        <PatternBorder position="top" />
      </div>

      <div className="container mx-auto py-20 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Pay once and get lifetime access to support your educational journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-cap-teal shadow-lg scale-105 ring-2 ring-cap-teal/20' 
                  : 'border-gray-200 hover:border-cap-teal/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-cap-teal text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-cap-teal">{plan.price}</span>
                  <span className="text-gray-500 text-lg ml-2">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Link to={plan.route} className="w-full">
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full py-3 font-semibold transition-all duration-300 ${
                      plan.popular || plan.buttonVariant === 'default'
                        ? 'bg-cap-teal hover:bg-cap-teal/90 text-white shadow-md hover:shadow-lg' 
                        : 'border-cap-teal text-cap-teal hover:bg-cap-teal hover:text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Why Choose EduEasy Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduEasy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of South African students who trust EduEasy for their educational journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Expert Guidance",
                description: "AI-powered assistance from Thandi, your personal education advisor"
              },
              {
                icon: Shield,
                title: "Secure & Trusted",
                description: "Your documents and data are protected with enterprise-grade security"
              },
              {
                icon: Users,
                title: "Proven Success",
                description: "Join 2,500+ students who achieved their academic goals with EduEasy"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Streamlined applications that save you hours of paperwork"
              },
              {
                icon: Heart,
                title: "South African",
                description: "Built specifically for South African students and institutions"
              },
              {
                icon: Award,
                title: "95% Success Rate",
                description: "Our students have the highest application acceptance rates"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cap-teal/10 rounded-full mb-4 group-hover:bg-cap-teal/20 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-cap-teal" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-cap-teal/5 via-white to-cap-coral/5 rounded-2xl p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            All plans include our core features, 24/7 support, and lifetime access. 
            No hidden fees or recurring charges.
          </p>
          <Link to="/register?plan=starter">
            <Button className="bg-cap-teal hover:bg-cap-teal/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started Today
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Prices are in South African Rand (ZAR) • One-time payment
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

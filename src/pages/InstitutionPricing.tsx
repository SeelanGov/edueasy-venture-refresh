
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Shield, Users, Zap, Heart, Award, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { PatternBorder } from "@/components/PatternBorder";

const InstitutionPricing = () => {
  const institutionPlans = [
    {
      name: "Basic Partner",
      price: "R50,000",
      period: "Per Year",
      description: "Perfect for smaller institutions getting started with EduEasy",
      features: [
        "Up to 100 student applications",
        "Basic analytics dashboard",
        "Email support",
        "Student application tracking",
        "Document verification",
        "Standard integration support"
      ],
      buttonText: "Contact Sales",
      popular: false,
      buttonVariant: "outline" as const,
      maxStudents: "100",
      supportLevel: "Email"
    },
    {
      name: "Standard Partner",
      price: "R150,000",
      period: "Per Year",
      description: "Comprehensive solution for growing institutions",
      features: [
        "Up to 500 student applications",
        "Advanced analytics & reporting",
        "Phone & email support",
        "Custom branding options",
        "API access",
        "Staff training sessions",
        "Priority processing"
      ],
      buttonText: "Contact Sales",
      popular: true,
      buttonVariant: "default" as const,
      maxStudents: "500",
      supportLevel: "Phone & Email"
    },
    {
      name: "Premium Partner",
      price: "R300,000",
      period: "Per Year",
      description: "Enterprise solution with unlimited capacity and dedicated support",
      features: [
        "Unlimited student applications",
        "Full analytics suite & insights",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "24/7 priority support",
        "On-site training",
        "Custom reporting"
      ],
      buttonText: "Contact Sales",
      popular: false,
      buttonVariant: "default" as const,
      maxStudents: "Unlimited",
      supportLevel: "Dedicated Manager"
    }
  ];

  const benefits = [
    {
      icon: Building,
      title: "Institution Focus",
      description: "Purpose-built for South African educational institutions and their unique needs"
    },
    {
      icon: Users,
      title: "Student Success",
      description: "Improve student application success rates by 40% with our guided process"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security ensuring all student data is protected and compliant"
    },
    {
      icon: Zap,
      title: "Seamless Integration",
      description: "Quick setup with your existing systems through our robust API"
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Join 50+ institutions already improving their application processes"
    },
    {
      icon: Heart,
      title: "Dedicated Support",
      description: "Local South African support team understanding your institution's needs"
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
            Institution Partnership Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive pricing for educational institutions. Annual plans with dedicated support 
            to help your students succeed in their academic journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {institutionPlans.map((plan, index) => (
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
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Max Students:</span>
                    <span className="font-semibold text-cap-teal">{plan.maxStudents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Support Level:</span>
                    <span className="font-semibold text-cap-teal">{plan.supportLevel}</span>
                  </div>
                </div>

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
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full py-3 font-semibold transition-all duration-300 ${
                    plan.popular || plan.buttonVariant === 'default'
                      ? 'bg-cap-teal hover:bg-cap-teal/90 text-white shadow-md hover:shadow-lg' 
                      : 'border-cap-teal text-cap-teal hover:bg-cap-teal hover:text-white'
                  }`}
                  onClick={() => {
                    // Scroll to contact section or open contact form
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Why Choose EduEasy Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner with EduEasy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join leading South African institutions already transforming their student application processes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
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

        {/* Contact Section */}
        <div id="contact-section" className="text-center bg-gradient-to-r from-cap-teal/5 via-white to-cap-coral/5 rounded-2xl p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Institution?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our partnership team will work with you to find the perfect solution for your institution's needs. 
            Get started with a personalized demo and consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-cap-teal hover:bg-cap-teal/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Schedule Demo
              </Button>
            </Link>
            <Link to="/institutions">
              <Button variant="outline" className="border-cap-teal text-cap-teal hover:bg-cap-teal/10 px-8 py-3 text-lg font-semibold transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Custom pricing available for large institutions • All prices in South African Rand (ZAR)
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default InstitutionPricing;

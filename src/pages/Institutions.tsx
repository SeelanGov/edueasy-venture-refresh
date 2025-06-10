
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, BarChart, Shield, Headphones, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PatternBorder } from "@/components/PatternBorder";

const Institutions = () => {
  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-cap-teal" />,
      title: "Student Management",
      description: "Efficiently manage student applications, track progress, and provide support at scale."
    },
    {
      icon: <BarChart className="h-8 w-8 text-cap-teal" />,
      title: "Analytics & Insights",
      description: "Gain valuable insights into application trends, student success rates, and institutional performance."
    },
    {
      icon: <Shield className="h-8 w-8 text-cap-teal" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security ensuring all student data is protected and compliant with regulations."
    },
    {
      icon: <Headphones className="h-8 w-8 text-cap-teal" />,
      title: "Dedicated Support",
      description: "24/7 dedicated support team to help your institution maximize the platform's potential."
    },
    {
      icon: <Zap className="h-8 w-8 text-cap-teal" />,
      title: "Custom Integration",
      description: "Seamlessly integrate with your existing systems through our robust API and custom solutions."
    },
    {
      icon: <School className="h-8 w-8 text-cap-teal" />,
      title: "Branded Experience",
      description: "Customize the platform with your institution's branding for a cohesive student experience."
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
            EduEasy for Educational Institutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empower your institution with our comprehensive platform designed to streamline 
            student applications, improve success rates, and enhance the educational experience.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <Card className="bg-gradient-to-r from-cap-teal to-purple-600 text-white">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Transform Your Institution's Student Journey
                  </h2>
                  <p className="text-lg mb-8 opacity-90">
                    Join leading South African institutions already using EduEasy to improve 
                    student outcomes, reduce administrative burden, and enhance the application process.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm">✓</span>
                      </div>
                      <span>Reduce application processing time by 60%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm">✓</span>
                      </div>
                      <span>Improve student success rates by 40%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm">✓</span>
                      </div>
                      <span>Enhance student satisfaction and engagement</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <School className="h-32 w-32 text-white/80 mx-auto mb-6" />
                  <Link to="/contact">
                    <Button className="bg-white text-cap-teal hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                      Schedule a Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose EduEasy for Your Institution?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Trusted by Leading Institutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cap-teal mb-2">50+</div>
              <p className="text-gray-600">Partner Institutions</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cap-teal mb-2">100K+</div>
              <p className="text-gray-600">Students Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cap-teal mb-2">95%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the growing network of institutions using EduEasy to improve student outcomes 
            and streamline their processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-cap-teal hover:bg-cap-teal/90 text-white px-8 py-3 text-lg">
                Request a Demo
              </Button>
            </Link>
            <Link to="/institution-pricing">
              <Button variant="outline" className="border-cap-teal text-cap-teal hover:bg-cap-teal/10 px-8 py-3 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default Institutions;

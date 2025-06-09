
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Brain, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { PatternBorder } from "@/components/PatternBorder";

const MeetThandi = () => {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-cap-teal" />,
      title: "24/7 Availability",
      description: "Thandi is always here to help, whenever you need support with your educational journey."
    },
    {
      icon: <Brain className="h-8 w-8 text-cap-teal" />,
      title: "AI-Powered Intelligence",
      description: "Advanced artificial intelligence helps Thandi understand your unique needs and provide personalized guidance."
    },
    {
      icon: <Heart className="h-8 w-8 text-cap-teal" />,
      title: "Empathetic Support",
      description: "Thandi understands the challenges of South African students and provides culturally aware assistance."
    },
    {
      icon: <Clock className="h-8 w-8 text-cap-teal" />,
      title: "Instant Responses",
      description: "Get immediate answers to your questions about applications, requirements, and career paths."
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
            Meet Thandi, Your AI Education Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thandi is EduEasy's intelligent AI assistant, designed specifically to help South African students 
            navigate their educational journey with personalized support and guidance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Personal Education Guide
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thandi combines advanced AI technology with deep understanding of the South African 
                    education system to provide you with accurate, relevant, and timely assistance.
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-cap-teal mr-2">•</span>
                      Helps with university and college applications
                    </li>
                    <li className="flex items-start">
                      <span className="text-cap-teal mr-2">•</span>
                      Provides career guidance and course recommendations
                    </li>
                    <li className="flex items-start">
                      <span className="text-cap-teal mr-2">•</span>
                      Assists with bursary and scholarship applications
                    </li>
                    <li className="flex items-start">
                      <span className="text-cap-teal mr-2">•</span>
                      Offers study tips and academic support
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-cap-teal/10 to-purple-100 rounded-lg p-8 text-center">
                  <div className="w-32 h-32 bg-cap-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thandi AI</h3>
                  <p className="text-gray-600">Your Educational Companion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey with Thandi?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of South African students who are already benefiting from Thandi's 
            personalized guidance and support.
          </p>
          <Link to="/register">
            <Button className="bg-cap-teal hover:bg-cap-teal/90 text-white px-8 py-3 text-lg">
              Get Started with Thandi
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default MeetThandi;

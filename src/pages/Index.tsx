
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { BookOpen, Users, Globe, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Learning Experience
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            EduEasy makes education technology accessible and effective for everyone. Join thousands of satisfied learners today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose EduEasy?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Interactive Learning",
                description: "Engage with dynamic content that adapts to your learning style"
              },
              {
                icon: Users,
                title: "Collaborative Platform",
                description: "Connect with peers and experts in real-time discussion forums"
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Learn anytime, anywhere with our cloud-based platform"
              },
              {
                icon: Shield,
                title: "Secure Environment",
                description: "Your data is protected with enterprise-grade security"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning with EduEasy
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;


import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartApplication = () => {
    console.log('Start application clicked, user:', !!user);
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to start your application.',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/apply' } });
      return;
    }
    navigate('/apply');
  };

  return (
    <section id="home" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-64 bg-repeat"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-repeat"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-left space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
              Education Made Simple
            </div>

            <Typography
              variant="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            >
              <span className="text-primary">EduEasy</span> <br />
              Bridging Education to Employment
            </Typography>

            <Typography variant="body-lg" className="text-gray-600 max-w-lg">
              Apply to multiple universities across South Africa with a single application. Save
              time, track progress, and increase your chances of acceptance.
            </Typography>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="text-white bg-primary hover:bg-primary/90 rounded-full px-8"
                onClick={handleStartApplication}
              >
                Start Application
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-8"
                onClick={() => navigate('#how-it-works')}
              >
                Learn More
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <Typography variant="h3" className="text-primary font-bold">
                  93%
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  Success Rate
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="text-primary font-bold">
                  50+
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  Partner Schools
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="text-primary font-bold">
                  24/7
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  Support
                </Typography>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Image Gallery */}
          <div className="hidden md:block relative h-full">
            {/* Background decorative elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/30 rounded-full"></div>
            
            {/* Main image showcase */}
            <div className="relative z-10 grid grid-cols-2 gap-4 h-96">
              {/* Primary image - Study environment */}
              <div className="col-span-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                <img
                  src="/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png"
                  alt="Students in modern study environment"
                  className="w-full h-48 rounded-xl object-cover"
                />
              </div>
              
              {/* Secondary images */}
              <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
                <img
                  src="/lovable-uploads/dfdb235b-f897-4d34-b55e-36edff5dba13.png"
                  alt="African student celebrating success"
                  className="w-full h-32 rounded-lg object-cover"
                />
              </div>
              
              <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 flex items-center justify-center">
                <div className="text-center text-primary">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-xs">Students Helped</div>
                </div>
              </div>
            </div>

            {/* Floating success badge */}
            <div className="absolute -right-6 bottom-12 bg-white p-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="font-medium">Success Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="#how-it-works"
            className="flex flex-col items-center text-gray-500 animate-bounce hover:text-primary transition-colors"
          >
            <Typography variant="small" className="mb-2">
              EXPLORE MORE
            </Typography>
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

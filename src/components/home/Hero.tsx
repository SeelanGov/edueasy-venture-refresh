import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';
import { StatisticsGrid } from './StatisticsGrid';
import { HeroImage } from './HeroImage';

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
              Building Since 2024
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

            {/* Our 2025 Vision */}
            <div className="pt-6">
              <Typography variant="h4" className="text-gray-700 mb-4 text-center">
                Our 2025 Vision
              </Typography>
              <StatisticsGrid
                selectedStats={['applicationSuccessRate', 'partnerInstitutions', 'ai247Support']}
                variant="compact"
                columns={3}
                animateOnScroll={true}
              />
            </div>
          </div>

          {/* Right Column - Image */}
          <HeroImage />
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

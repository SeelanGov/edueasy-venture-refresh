
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';
import { useState } from 'react';

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const heroImagePath = 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&h=400&fit=crop&auto=format';

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

  const handleStartWithThandi = () => {
    console.log('Start with Thandi clicked');
    toast({
      title: 'Thandi AI Assistant',
      description: 'Meet Thandi, your personal education assistant!',
    });
  };

  const handleImageLoad = () => {
    console.log('Hero image loaded successfully:', heroImagePath);
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Hero image failed to load:', heroImagePath, e);
    setImageError(true);
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
              Empowering SA Youth
            </div>

            <Typography
              variant="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            >
              <span className="text-primary">EduEasy</span> <br />
              Online and Offline Education Support
            </Typography>

            <Typography variant="body-lg" className="text-gray-600 max-w-lg">
              Get personalized guidance from Thandi, our AI assistant, and apply to multiple 
              South African universities with confidence. Your success story starts here.
            </Typography>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="text-white bg-primary hover:bg-primary/90 rounded-full px-8"
                onClick={handleStartWithThandi}
              >
                Start with Thandi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-8"
                onClick={handleStartApplication}
              >
                Start Application
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <Typography variant="h3" className="text-primary font-bold">
                  95%
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
                  AI Support
                </Typography>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Image */}
          <div className="hidden md:block relative h-full">
            {/* Background decorative elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/30 rounded-full"></div>
            
            {/* Main hero image */}
            <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
              {/* Loading indicator */}
              {!imageLoaded && !imageError && (
                <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
                  <div className="text-gray-500">Loading image...</div>
                </div>
              )}
              
              {/* Error state */}
              {imageError && (
                <div className="w-full h-64 bg-red-100 rounded-xl flex items-center justify-center">
                  <div className="text-red-600 text-center">
                    <div>Image failed to load</div>
                    <div className="text-xs mt-1">{heroImagePath}</div>
                  </div>
                </div>
              )}
              
              {/* Main image */}
              <img
                src={heroImagePath}
                alt="South African student studying with EduEasy platform"
                className={`w-full h-auto rounded-xl object-cover ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {/* Floating badge */}
              <div className="absolute -right-6 bottom-12 bg-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="font-medium">AI-Powered Success</span>
                </div>
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

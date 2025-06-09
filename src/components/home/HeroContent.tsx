import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Typography } from '@/components/ui/typography';

export const HeroContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartApplication = () => {
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
    toast({
      title: 'Thandi AI Assistant',
      description: 'Meet Thandi, your personal education assistant!',
    });
  };

  return (
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
  );
};

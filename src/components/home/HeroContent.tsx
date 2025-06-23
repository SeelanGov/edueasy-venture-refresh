
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Typography } from '@/components/ui/typography';

export const HeroContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartApplication = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please register an account to start your application.',
        variant: 'destructive',
      });
      console.log("Redirecting unauthenticated user to /register from Start Application");
      navigate('/register', { state: { from: '/apply' } });
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
    <div className="flex flex-col-reverse md:flex-row gap-8 items-center md:items-start">
      <div className="flex-1 text-left space-y-6">
        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
          Empowering SA Youth
        </div>
        <Typography
          variant="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
        >
          Empowering SA Youth, Online and Offline
        </Typography>

        <Typography variant="body-lg" className="text-gray-600 max-w-lg">
          From university applications to careers — built for every student, everywhere.
        </Typography>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            size="lg"
            className="bg-cap-teal hover:bg-cap-teal/90 text-white rounded-full px-8"
            onClick={handleStartWithThandi}
          >
            Start with Thandi
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-cap-teal text-cap-teal hover:bg-cap-teal/10 hover:border-cap-teal rounded-full px-8"
            onClick={handleStartApplication}
          >
            Start Application
          </Button>
        </div>
      </div>
    </div>
  );
};

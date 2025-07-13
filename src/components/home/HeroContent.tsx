import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
      navigate('/register', { state: { from: '/dashboard' } });
      return;
    }
    navigate('/dashboard');
  };

  const handleStartWithThandi = () => {
    navigate('/meet-thandi');
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
            variant="primary"
            size="lg"
            rounded="full"
            className="px-8"
            onClick={handleStartWithThandi}
          >
            Start with Thandi
          </Button>
          <Button
            variant="outline"
            size="lg"
            rounded="full"
            className="px-8"
            onClick={handleStartApplication}
          >
            Start Application
          </Button>
        </div>
      </div>
    </div>
  );
};

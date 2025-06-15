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
    <div className="flex flex-col-reverse md:flex-row gap-8 items-center md:items-start">
      {/* Left: Text Content */}
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
      </div>
      {/* Right: Removed Thandi Image for a cleaner look */}
      {/* <div className="flex-1 flex justify-center w-full md:justify-end">
        <img
          src="/lovable-uploads/ea352049-18bb-49a0-b8e3-d00ae059e1f1.png"
          alt="Thandi, the EduEasy AI Education Assistant"
          className="max-w-xs w-full rounded-2xl object-cover shadow-xl border-4 border-white"
          style={{minWidth: 240}}
        />
      </div> */}
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

/**
 * CTASection
 * @description Function
 */
export const CTASection = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartApplication = (): void => {
    if (!user) {
      navigate('/register', { state: { from: '/profile-completion' } });
      return;
    }

    navigate('/profile-completion');
  };

  return (
    <section className="py-20 px-4 md:py-24 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="relative overflow-hidden">
        <div
          className="absolute right-0 top-0 h-64 w-1/3 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute left-0 bottom-0 h-64 w-1/3 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="container mx-auto py-10">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg border border-gray-100">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-10 md:mb-12">
                  <Typography variant="h2" className="text-gray-800 mb-6 md:text-4xl">
                    Ready to Start Your Future?
                  </Typography>
                  <Typography
                    variant="body-lg"
                    className="text-gray-600 mb-8 max-w-2xl mx-auto md:text-xl">
                    Join thousands of students already on their path to success through South
                    Africa's leading educational institutions.
                  </Typography>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
                  <div className="text-center md:text-left md:w-1/2 space-y-6">
                    <div className="flex items-center justify-center md:justify-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                        <Typography variant="body" className="font-bold text-primary md:text-lg">
                          1
                        </Typography>
                      </div>
                      <Typography variant="body-lg" className="text-gray-700 md:text-xl">
                        Create your student profile
                      </Typography>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                        <Typography variant="body" className="font-bold text-primary md:text-lg">
                          2
                        </Typography>
                      </div>
                      <Typography variant="body-lg" className="text-gray-700 md:text-xl">
                        Upload your documents once
                      </Typography>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                        <Typography variant="body" className="font-bold text-primary md:text-lg">
                          3
                        </Typography>
                      </div>
                      <Typography variant="body-lg" className="text-gray-700 md:text-xl">
                        Apply to multiple institutions
                      </Typography>
                    </div>
                  </div>

                  <div className="md:w-1/2 flex flex-col gap-4 items-center">
                    {user ? (
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full md:w-auto text-lg py-6 md:py-7 md:px-10"
                        onClick={() => navigate('/profile-completion')}
                      >
                        Complete Your Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full md:w-auto text-lg py-6 md:py-7 md:px-10"
                          onClick={handleStartApplication}
                        >
                          Register & Complete Profile
                        </Button>
                        <Link to="/login" className="w-full md:w-auto">
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-lg py-6 md:py-7 md:px-10">
                            Already Have Account? Login
                          </Button>
                        </Link>
                      </>
                    )}

                    <Typography variant="small" className="text-gray-500 mt-2 md:text-base">
                      No payment required to create an account and start your application
                    </Typography>
                  </div>
                </div>

                <div className="mt-10 text-center">
                  <Link to="/profile-demo">
                    <Button
                      variant="ghost"
                      className="text-cap-teal hover:bg-cap-teal/10 hover:text-cap-teal md:text-lg">
                      View Profile Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};


import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/PatternBorder";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Typography } from "@/components/ui/typography";

export const CTASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleStartApplication = () => {
    if (!user) {
      navigate('/register', { state: { from: '/profile-completion' } });
      return;
    }
    
    navigate('/profile-completion');
  };

  return (
    <section className="py-20 px-4 bg-cap-dark text-white">
      <div className="relative overflow-hidden">
        {/* African Pattern Top Border */}
        <PatternBorder position="top" />
        
        <div className="container mx-auto py-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-cap-teal/20 via-cap-coral/20 to-cap-teal/20 rounded-lg p-8 md:p-12">
              <div className="text-center mb-10">
                <Typography variant="h2" color="white" className="mb-6">
                  Ready to Start Your Future?
                </Typography>
                <Typography variant="body-lg" color="white" className="mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of students already on their path to success through South Africa's leading educational institutions.
                </Typography>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="text-center md:text-left md:w-1/2 space-y-6">
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Typography variant="body" color="white" className="font-bold">1</Typography>
                    </div>
                    <Typography variant="body-lg" color="white">Create your student profile</Typography>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Typography variant="body" color="white" className="font-bold">2</Typography>
                    </div>
                    <Typography variant="body-lg" color="white">Upload your documents once</Typography>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Typography variant="body" color="white" className="font-bold">3</Typography>
                    </div>
                    <Typography variant="body-lg" color="white">Apply to multiple institutions</Typography>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex flex-col gap-4 items-center">
                  {user ? (
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto bg-cap-coral text-white hover:bg-cap-coral/90 text-lg py-6"
                      onClick={() => navigate('/profile-completion')}
                    >
                      Complete Your Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="lg" 
                        className="w-full md:w-auto bg-cap-coral text-white hover:bg-cap-coral/90 text-lg py-6"
                        onClick={handleStartApplication}
                      >
                        Register & Complete Profile
                      </Button>
                      <Link to="/login" className="w-full md:w-auto">
                        <Button size="lg" variant="outline" className="w-full text-white border-white hover:bg-white hover:text-cap-dark text-lg py-6">
                          Already Have Account? Login
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  <Typography variant="small" className="text-white/80 mt-2">
                    No payment required to create an account and start your application
                  </Typography>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link to="/profile-demo">
                  <Button variant="link" className="text-white underline">
                    View Profile Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* African Pattern Bottom Border */}
        <PatternBorder position="bottom" />
      </div>
    </section>
  );
};

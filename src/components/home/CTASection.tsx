
import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/PatternBorder";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your Future?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of students already on their path to success through South Africa's leading educational institutions.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="text-center md:text-left md:w-1/2 space-y-6">
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <span className="text-lg">Create your student profile</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <span className="text-lg">Upload your documents once</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <span className="text-lg">Apply to multiple institutions</span>
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
                  
                  <p className="text-white/80 text-sm mt-2">
                    No payment required to create an account and start your application
                  </p>
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

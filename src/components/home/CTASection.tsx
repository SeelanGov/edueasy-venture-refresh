
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
      navigate('/register', { state: { from: '/apply' } });
      return;
    }
    
    navigate('/apply');
  };

  return (
    <section className="py-20 px-4 bg-cap-dark text-white">
      <div className="relative overflow-hidden">
        {/* African Pattern Top Border */}
        <PatternBorder position="top" />
        
        <div className="container mx-auto text-center py-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already on their path to success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                size="lg" 
                className="bg-cap-coral text-white hover:bg-cap-coral/90"
                onClick={() => navigate('/apply')}
              >
                Start Application
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-cap-coral text-white hover:bg-cap-coral/90"
                  onClick={handleStartApplication}
                >
                  Register & Apply
                </Button>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-cap-dark">
                    Already Have Account? Login
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="mt-6">
            <Link to="/profile-demo">
              <Button variant="link" className="text-white underline">
                View Profile Demo
              </Button>
            </Link>
          </div>
        </div>
        
        {/* African Pattern Bottom Border */}
        <PatternBorder position="bottom" />
      </div>
    </section>
  );
};

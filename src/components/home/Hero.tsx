
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PatternBorder } from "@/components/PatternBorder";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleStartApplication = () => {
    console.log("Start application clicked, user:", !!user);
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start your application.",
        variant: "destructive",
      });
      // Pass the current location to preserve the intended destination
      navigate('/login', { state: { from: '/apply' } });
      return;
    }
    
    // If user is authenticated, proceed to the application page
    navigate('/apply');
  };

  return (
    <section 
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative pt-16 overflow-hidden"
      style={{
        backgroundImage: "url('/lovable-uploads/ff94423b-eb6f-4168-8c59-c20117e3c378.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* African Pattern Top Border */}
      <div className="absolute top-16 left-0 right-0 z-10">
        <PatternBorder position="top" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center max-w-4xl">
        <div className="bg-cap-dark bg-opacity-60 p-8 rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              {/* Circle background */}
              <div className="absolute inset-0 rounded-full bg-cap-teal border-2 border-cap-coral"></div>
              
              {/* Sun/flower symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <path d="M12 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 18V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4.93 4.93L7.76 7.76" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.24 16.24L19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M2 12H6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4.93 19.07L7.76 16.24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.24 7.76L19.07 4.93" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-wide">
            EduEasy
          </h1>
          
          <div className="w-full max-w-xl mx-auto h-px bg-white my-5"></div>
          
          <p className="text-xl mb-8 uppercase tracking-wide">
            Bridging Education to Employment
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              className="text-lg bg-cap-coral hover:bg-cap-coral/90 text-white px-10 py-6"
              onClick={handleStartApplication}
            >
              START APPLICATION
            </Button>
          </div>
        </div>
        
        <div className="mt-24 animate-bounce">
          <a href="#learn-more" className="text-white flex flex-col items-center">
            <span className="mb-2 uppercase text-sm tracking-wider">LEARN MORE</span>
            <ChevronDown className="h-8 w-8" />
          </a>
        </div>
      </div>

      {/* African Pattern Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <PatternBorder position="bottom" />
      </div>
    </section>
  );
};

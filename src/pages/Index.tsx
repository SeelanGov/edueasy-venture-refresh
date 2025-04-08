import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ChevronDown } from "lucide-react";
import { PatternBorder } from "@/components/PatternBorder";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen bg-cap-dark text-white">
      {/* Header with African Pattern Background */}
      <div className="relative w-full">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            height: "180px"
          }}
        ></div>
        <div className="relative z-10">
          <Navbar />
        </div>
      </div>
      
      {/* Hero Section - Full height with background image */}
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
              <Link to="/apply">
                <Button size="lg" className="text-lg bg-cap-coral hover:bg-cap-coral/90 text-white px-10 py-6">
                  START APPLICATION
                </Button>
              </Link>
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

      {/* Learn More Section */}
      <section id="learn-more" className="py-20 px-4 bg-white text-cap-dark">
        <div className="container mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 bg-cap-teal rounded"></div>
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">
            About EduEasy
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            EduEasy is your gateway to higher education in South Africa.
            We simplify the application process, making it easier for students to apply to multiple institutions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cap-teal flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">One Application</h3>
              <p className="text-gray-600">Apply once for multiple institutions and programs</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cap-teal flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600">Monitor your application status in real-time</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cap-teal flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4">Get Support</h3>
              <p className="text-gray-600">Access guidance throughout your application journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Link to="/register">
                <Button size="lg" className="bg-cap-coral text-white hover:bg-cap-coral/90">
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-cap-dark">
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
          
          {/* African Pattern Bottom Border */}
          <PatternBorder position="bottom" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cap-dark border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-8">
            <Logo size="large" />
            
            <div className="flex space-x-6 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.218-1.504.344-1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
            
            <div className="w-24 h-1 bg-cap-teal rounded my-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center md:text-left">
              <div>
                <h3 className="font-bold text-xl mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>info@edueasy.co.za</li>
                  <li>+27 21 123 4567</li>
                  <li>Cape Town, South Africa</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Universities</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Application Guide</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            
            <p className="text-gray-400 mt-8">© {new Date().getFullYear()} EDUEASY | Bridging Education to Employment</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

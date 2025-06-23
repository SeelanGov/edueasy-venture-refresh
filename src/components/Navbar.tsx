
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleAuthNavigation = () => {
    navigate('/register');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo layout="horizontal" size="small" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-cap-teal font-medium"
              aria-label="Navigate to How It Works section"
            >
              How It Works
            </Button>
            <Link to="/meet-thandi" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              Meet Thandi
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/institutions" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              For Institutions
            </Link>
            <Button 
              variant="primary"
              onClick={handleAuthNavigation} 
              className="font-medium px-6 py-2 min-w-[120px] h-10"
              aria-label="Get started with registration"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:bg-gray-100"
              aria-label="Toggle mobile menu"
              aria-expanded={isOpen}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <Logo layout="horizontal" size="medium" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:bg-gray-100"
                aria-label="Close mobile menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Mobile Menu Items */}
            <div className="flex flex-col px-6 py-8 space-y-6 bg-white min-h-screen">
              <Button 
                variant="ghost"
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-800 hover:text-cap-teal text-lg font-medium text-left py-3 border-b border-gray-100 justify-start"
              >
                How It Works
              </Button>
              <Link
                to="/meet-thandi"
                className="text-gray-800 hover:text-cap-teal transition-colors text-lg font-medium py-3 border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Meet Thandi
              </Link>
              <Link
                to="/pricing"
                className="text-gray-800 hover:text-cap-teal transition-colors text-lg font-medium py-3 border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/institutions"
                className="text-gray-800 hover:text-cap-teal transition-colors text-lg font-medium py-3 border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                For Institutions
              </Link>
              
              {/* Mobile CTA Button */}
              <div className="pt-6">
                <Button 
                  variant="primary"
                  onClick={handleAuthNavigation}
                  className="font-medium w-full py-4 text-lg rounded-lg shadow-sm"
                  aria-label="Get started with registration"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

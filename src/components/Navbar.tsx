
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
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-cap-teal transition-colors font-medium"
            >
              How It Works
            </button>
            <Link to="/meet-thandi" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              Meet Thandi
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/career-guidance" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              Career Guidance
            </Link>
            <Link to="/consultations" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              Consultations
            </Link>
            <Link to="/institutions" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              For Institutions
            </Link>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-cap-teal transition-colors font-medium"
            >
              Success Stories
            </button>
            <Link to="/faqs" className="text-gray-700 hover:text-cap-teal transition-colors font-medium">
              FAQs
            </Link>
            <Button onClick={handleAuthNavigation} className="bg-cap-teal hover:bg-cap-teal/90">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <Logo layout="horizontal" size="medium" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex flex-col space-y-8 items-center justify-center flex-1 text-gray-800">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
              >
                HOW IT WORKS
              </button>
              <Link
                to="/meet-thandi"
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                MEET THANDI
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                PRICING
              </Link>
              <Link
                to="/career-guidance"
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                CAREER GUIDANCE
              </Link>
              <Link
                to="/consultations"
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                CONSULTATIONS
              </Link>
              <Link
                to="/institutions"
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                FOR INSTITUTIONS
              </Link>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
              >
                SUCCESS STORIES
              </button>
              <Link
                to="/faqs"
                className="text-gray-700 hover:text-cap-teal transition-colors text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                FAQS
              </Link>
              <Button 
                onClick={handleAuthNavigation}
                className="bg-cap-teal hover:bg-cap-teal/90 text-xl font-medium px-8 py-3"
              >
                GET STARTED
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


import { Button } from "@/components/ui/button";
import { X, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-cap-teal transition-colors"
            >
              How It Works
            </button>
            <Link to="/meet-thandi" className="text-gray-700 hover:text-cap-teal transition-colors">
              Meet Thandi
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-cap-teal transition-colors">
              Pricing
            </Link>
            <Link to="/institutions" className="text-gray-700 hover:text-cap-teal transition-colors">
              For Institutions
            </Link>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-cap-teal transition-colors"
            >
              Success Stories
            </button>
            <Link to="/faqs" className="text-gray-700 hover:text-cap-teal transition-colors">
              FAQs
            </Link>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-cap-teal transition-colors"
            >
              Contact
            </button>

            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-cap-teal">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-cap-teal text-cap-teal hover:bg-cap-teal/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="mr-2 border-cap-teal text-cap-teal hover:bg-cap-teal/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-cap-teal hover:bg-cap-teal/90 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
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
          <div className="fixed inset-0 bg-white z-50 flex flex-col p-5">
            <div className="flex justify-between items-center">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col space-y-6 items-center justify-center h-full text-gray-800 text-xl">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-cap-teal"
              >
                HOW IT WORKS
              </button>
              <Link
                to="/meet-thandi"
                className="text-gray-700 hover:text-cap-teal"
                onClick={() => setIsOpen(false)}
              >
                MEET THANDI
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-cap-teal"
                onClick={() => setIsOpen(false)}
              >
                PRICING
              </Link>
              <Link
                to="/institutions"
                className="text-gray-700 hover:text-cap-teal"
                onClick={() => setIsOpen(false)}
              >
                FOR INSTITUTIONS
              </Link>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-cap-teal"
              >
                SUCCESS STORIES
              </button>
              <Link
                to="/faqs"
                className="text-gray-700 hover:text-cap-teal"
                onClick={() => setIsOpen(false)}
              >
                FAQS
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-cap-teal"
              >
                CONTACT
              </button>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-cap-teal"
                    onClick={() => setIsOpen(false)}
                  >
                    DASHBOARD
                  </Link>
                  <Button
                    className="bg-cap-teal hover:bg-cap-teal/90 text-white mt-4"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    LOGOUT
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      className="bg-cap-teal hover:bg-cap-teal/90 text-white mt-4"
                      onClick={() => setIsOpen(false)}
                    >
                      GET STARTED
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-cap-teal text-cap-teal hover:bg-cap-teal/10"
                      onClick={() => setIsOpen(false)}
                    >
                      LOGIN
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

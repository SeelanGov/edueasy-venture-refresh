
import { Button } from "@/components/ui/button";
import { X, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-cap-dark text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-cap-teal">Home</Link>
            <Link to="/#about" className="text-white hover:text-cap-teal">About</Link>
            <Link to="/#services" className="text-white hover:text-cap-teal">Services</Link>
            <Link to="/#contact" className="text-white hover:text-cap-teal">Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-cap-teal">Dashboard</Link>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-cap-dark"
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
                  <Button variant="outline" className="mr-2 border-white text-white hover:bg-white hover:text-cap-dark">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-cap-coral hover:bg-cap-coral/90 text-white">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-cap-teal z-50 flex flex-col p-5">
            <div className="flex justify-between items-center">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col space-y-6 items-center justify-center h-full text-white text-xl">
              <Link to="/" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>HOME</Link>
              <Link to="/#about" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>ABOUT</Link>
              <Link to="/#services" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>SERVICES</Link>
              <Link to="/#contact" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>CONTACT</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>DASHBOARD</Link>
                  <Button 
                    className="bg-cap-coral hover:bg-cap-coral/90 text-white mt-4"
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
                      className="bg-cap-coral hover:bg-cap-coral/90 text-white mt-4" 
                      onClick={() => setIsOpen(false)}
                    >
                      REGISTER
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-cap-dark" 
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

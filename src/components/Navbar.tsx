
import { Button } from "@/components/ui/button";
import { X, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import AdminButton from "./admin/AdminButton";
import PartnerButton from "./ui/PartnerButton";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Navbar rendering with user:", !!user);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleStartApplication = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start your application.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/apply' } });
      return;
    }
    
    navigate('/apply');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
            <Link to="/#about" className="text-gray-700 hover:text-primary">About</Link>
            <Link to="/#services" className="text-gray-700 hover:text-primary">Services</Link>
            <Link to="/#contact" className="text-gray-700 hover:text-primary">Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary">Dashboard</Link>
                {user?.role === "admin" && (
                  <AdminButton onClick={() => navigate("/admin/dashboard")}>Admin Dashboard</AdminButton>
                )}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white"
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
                  <Button variant="outline" className="mr-2 border-primary text-primary hover:bg-primary hover:text-white">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-cap-coral hover:bg-cap-coral/90 text-white">Register</Button>
                </Link>
              </>
            )}
            <PartnerButton className="ml-4" onClick={() => navigate("/partner/register")}>Partner Registration</PartnerButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col p-5">
            <div className="flex justify-between items-center">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-700">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col space-y-6 items-center justify-center h-full text-gray-800 text-xl">
              <Link to="/" className="text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>HOME</Link>
              <Link to="/#about" className="text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>ABOUT</Link>
              <Link to="/#services" className="text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>SERVICES</Link>
              <Link to="/#contact" className="text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>CONTACT</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>DASHBOARD</Link>
                  {user?.role === "admin" && (
                    <AdminButton onClick={() => {
                      navigate("/admin/dashboard");
                      setIsOpen(false);
                    }}>Admin Dashboard</AdminButton>
                  )}
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
                      className="border-primary text-primary hover:bg-primary hover:text-white" 
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

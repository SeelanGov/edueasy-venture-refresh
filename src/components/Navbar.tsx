
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-cap-dark text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-heading font-bold text-2xl">
            CAP
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-cap-teal">Home</a>
            <a href="#about" className="text-white hover:text-cap-teal">About</a>
            <a href="#services" className="text-white hover:text-cap-teal">Services</a>
            <a href="#contact" className="text-white hover:text-cap-teal">Contact</a>
            <Button variant="outline" className="mr-2 border-white text-white hover:bg-white hover:text-cap-dark">Login</Button>
            <Button className="bg-cap-coral hover:bg-cap-coral/90 text-white">Register</Button>
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
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col space-y-6 items-center justify-center h-full text-white text-xl">
              <a href="#home" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>HOME</a>
              <a href="#about" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>REGISTER</a>
              <a href="#services" className="text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>LOGIN</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

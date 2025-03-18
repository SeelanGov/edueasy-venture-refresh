
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-heading font-bold text-2xl text-primary">
            EduEasy
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary">How it Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary">Pricing</a>
            <Button variant="outline" className="mr-2">Log In</Button>
            <Button>Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-primary px-4 py-2">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary px-4 py-2">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary px-4 py-2">Pricing</a>
              <div className="flex flex-col space-y-2 px-4">
                <Button variant="outline" className="w-full">Log In</Button>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

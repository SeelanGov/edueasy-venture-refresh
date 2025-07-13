import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Building2, DollarSign, FileCheck, GraduationCap, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const partnerTypes = [
  {
    name: 'TVET Colleges',
    description: 'Technical and Vocational Education Training institutions',
    icon: GraduationCap,
    route: '/institutions/register',
    loginRoute: '/institutions/login',
    userType: 'institution'
  },
  {
    name: 'Universities',
    description: 'Higher education institutions',
    icon: Building2,
    route: '/institutions/register',
    loginRoute: '/institutions/login',
    userType: 'institution'
  },
  {
    name: 'Bursary Sponsors',
    description: 'Organizations providing financial support',
    icon: DollarSign,
    route: '/sponsors/register',
    loginRoute: '/sponsors/login',
    userType: 'sponsor'
  },
  {
    name: 'NSFAS',
    description: 'National Student Financial Aid Scheme',
    icon: FileCheck,
    route: '/nsfas/register',
    loginRoute: '/nsfas/login',
    userType: 'nsfas'
  },
  {
    name: 'Guidance Counselors',
    description: 'Career and educational guidance professionals',
    icon: Users,
    route: '/counselors/register',
    loginRoute: '/counselors/login',
    userType: 'consultant'
  },
  {
    name: 'Students',
    description: 'Students seeking educational opportunities',
    icon: Users,
    route: '/register',
    loginRoute: '/students/login',
    userType: 'student'
  }
];

export function Footer() {
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const { user, userType } = useAuth();
  const navigate = useNavigate();

  const handlePartnerSelect = (partner: typeof partnerTypes[0], isLogin: boolean = false) => {
    if (user && userType === partner.userType) {
      navigate('/auth-redirect');
    } else {
      navigate(isLogin ? partner.loginRoute : partner.route);
    }
    setIsPartnerModalOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-cap-coral mb-4">EduEasy</h3>
              <p className="text-gray-300 leading-relaxed">
                Building the future of education and career development in South Africa. Connecting
                students with opportunities since 2024.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold mb-3">Contact Info</h4>
              <div className="flex items-center gap-3 text-gray-300">
                <span>info@edueasy.co</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <span>Cape Town, South Africa</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200 p-0 h-auto font-normal"
                >
                  How It Works
                </Button>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Student Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/career-guidance" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link to="/consultations" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  Consultations
                </Link>
              </li>
              <li>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200 p-0 h-auto font-normal"
                >
                  Success Stories
                </Button>
              </li>
              <li>
                <Link to="/sponsorships" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  Sponsorships
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Access & Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Resources & Legal</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/partner-dashboard" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  EduEasy Admin
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-cap-teal transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-cap-teal transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-cap-teal transition-colors duration-200">
                  Refund Policy
                </Link>
              </li>
            </ul>
            
            <div className="space-y-3">
              <h5 className="text-md font-semibold text-white">Partner Access</h5>
              <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                    data-testid="partner-access-trigger"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Partner Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md md:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Partner Access</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Existing Partner</TabsTrigger>
                      <TabsTrigger value="register">New Partner</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="mt-4">
                      <h3 className="text-lg font-semibold mb-4">Login to Your Account</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {partnerTypes.map((partner) => {
                          const Icon = partner.icon;
                          return (
                            <Button
                              key={`login-${partner.name}`}
                              variant="outline"
                              className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent"
                              onClick={() => handlePartnerSelect(partner, true)}
                              data-testid={`partner-login-${partner.userType}`}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{partner.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{partner.description}</p>
                            </Button>
                          );
                        })}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="register" className="mt-4">
                      <h3 className="text-lg font-semibold mb-4">Create New Partner Account</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {partnerTypes.map((partner) => {
                          const Icon = partner.icon;
                          return (
                            <Button
                              key={`register-${partner.name}`}
                              variant="outline"
                              className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent"
                              onClick={() => handlePartnerSelect(partner, false)}
                              data-testid={`partner-register-${partner.userType}`}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{partner.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{partner.description}</p>
                            </Button>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 EduEasy. All rights reserved. Building the future of South African education.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-cap-teal rounded-full"></div>
                <span className="text-sm">Growing our student community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

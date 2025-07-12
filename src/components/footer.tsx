import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    userType: 'institution'
  },
  {
    name: 'Universities',
    description: 'Higher education institutions',
    icon: Building2,
    route: '/institutions/register',
    userType: 'institution'
  },
  {
    name: 'Bursary Sponsors',
    description: 'Organizations providing financial support',
    icon: DollarSign,
    route: '/sponsors/register',
    userType: 'sponsor'
  },
  {
    name: 'NSFAS',
    description: 'National Student Financial Aid Scheme',
    icon: FileCheck,
    route: '/nsfas/register',
    userType: 'nsfas'
  },
  {
    name: 'Guidance Counselors',
    description: 'Career and educational guidance professionals',
    icon: Users,
    route: '/counselors/register',
    userType: 'counselor'
  }
];

export function Footer() {
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const { user, userType } = useAuth();
  const navigate = useNavigate();

  const handlePartnerSelect = (partner: typeof partnerTypes[0]) => {
    if (user && userType === partner.userType) {
      navigate('/dashboard');
    } else {
      navigate(partner.route);
    }
    setIsPartnerModalOpen(false);
  };

  return (
    <footer className="bg-background border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">EduEasy</h3>
            <p className="text-muted-foreground">
              Simplifying education access and opportunities for students across South Africa.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-muted-foreground hover:text-primary transition-colors">
                  Subscription
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Partner Access</h3>
            <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="partner-access-trigger"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Partner Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md md:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Your Organization Type</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {partnerTypes.map((partner) => {
                    const Icon = partner.icon;
                    return (
                      <Button
                        key={partner.name}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent"
                        onClick={() => handlePartnerSelect(partner)}
                        data-testid={`partner-${partner.userType}`}
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
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
            <p className="text-muted-foreground">
              Email: info@edueasy.co
            </p>
            <p className="text-muted-foreground">
              Cape Town, South Africa
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

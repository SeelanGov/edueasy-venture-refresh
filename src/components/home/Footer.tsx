import { Button } from '@/components/ui/button';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/hooks/useAuth';
import { Building2, DollarSign, FileCheck, GraduationCap, Mail, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const _partnerTypes = [
  {
    name: 'TVET Colleges',
    description: 'Technical and Vocational Education Training institutions',
    icon: GraduationCap,
    route: '/institutions/register',
    userType: 'institution',
  },
  {
    name: 'Universities',
    description: 'Higher education institutions',
    icon: Building2,
    route: '/institutions/register',
    userType: 'institution',
  },
  {
    name: 'Bursary Sponsors',
    description: 'Organizations providing financial support',
    icon: DollarSign,
    route: '/sponsors/register',
    userType: 'sponsor',
  },
  {
    name: 'NSFAS',
    description: 'National Student Financial Aid Scheme',
    icon: FileCheck,
    route: '/nsfas/register',
    userType: 'nsfas',
  },
  {
    name: 'Guidance Counselors',
    description: 'Career and educational guidance professionals',
    icon: Users,
    route: '/counselors/register',
    userType: 'consultant',
  },
];

const Footer = (): void => {
  const [_isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userType } = useAuth();
  const { isAdmin } = useAdminRole();

  const scrollToSection = (sectionId: string): void => {
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
  };

  const _handlePartnerSelect = (partner: (typeof _partnerTypes)[0]) => {
    // If user is already logged in with this user type, redirect to auth-redirect
    if (user && userType === partner.userType) {
      navigate('/auth-redirect');
    } else {
      // Navigate to registration/login flow
      navigate(partner.route);
    }
    setIsPartnerModalOpen(false);
  };

  const _handleAdminAccess = (): void => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/login');
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
                <Mail className="h-4 w-4 text-cap-teal flex-shrink-0" />
                <span>info@edueasy.co</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-cap-teal flex-shrink-0" />
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
                <Link
                  to="/meet-thandi"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  Meet Thandi
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/institutions"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  For Institutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Student Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/career-guidance"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link
                  to="/consultations"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
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
                <Link
                  to="/faqs"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/sponsorships"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  Sponsorships
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Access */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Resources & Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/partner-dashboard"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  EduEasy Admin
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="block text-gray-300 hover:text-cap-teal transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="block text-gray-300 hover:text-cap-teal transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-300 hover:text-cap-teal transition-colors duration-200"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 EduEasy. All rights reserved. Building the future of South African
              education.
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
};

export default Footer;

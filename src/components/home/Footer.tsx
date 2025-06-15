
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
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
  };

  return (
    <footer className="bg-cap-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-cap-coral mb-4">EduEasy</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Your trusted partner in education and career development. Connecting students with opportunities across South Africa.
            </p>
            
            <div className="space-y-2">
              <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
              <p className="text-gray-300">
                <strong>Email:</strong> info@edueasy.co.za
              </p>
              <p className="text-gray-300">
                <strong>Phone:</strong> +27 21 123 4567
              </p>
              <p className="text-gray-300">
                <strong>Address:</strong> Cape Town, South Africa
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-cap-coral transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <Link to="/meet-thandi" className="hover:text-cap-coral transition-colors">
                  Meet Thandi
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-cap-coral transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/institutions" className="hover:text-cap-coral transition-colors">
                  For Institutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Student Services</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/career-guidance" className="hover:text-cap-coral transition-colors">
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link to="/consultations" className="hover:text-cap-coral transition-colors">
                  Consultations
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="hover:text-cap-coral transition-colors text-left"
                >
                  Success Stories
                </button>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-cap-coral transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/sponsorships" className="hover:text-cap-coral transition-colors">
                  Sponsorships
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources & Legal</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/partner-dashboard" className="hover:text-cap-coral transition-colors">
                  EduEasy Admin
                </Link>
              </li>
              <li>
                <a 
                  href="/privacy-policy.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cap-coral transition-colors inline-flex items-center gap-1"
                >
                  Privacy Policy <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="/terms-of-service.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cap-coral transition-colors inline-flex items-center gap-1"
                >
                  Terms of Service <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EduEasy. All rights reserved. Empowering South African students since 2024.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

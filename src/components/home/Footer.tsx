
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cap-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EduEasy</h3>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner in education and career development. Connecting students with opportunities across South Africa.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:text-cap-coral transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-cap-coral transition-colors">Programs</Link></li>
              <li><Link to="/funding" className="hover:text-cap-coral transition-colors">Funding</Link></li>
              <li><Link to="/career-guidance" className="hover:text-cap-coral transition-colors">Career Guidance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/help" className="hover:text-cap-coral transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-cap-coral transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-cap-coral transition-colors">FAQ</Link></li>
              <li><a href="tel:+27800123456" className="hover:text-cap-coral transition-colors">0800 123 456</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
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

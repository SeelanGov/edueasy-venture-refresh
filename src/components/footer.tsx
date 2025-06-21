
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-cap-teal">EduEasy</h3>
            <p className="text-gray-600">
              Simplifying education access and opportunities for students across South Africa.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-cap-teal">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-cap-teal">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-gray-600 hover:text-cap-teal">
                  Subscription
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-cap-teal">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
            <p className="text-gray-600">
              Email: info@edueasy.co
            </p>
            <p className="text-gray-600">
              Cape Town, South Africa
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EduEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

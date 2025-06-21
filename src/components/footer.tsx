
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EduEasy</h3>
            <p className="text-slate-300">
              Simplifying education access and opportunities for students worldwide.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-slate-300 hover:text-white">
                  Apply
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-slate-300 hover:text-white">
                  Subscription
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-slate-300">
              Email: info@edueasy.co
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-4 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} EduEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

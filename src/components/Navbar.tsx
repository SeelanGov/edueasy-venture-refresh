
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-4 px-6">
      <Link to="/" className="text-2xl font-bold text-primary">
        EduEasy
      </Link>
      
      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/register">
          <Button>Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};

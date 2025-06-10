
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="py-24 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
          Your Gateway to Higher Education
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          EduEasy connects South African students with educational opportunities through secure ID verification and personalized guidance.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="px-8">Start Your Journey</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="px-8">Sign In</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

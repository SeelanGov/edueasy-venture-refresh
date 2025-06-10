
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-primary text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Educational Journey?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of students who trust EduEasy for their higher education applications.
        </p>
        <Link to="/register">
          <Button size="lg" variant="secondary" className="px-8">
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

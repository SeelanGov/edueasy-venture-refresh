
import { ChevronDown } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';

export const Hero = () => {
  return (
    <section id="home" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-64 bg-repeat"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-repeat"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <HeroImage />
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="#how-it-works"
            className="flex flex-col items-center text-gray-500 animate-bounce hover:text-primary transition-colors"
          >
            <Typography variant="small" className="mb-2">
              EXPLORE MORE
            </Typography>
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

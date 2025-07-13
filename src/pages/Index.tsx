import { Navbar } from '@/components/Navbar';
import { JourneyMapDemo } from '@/components/demo/JourneyMapDemo';
import { AISupportSection } from '@/components/home/AISupportSection';
import { AboutSection } from '@/components/home/AboutSection';
import { CTASection } from '@/components/home/CTASection';
import { CommunitySection } from '@/components/home/CommunitySection';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { PartnersSection } from '@/components/home/PartnersSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto">
          <Navbar />
        </div>
      </div>

      {/* Main Content Sections */}
      <Hero />
      <AISupportSection />
      <HowItWorks />
      <CommunitySection />
      <AboutSection />

      {/* Partner With EduEasy Section (Add navigation to button) */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            Partner With EduEasy
          </h2>
          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-xl">
            {/* You can optionally keep the image here */}
            {/* <img src="/images/some-partner-image.png" alt="Partner Institutions" className="w-full h-auto object-cover" /> */}
          </div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Join our network of leading educational institutions and help students achieve their
            academic goals through streamlined applications.
          </p>
          <Button
            className="mt-8 px-8 py-3 rounded-full bg-cap-teal text-white font-bold hover:bg-cap-teal/90 transition"
            onClick={() => navigate('/institutions')}
          >
            Become a Partner
          </Button>
        </div>
      </div>

      {/* Journey Map Demo Section */}
      <div className="bg-gray-50 py-24 relative overflow-hidden">
        {/* Background dots pattern */}
        <div
          className="absolute right-0 top-0 h-64 w-1/3 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute left-0 bottom-0 h-64 w-1/3 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Your Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Profile Completion Journey
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Track your application progress with our intuitive journey map
            </p>
          </div>
          <JourneyMapDemo />
        </div>
      </div>

      <TestimonialsSection />
      <PartnersSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;

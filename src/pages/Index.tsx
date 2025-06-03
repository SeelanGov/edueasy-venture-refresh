
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { CTASection } from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import { JourneyMapDemo } from '@/components/demo/JourneyMapDemo';

const Index = () => {
  console.log('Index page rendering');

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
      <HowItWorks />
      <AboutSection />

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


import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";
import { JourneyMapDemo } from "@/components/demo/JourneyMapDemo";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen bg-cap-dark text-white">
      {/* Header with African Pattern Background */}
      <div className="relative w-full">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            height: "180px"
          }}
        ></div>
        <div className="relative z-10">
          <Navbar />
        </div>
      </div>
      
      {/* Main Content Sections */}
      <Hero />
      <HowItWorks />
      <AboutSection />
      
      {/* Add Journey Map Demo Section */}
      <div className="bg-white text-black py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Profile Completion Journey</h2>
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

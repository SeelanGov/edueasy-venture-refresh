import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { HowItWorksStepper } from '@/components/sponsorships/HowItWorksStepper';
import { ImpactStats } from '@/components/sponsorships/ImpactStats';
import { TestimonialsSection } from '@/components/sponsorships/TestimonialsSection';
import { FAQCollapsible } from '@/components/sponsorships/FAQCollapsible';

// Updated hero image for the sponsorship page
const heroImage = "/lovable-uploads/627f1a36-dcfa-4632-9754-386f9262dac6.png";

const SponsorshipsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cap-teal/10 via-white to-cap-coral/10 py-0 px-0 relative">
      {/* HERO SECTION */}
      <div className="container max-w-4xl mx-auto px-4 pt-14 pb-10 md:pb-16 text-center relative">
        <div className="flex flex-col items-center gap-6">
          <Typography variant="h1" className="font-extrabold tablet-heading text-cap-teal drop-shadow mb-2">
            The EduEasy Sponsor Ecosystem
          </Typography>
          <Typography variant="lead" className="text-gray-600 mb-2 max-w-2xl mx-auto">
            Connecting students in need with individuals and organizations that care.<br />
            Find or provide financial assistance for education—<strong>securely and simply</strong>.
          </Typography>
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-cap-teal/20 bg-white">
            <img
              src={heroImage}
              alt="African students receiving mentorship"
              className="w-full h-56 sm:h-64 object-cover object-center"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center my-4">
            <Button
              className="w-full md:w-auto text-white bg-cap-teal hover:bg-cap-teal/90 shadow-lg"
              size="lg"
              onClick={() => navigate("/sponsorships/apply")}
            >
              Apply for Sponsorship
            </Button>
            <Button
              className="w-full md:w-auto bg-cap-coral hover:bg-cap-coral/90 text-white shadow-lg"
              size="lg"
              onClick={() => navigate("/sponsors/register")}
            >
              Become a Sponsor
            </Button>
          </div>
        </div>
      </div>

      {/* IMPACT METRICS */}
      <div className="container mx-auto px-4">
        <ImpactStats />
      </div>

      {/* HOW IT WORKS STEPPER */}
      <div className="bg-white/90 py-10 px-2">
        <Typography variant="h2" className="text-center mb-2 font-bold text-cap-teal">
          How It Works
        </Typography>
        <HowItWorksStepper />
      </div>

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* FAQ */}
      <div className="container mx-auto py-9 px-4">
        <Typography variant="h2" className="text-center mb-4 font-bold text-cap-teal">
          Frequently Asked Questions
        </Typography>
        <FAQCollapsible />
      </div>
    </div>
  );
};

export default SponsorshipsPage;

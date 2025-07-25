import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Typography } from '@/components/ui/typography';
import { StatisticsGrid } from './StatisticsGrid';

const universities = [
  'University of Cape Town',
  'University of Pretoria',
  'University of Witwatersrand',
  'Stellenbosch University',
  'University of Johannesburg',
  'Rhodes University',
];


/**
 * PartnersSection
 * @description Function
 */
export const PartnersSection = (): void => {
  // Use the uploaded image for the section illustration
  const imagePath = '/lovable-uploads/ff2bcb31-3f70-423b-a4e0-4483fff9d5f6.png';

  return (
    <section className="py-20 px-4 md:py-24 bg-white relative">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 md:w-20 md:h-1.5 bg-cap-coral rounded"></div>
          </div>
          <Typography variant="h2" className="mb-4 md:text-4xl text-gray-900">
            Building Educational Partnerships
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            We're working to collaborate with South Africa's leading universities and institutions
          </Typography>
        </div>

        {/* Section as Grid: Image (left) + Collaboration message (right) */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto mb-12">
          {/* Image Illustration with enhanced quality */}
          <div className="w-full flex justify-center md:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-xl w-full max-w-sm group">
              <OptimizedImage
                src={imagePath}
                alt="Confident graduate blowing confetti at camera, wearing cap and gown"
                className="w-full h-auto object-cover object-center rounded-2xl transition duration-300 group-hover:scale-105 group-hover:contrast-105 group-hover:saturate-150"
                style={{ maxHeight: 340, imageRendering: 'auto' }}
                skeletonClassName="w-full h-64 rounded-2xl"
                fallbackSrc="/images/journey-bg.png"
                priority={false}
              />
              {/* Add a soft overlay for crispness & contrast */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-cap-teal/10 pointer-events-none" />
              {/* Optional: Add a border for extra sharpness */}
              <div className="absolute inset-0 rounded-2xl border border-teal-200/60 pointer-events-none" />
            </div>
          </div>
          {/* Collaboration Notice and Universities List */}
          <div className="text-center md:text-left">
            <Typography variant="h4" className="mb-2 text-cap-coral font-semibold">
              we are working to collaborate with
            </Typography>
            <ul className="list-disc list-inside text-gray-700 mt-4 text-lg text-left inline-block">
              {universities.map((university) => (
                <li key={university}>{university}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partnership Goals */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Typography variant="h3" className="text-cap-coral mb-2">
              Our Partnership Goals for 2025
            </Typography>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Building towards these targets to better serve South African students
            </Typography>
          </div>

          <StatisticsGrid
            selectedStats={[
              'partnerInstitutions',
              'successfulApplications',
              'applicationSuccessRate',
            ]}
            variant="default"
            columns={3}
            className="max-w-4xl mx-auto"
            animateOnScroll={true}
          />
        </div>

        {/* Call to Action for Institutions */}
        <div className="text-center bg-gradient-to-r from-cap-teal/5 via-white to-cap-coral/5 rounded-2xl p-8 md:p-12 border border-gray-100">
          <Typography variant="h3" className="mb-4 text-gray-900">
            Partner With EduEasy
          </Typography>
          <Typography variant="body-lg" className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our growing network of educational institutions and help students achieve their
            academic goals through streamlined applications.
          </Typography>
          <Button className="bg-cap-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-cap-teal/90 transition-colors shadow-sm">
            Become a Partner
          </Button>
        </div>
      </div>
    </section>
  );
};

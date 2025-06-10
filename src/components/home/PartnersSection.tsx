
import { Typography } from '@/components/ui/typography';

const partnerLogos = [
  { name: 'University of Cape Town', logo: '/images/partner-logos/uct.webp' },
  { name: 'University of Pretoria', logo: '/images/partner-logos/pretoria.webp' },
  { name: 'University of Witwatersrand', logo: '/images/partner-logos/wits.webp' },
  { name: 'Stellenbosch University', logo: '/images/partner-logos/stellenbosch.webp' },
  { name: 'University of Johannesburg', logo: '/images/partner-logos/johannesburg.webp' },
  { name: 'Rhodes University', logo: '/images/partner-logos/rhodes.webp' },
];

export const PartnersSection = () => {
  return (
    <section className="py-20 px-4 md:py-24 bg-white relative">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 md:w-20 md:h-1.5 bg-cap-coral rounded"></div>
          </div>
          <Typography variant="h2" className="mb-4 md:text-4xl text-gray-900">
            Trusted Educational Partners
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            We collaborate with South Africa's leading universities and institutions to provide seamless application experiences
          </Typography>
        </div>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 max-w-6xl mx-auto mb-16">
          {partnerLogos.map((partner, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-cap-teal/20 transition-all duration-300 group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 w-auto object-contain filter transition-all duration-300 group-hover:scale-105"
                title={partner.name}
              />
            </div>
          ))}
        </div>

        {/* Partnership Stats */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-cap-teal/5 to-cap-teal/10 rounded-xl border border-cap-teal/10">
            <div className="text-3xl font-bold text-cap-teal mb-2">15+</div>
            <div className="text-gray-700 font-medium">Partner Universities</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-cap-coral/5 to-cap-coral/10 rounded-xl border border-cap-coral/10">
            <div className="text-3xl font-bold text-cap-coral mb-2">100+</div>
            <div className="text-gray-700 font-medium">Programs Available</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-cap-teal/5 to-cap-teal/10 rounded-xl border border-cap-teal/10">
            <div className="text-3xl font-bold text-cap-teal mb-2">98%</div>
            <div className="text-gray-700 font-medium">Integration Success</div>
          </div>
        </div>

        {/* Call to Action for Institutions */}
        <div className="text-center bg-gradient-to-r from-cap-teal/5 via-white to-cap-coral/5 rounded-2xl p-8 md:p-12 border border-gray-100">
          <Typography variant="h3" className="mb-4 text-gray-900">
            Partner With EduEasy
          </Typography>
          <Typography variant="body-lg" className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our network of leading educational institutions and help students achieve their academic goals through streamlined applications.
          </Typography>
          <button className="bg-cap-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-cap-teal/90 transition-colors shadow-sm">
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
};

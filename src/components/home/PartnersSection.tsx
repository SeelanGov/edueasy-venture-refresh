
import PatternBorder from '@/components/PatternBorder';

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
    <section className="py-16 px-4 bg-cap-dark text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0">
        <PatternBorder position="top" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Our Educational Partners
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-300">
            EduEasy works with South Africa's top universities to streamline the application process
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partnerLogos.map((partner, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                title={partner.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <PatternBorder position="bottom" />
      </div>
    </section>
  );
};

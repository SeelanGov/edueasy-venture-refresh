export default function TrustStrip() {
  const partners = [
    "University of Cape Town", 
    "Stellenbosch University",
    "University of the Witwatersrand", 
    "NSFAS",
    "SETA",
    "Department of Higher Education"
  ];

  return (
    <section className="py-12 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold leading-6 text-neutral-600 mb-8">
          Trusted by leading institutions and organizations
        </p>
        
        <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-6 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                {partner}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            and 200+ other institutions nationwide
          </p>
        </div>
      </div>
    </section>
  );
}

import { Typography } from '@/components/ui/typography';

const Institutions = () => {
  const institutions = [
    {
      name: "University of Cape Town",
      type: "University",
      location: "Cape Town, Western Cape",
      programs: "Medicine, Engineering, Business, Law"
    },
    {
      name: "University of the Witwatersrand",
      type: "University", 
      location: "Johannesburg, Gauteng",
      programs: "Mining Engineering, Medicine, Commerce"
    },
    {
      name: "Stellenbosch University",
      type: "University",
      location: "Stellenbosch, Western Cape", 
      programs: "Agriculture, Engineering, Medicine"
    },
    {
      name: "University of Pretoria",
      type: "University",
      location: "Pretoria, Gauteng",
      programs: "Veterinary Science, Engineering, Law"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4">
            Partner Institutions
          </Typography>
          <Typography variant="lead" className="text-gray-600">
            Discover the universities and colleges in our network
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((institution, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <Typography variant="h3" className="mb-2">
                {institution.name}
              </Typography>
              <Typography variant="small" className="text-gray-500 mb-2">
                {institution.type} • {institution.location}
              </Typography>
              <Typography variant="p" className="text-gray-600">
                <strong>Popular Programs:</strong> {institution.programs}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Institutions;

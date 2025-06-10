
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

const SponsorshipsPage = () => {
  const sponsorships = [
    {
      title: "Academic Excellence Scholarship",
      amount: "R50,000",
      duration: "1 Year",
      requirements: "Minimum 80% average, Financial need assessment"
    },
    {
      title: "STEM Innovation Grant", 
      amount: "R75,000",
      duration: "2 Years",
      requirements: "STEM field study, Innovation project proposal"
    },
    {
      title: "Community Leadership Bursary",
      amount: "R40,000", 
      duration: "1 Year",
      requirements: "Community service record, Leadership experience"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4">
            Scholarships & Sponsorships
          </Typography>
          <Typography variant="lead" className="text-gray-600">
            Financial support to help you achieve your educational goals
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sponsorships.map((scholarship, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <Typography variant="h3" className="mb-3">
                {scholarship.title}
              </Typography>
              <div className="space-y-2 mb-4">
                <Typography variant="p" className="text-primary font-semibold">
                  {scholarship.amount}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Duration: {scholarship.duration}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Requirements: {scholarship.requirements}
                </Typography>
              </div>
              <Button className="w-full">
                Apply Now
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Typography variant="h2" className="mb-4">
            Need More Information?
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-6">
            Our team is here to help you find the right financial support for your education.
          </Typography>
          <Button size="lg">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipsPage;

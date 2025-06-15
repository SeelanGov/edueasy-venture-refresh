
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SponsorshipsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <Typography variant="h1" className="mb-2">
            The EduEasy Sponsor Ecosystem
          </Typography>
          <Typography variant="lead" className="text-gray-600 mb-6">
            Connecting students in need with individuals and organizations that care. <br />
            Find or provide financial assistance for education—securely and simply.
          </Typography>
        </div>

        {/* How It Works Section */}
        <section className="mb-12">
          <Typography variant="h2" className="mb-3 text-center">
            How It Works
          </Typography>
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="flex-1 bg-white rounded-lg shadow-sm px-6 py-5">
              <Typography variant="h3" className="mb-2">For Students</Typography>
              <ul className="text-gray-700 space-y-2 text-base">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-[2px]" /> Apply for sponsorship of your application fee
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-[2px]" /> Track your sponsorship status in your dashboard
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-[2px]" /> Get matched with a sponsor and pursue your dream
                </li>
              </ul>
              <div className="flex flex-col md:flex-row gap-3 mt-5">
                <Button className="w-full md:w-auto" onClick={() => navigate("/sponsorships/apply")}>
                  Apply for Sponsorship
                </Button>
                <Button
                  className="w-full md:w-auto bg-cap-coral hover:bg-cap-coral/90"
                  onClick={() => navigate("/sponsorships/status")}
                >
                  Check My Status
                </Button>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm px-6 py-5">
              <Typography variant="h3" className="mb-2">For Sponsors</Typography>
              <ul className="text-gray-700 space-y-2 text-base">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-[2px]" /> Register your profile or organization with EduEasy
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-[2px]" /> Review and sponsor student fee requests
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-[2px]" /> Change a life—directly and transparently
                </li>
              </ul>
              <div className="flex flex-col md:flex-row gap-3 mt-5">
                <Button className="w-full md:w-auto bg-green-700 hover:bg-green-800" onClick={() => navigate("/sponsors/register")}>
                  Sponsor Register
                </Button>
                <Button
                  className="w-full md:w-auto bg-blue-700 hover:bg-blue-800"
                  onClick={() => navigate("/sponsors/login")}
                >
                  Sponsor Login
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-12">
          <Typography variant="h2" className="mb-3 text-center">
            Why Join the Ecosystem?
          </Typography>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
              <Typography variant="h4" className="mb-1">For Students:</Typography>
              <ul className="text-gray-700 space-y-1">
                <li>✓ Access verified sponsors committed to supporting your education</li>
                <li>✓ Transparent sponsorship and dashboard status tracking</li>
                <li>✓ Simple application, real-time updates</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
              <Typography variant="h4" className="mb-1">For Sponsors:</Typography>
              <ul className="text-gray-700 space-y-1">
                <li>✓ Empower students to pursue higher education in South Africa</li>
                <li>✓ Full control of sponsorship amount and student selection</li>
                <li>✓ Instant dashboard for viewing requests and allocations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ / Information */}
        <section className="">
          <Typography variant="h2" className="mb-3 text-center">
            Frequently Asked Questions
          </Typography>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4 text-base">
            <div>
              <strong>Who can apply for sponsorship?</strong><br />
              Any student using EduEasy who needs financial support with their application fees.
            </div>
            <div>
              <strong>Who can become a sponsor?</strong><br />
              Individuals, companies, NGOs, and government organizations can all register as sponsors.
            </div>
            <div>
              <strong>How do I track my application or sponsorship?</strong><br />
              Use the dashboard links above after applying or registering.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SponsorshipsPage;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SponsorshipCard } from '@/components/sponsorships/SponsorshipCard';
import { Sponsorship, SponsorshipLevel } from '@/types/RevenueTypes';

// Mock data for demo
const mockSponsorships: Sponsorship[] = [
  {
    id: '1',
    organization_name: 'TechCorp Foundation',
    contact_name: 'Sarah Johnson',
    contact_email: 'sarah@techcorp.com',
    sponsorship_level: SponsorshipLevel.PLATINUM,
    amount: 50000,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    description: 'Supporting technology education for South African students',
    website_url: 'https://techcorp.com',
    logo_url: '/images/sponsors/techcorp.png',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const SponsorshipsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-cap-teal hover:text-cap-teal/80 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Sponsors</h1>
          <p className="text-xl text-gray-600">
            Meet the organizations supporting South African students' educational journeys
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSponsorships.map((sponsorship) => (
            <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipsPage;


import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UserProfileCard } from '@/components/profile/UserProfileCard';

const ProfileDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-cap-teal hover:text-cap-teal/80 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8">User Profile Demo</h1>
        <UserProfileCard />
      </div>
    </div>
  );
};

export default ProfileDemo;

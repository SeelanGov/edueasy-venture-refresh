
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ApplicationHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">
        My Applications
      </h2>
      <Link to="/apply">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-full">
          <PlusIcon className="h-4 w-4 mr-1" />
          New Application
        </Button>
      </Link>
    </div>
  );
};

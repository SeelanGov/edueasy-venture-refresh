import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

/**
 * ApplicationHeader
 * @description Function
 */
export const ApplicationHeader = (): JSX.Element => {
  return (
    <div className="flex justify-between items-center mb-8 animate-fade-in">
      <Typography variant="h2" className="text-gray-800">
        My Applications
      </Typography>
      <Link to="/apply">
        <Button
          className="bg-cap-teal hover:bg-cap-teal/90 text-white shadow-sm hover:shadow transition-all"
          rounded="full"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          New Application
        </Button>
      </Link>
    </div>
  );
};

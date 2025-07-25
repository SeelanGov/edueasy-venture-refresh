import { Typography } from '@/components/ui/typography';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}


/**
 * FeatureCard
 * @description Function
 */
export const FeatureCard = ({ icon, title, description }: FeatureCardProps): void => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-600 flex items-center justify-center">
        {icon}
      </div>
      <Typography variant="h4" className="mb-4 text-center">
        {title}
      </Typography>
      <Typography variant="body" className="text-gray-600 text-center">
        {description}
      </Typography>
    </div>
  );
};

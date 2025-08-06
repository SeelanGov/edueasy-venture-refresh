import { OptimizedImage } from '@/components/ui/OptimizedImage';

/**
 * AboutImage
 * @description Function
 */
export const AboutImage = (): void => {
  // Use the new uploaded image for the About EduEasy section
  const imagePath = '/lovable-uploads/406bcd90-d00d-49f6-b0f2-0af152cc1707.png';

  return (
    <div className="md:w-1/2">
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500 opacity-20 rounded-full"></div>
        <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
          <OptimizedImage
            src={imagePath}
            alt="Students studying and using EduEasy platform with branding"
            className="w-full h-auto"
            skeletonClassName="w-full h-64"
            fallbackSrc="/images/journey-bg.png"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-600 opacity-20 rounded-full"></div>
      </div>
    </div>
  );
};

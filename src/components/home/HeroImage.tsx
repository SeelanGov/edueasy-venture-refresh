import { OptimizedImage } from '@/components/ui/OptimizedImage';

export const HeroImage = () => {
  // Using the user's uploaded hero image
  const heroImagePath = '/lovable-uploads/de7fc15f-45f8-4076-b06b-9f70babb5c8e.png';

  return (
    <div className="hidden md:block relative h-full">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/30 rounded-full"></div>

      <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
        <OptimizedImage
          src={heroImagePath}
          alt="Empowering SA Youth, Online and Offline - Student studying with technology"
          priority={true} // Hero image loads immediately
          className="w-full h-auto rounded-xl object-cover"
          skeletonClassName="w-full h-64 rounded-xl"
          fallbackSrc="/images/journey-bg.png" // Fallback to existing image
        />

        <div className="absolute -right-6 bottom-12 bg-white p-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 text-primary">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="font-medium">AI-Powered Success</span>
          </div>
        </div>
      </div>
    </div>
  );
};

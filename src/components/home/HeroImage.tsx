
import { useState } from 'react';

export const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Using the user's uploaded hero image
  const heroImagePath = '/lovable-uploads/de7fc15f-45f8-4076-b06b-9f70babb5c8e.png';

  const handleImageError = () => {
    console.log('Hero image failed to load:', heroImagePath);
    setImageError(true);
    setImageLoaded(true); // Stop loading state
  };

  return (
    <div className="hidden md:block relative h-full">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/30 rounded-full"></div>
      
      <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
        {!imageLoaded && !imageError && (
          <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}

        {imageError && (
          <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎓</div>
              <div className="text-gray-700 font-medium">EduEasy Platform</div>
              <div className="text-sm text-gray-500">Empowering SA Youth, Online and Offline</div>
            </div>
          </div>
        )}
        
        <img
          src={heroImagePath}
          alt="Empowering SA Youth, Online and Offline - Student studying with technology"
          className={`w-full h-auto rounded-xl object-cover ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
          onLoad={() => {
            console.log('Hero image loaded successfully');
            setImageLoaded(true);
          }}
          onError={handleImageError}
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

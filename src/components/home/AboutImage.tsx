
import { useState } from 'react';

export const AboutImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Use the new uploaded image for the About EduEasy section
  const imagePath = '/lovable-uploads/406bcd90-d00d-49f6-b0f2-0af152cc1707.png';

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="md:w-1/2">
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500 opacity-20 rounded-full"></div>
        <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
          {!imageLoaded && !imageError && (
            <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-500">Loading...</div>
            </div>
          )}

          {imageError && (
            <div className="w-full h-64 bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-gray-700 font-medium">Empowering Education</div>
                <div className="text-sm text-gray-500">Transforming Lives Through Learning</div>
              </div>
            </div>
          )}
          
          <img
            src={imagePath}
            alt="Students studying and using EduEasy platform with branding"
            className={`w-full h-auto ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-600 opacity-20 rounded-full"></div>
      </div>
    </div>
  );
};

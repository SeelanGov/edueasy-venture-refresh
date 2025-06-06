
import { useState } from 'react';

export const AboutImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imagePath = '/lovable-uploads/5bd44e59-3046-4b66-8ba8-3439553962e0.png';

  return (
    <div className="md:w-1/2">
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500 opacity-20 rounded-full"></div>
        <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
          {!imageLoaded && (
            <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-500">Loading...</div>
            </div>
          )}
          
          <img
            src={imagePath}
            alt="Students studying and using EduEasy platform with branding"
            className={`w-full h-auto ${imageLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => console.error('About image failed to load:', imagePath)}
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-600 opacity-20 rounded-full"></div>
      </div>
    </div>
  );
};

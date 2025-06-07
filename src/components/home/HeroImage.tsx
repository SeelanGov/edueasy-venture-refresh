
import { useState } from 'react';

export const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const heroImagePath = 'lovable-uploads/04f40fae-9965-4e84-aec0-11be9d7789a1.png';

  return (
    <div className="hidden md:block relative h-full">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/30 rounded-full"></div>
      
      <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
        {!imageLoaded && (
          <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
        
        <img
          src={heroImagePath}
          alt="EduEasy platform for South African students"
          className={`w-full h-auto rounded-xl object-cover ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.warn('Hero image failed to load, using fallback');
            setImageLoaded(true);
          }}
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

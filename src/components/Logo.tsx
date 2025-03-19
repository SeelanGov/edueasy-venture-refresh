
import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8 md:w-10 md:h-10">
        {/* Circle background */}
        <div className="absolute inset-0 rounded-full bg-cap-teal border-2 border-cap-coral"></div>
        
        {/* Sun/flower symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4" fill="white" />
            <path d="M12 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 18V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M4.93 4.93L7.76 7.76" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M16.24 16.24L19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12H6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M4.93 19.07L7.76 16.24" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M16.24 7.76L19.07 4.93" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="font-heading font-bold text-2xl text-white">EduEasy</div>
    </div>
  );
};

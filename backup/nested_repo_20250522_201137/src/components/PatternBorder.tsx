
import React from 'react';

type PatternBorderProps = {
  position: 'top' | 'bottom';
  className?: string;
};

export const PatternBorder = ({ position, className = '' }: PatternBorderProps) => {
  return (
    <div className={`w-full overflow-hidden ${position === 'top' ? 'mb-4' : 'mt-4'} ${className}`}>
      <div className="flex justify-center">
        <div className="w-full max-w-6xl px-4">
          <div className="h-8 flex items-center justify-center">
            <div className="flex-1 h-3 bg-gradient-to-r from-cap-dark via-cap-teal to-cap-dark"></div>
            <div className="w-3 h-3 mx-1 rounded-full bg-cap-coral"></div>
            <div className="w-3 h-3 mx-1 rounded-full bg-white"></div>
            <div className="w-3 h-3 mx-1 rounded-full bg-cap-coral"></div>
            <div className="w-3 h-3 mx-1 rounded-full bg-white"></div>
            <div className="w-3 h-3 mx-1 rounded-full bg-cap-coral"></div>
            <div className="flex-1 h-3 bg-gradient-to-r from-cap-dark via-cap-teal to-cap-dark"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Typography } from '@/components/ui/typography';

interface Testimonial {
  id: number;
  name: string;
  university: string;
  program: string;
  image: string;
  quote: string;
  achievement?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * TestimonialCard
 * @description Function
 */
export const TestimonialCard = ({ testimonial }: TestimonialCardProps): void => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = (): void => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
      {/* Decorative quote mark */}
      <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-0">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl md:text-3xl font-bold">"</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 pt-8">
        {/* Enhanced image */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gradient-to-br from-teal-600 to-orange-500 shadow-lg">
            {!imageLoaded && !imageError && (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-xs text-gray-500">Loading...</div>
              </div>
            )}

            {imageError && (
              <div className="w-full h-full bg-gradient-to-br from-teal-100 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-xs text-gray-600">Student</div>
                </div>
              </div>
            )}

            <img
              src={testimonial.image}
              alt={testimonial.name}
              className={`w-full h-full object-cover ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          </div>
          {/* Achievement badge */}
          {testimonial.achievement && (
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium shadow-md">
              🏆 {testimonial.achievement}
            </div>
          )}
        </div>

        <div className="flex-grow text-center lg:text-left">
          <Typography
            variant="body-lg"
            className="italic mb-6 md:text-xl md:leading-relaxed text-gray-700"
          >
            "{testimonial.quote}"
          </Typography>

          <div className="space-y-2">
            <Typography variant="h4" className="font-semibold md:text-xl text-gray-900">
              {testimonial.name}
            </Typography>
            <Typography variant="body" className="md:text-lg font-medium text-teal-600">
              {testimonial.program}
            </Typography>
            <Typography variant="body-sm" className="text-gray-600 md:text-base">
              {testimonial.university}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

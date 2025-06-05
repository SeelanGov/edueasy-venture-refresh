
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Lerato Mthembu',
    university: 'University of Cape Town',
    program: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
    quote:
      'EduEasy and Thandi helped me navigate the complex application process with confidence. The AI guidance was like having a personal mentor available 24/7.',
    achievement: 'Academic Excellence Award'
  },
  {
    id: 2,
    name: 'Sipho Ndlovu',
    university: 'University of Pretoria',
    program: 'Medicine',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format',
    quote:
      'From document verification to interview preparation, EduEasy supported me every step of the way. I felt prepared and confident throughout my journey.',
    achievement: 'Medical School Scholarship Recipient'
  },
  {
    id: 3,
    name: 'Thandiwe Cele',
    university: 'Stellenbosch University',
    program: 'Business Administration',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b330?w=150&h=150&fit=crop&auto=format',
    quote:
      'The cultural sensitivity and understanding that Thandi showed made all the difference. Finally, an AI that understands the South African student experience.',
    achievement: 'Dean\'s List Honor Student'
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonialImageErrors, setTestimonialImageErrors] = useState<{[key: number]: boolean}>({});
  const [testimonialImageLoaded, setTestimonialImageLoaded] = useState<{[key: number]: boolean}>({});
  const [graduationImageError, setGraduationImageError] = useState(false);
  const [graduationImageLoaded, setGraduationImageLoaded] = useState(false);

  const graduationImagePath = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop&auto=format';

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];

  const handleTestimonialImageLoad = (testimonialId: number, imagePath: string) => {
    console.log(`Testimonial image loaded for ${testimonialId}:`, imagePath);
    setTestimonialImageLoaded(prev => ({ ...prev, [testimonialId]: true }));
  };

  const handleTestimonialImageError = (testimonialId: number, imagePath: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Testimonial image failed to load for ${testimonialId}:`, imagePath, e);
    setTestimonialImageErrors(prev => ({ ...prev, [testimonialId]: true }));
  };

  const handleGraduationImageLoad = () => {
    console.log('Graduation image loaded successfully:', graduationImagePath);
    setGraduationImageLoaded(true);
  };

  const handleGraduationImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Graduation image failed to load:', graduationImagePath, e);
    setGraduationImageError(true);
  };

  if (!currentTestimonial) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 px-4 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 md:w-20 md:h-1.5 bg-orange-500 rounded"></div>
          </div>
          <Typography variant="h2" className="mb-4 md:text-4xl">
            Success Stories from Real Students
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            Hear from South African students who achieved their dreams with EduEasy and Thandi
          </Typography>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            {/* Decorative quote mark */}
            <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl md:text-3xl font-bold">"</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8 pt-8">
              {/* Enhanced image with cultural frame */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gradient-to-br from-teal-600 to-orange-500 shadow-lg">
                  {/* Loading indicator */}
                  {!testimonialImageLoaded[currentTestimonial.id] && !testimonialImageErrors[currentTestimonial.id] && (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-xs text-gray-500">Loading...</div>
                    </div>
                  )}
                  
                  {/* Error state */}
                  {testimonialImageErrors[currentTestimonial.id] && (
                    <div className="w-full h-full bg-red-100 flex items-center justify-center">
                      <div className="text-red-600 text-xs text-center">
                        <div>Failed</div>
                        <div className="text-[10px]">{currentTestimonial.image}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Main image */}
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className={`w-full h-full object-cover ${testimonialImageLoaded[currentTestimonial.id] ? 'block' : 'hidden'}`}
                    onLoad={() => handleTestimonialImageLoad(currentTestimonial.id, currentTestimonial.image)}
                    onError={(e) => handleTestimonialImageError(currentTestimonial.id, currentTestimonial.image, e)}
                  />
                </div>
                {/* Achievement badge */}
                {currentTestimonial.achievement && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium shadow-md">
                    🏆 {currentTestimonial.achievement}
                  </div>
                )}
              </div>

              <div className="flex-grow text-center lg:text-left">
                <Typography variant="body-lg" className="italic mb-6 md:text-xl md:leading-relaxed text-gray-700">
                  "{currentTestimonial.quote}"
                </Typography>
                
                <div className="space-y-2">
                  <Typography variant="h4" className="font-semibold md:text-xl text-gray-900">
                    {currentTestimonial.name}
                  </Typography>
                  <Typography variant="body" className="md:text-lg font-medium text-teal-600">
                    {currentTestimonial.program}
                  </Typography>
                  <Typography variant="body-sm" className="text-gray-600 md:text-base">
                    {currentTestimonial.university}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Enhanced navigation dots */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-gradient-to-r from-teal-600 to-orange-500 shadow-md scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced navigation buttons */}
          <div className="flex justify-center mt-6 md:mt-8 gap-4">
            <Button
              variant="outline"
              onClick={prevTestimonial}
              className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white md:py-6 md:px-8 transition-all duration-300"
            >
              Previous Story
            </Button>
            <Button
              variant="outline"
              onClick={nextTestimonial}
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white md:py-6 md:px-8 transition-all duration-300"
            >
              Next Story
            </Button>
          </div>
        </div>

        {/* Featured Success Story Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-orange-500 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Typography variant="h3" className="mb-4 text-white">
                Celebrating Graduate Success
              </Typography>
              <Typography variant="body-lg" className="mb-6 text-white/90">
                Every graduation is a celebration of determination, hard work, and the support 
                that made dreams possible. Join thousands of successful South African graduates.
              </Typography>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600"
              >
                Start Your Success Story
              </Button>
            </div>
            <div className="relative">
              {/* Loading indicator */}
              {!graduationImageLoaded && !graduationImageError && (
                <div className="w-full h-64 bg-white/20 animate-pulse rounded-xl flex items-center justify-center">
                  <div className="text-white">Loading image...</div>
                </div>
              )}
              
              {/* Error state */}
              {graduationImageError && (
                <div className="w-full h-64 bg-red-100 rounded-xl flex items-center justify-center">
                  <div className="text-red-600 text-center">
                    <div>Image failed to load</div>
                    <div className="text-xs mt-1">{graduationImagePath}</div>
                  </div>
                </div>
              )}
              
              {/* Main image */}
              <img
                src={graduationImagePath}
                alt="South African graduate celebrating success"
                className={`w-full h-auto rounded-xl shadow-lg ${graduationImageLoaded ? 'block' : 'hidden'}`}
                onLoad={handleGraduationImageLoad}
                onError={handleGraduationImageError}
              />
            </div>
          </div>
        </div>

        {/* Success metrics section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
            <div className="text-gray-600">Application Success Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-orange-500 mb-2">2,500+</div>
            <div className="text-gray-600">Students Supported</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">R75M+</div>
            <div className="text-gray-600">Scholarships Secured</div>
          </div>
        </div>
      </div>
    </section>
  );
};

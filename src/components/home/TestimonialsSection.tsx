
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
    name: 'Thabo Molefe',
    university: 'University of Cape Town',
    program: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=faces',
    quote:
      'EduEasy transformed my application journey. The platform made it so easy to apply to multiple universities while celebrating my African heritage. I felt supported every step of the way.',
    achievement: 'Dean\'s List Scholar'
  },
  {
    id: 2,
    name: 'Lerato Ndlovu',
    university: 'University of Pretoria',
    program: 'Medicine',
    image: '/lovable-uploads/11b0063a-10e7-40d8-b0eb-7fbdcd155a27.png',
    quote:
      'The support and guidance I received from EduEasy was invaluable. From document verification to application tracking, everything was seamless. I felt confident every step of the way.',
    achievement: 'Medical School Scholarship Recipient'
  },
  {
    id: 3,
    name: 'Sipho Khumalo',
    university: 'Stellenbosch University',
    program: 'Business Administration',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop&crop=faces',
    quote:
      'The document verification feature saved me so much stress. Knowing my application was complete before submission gave me the confidence to pursue my dreams at top universities.',
    achievement: 'Business Leadership Award'
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];

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
            Student Success Stories
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            Real stories from South African students who found their path with EduEasy
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
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
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

        {/* Success metrics section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
            <div className="text-gray-600">Application Success Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-orange-500 mb-2">1,200+</div>
            <div className="text-gray-600">Students Placed</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">R50M+</div>
            <div className="text-gray-600">Scholarships Secured</div>
          </div>
        </div>
      </div>
    </section>
  );
};

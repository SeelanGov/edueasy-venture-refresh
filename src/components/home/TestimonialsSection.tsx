import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { TestimonialCard } from './TestimonialCard';

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
    image: 'lovable-uploads/49463fc8-3383-4542-9984-4749a5631579.png',
    quote:
      'EduEasy and Thandi helped me navigate the complex application process with confidence. The AI guidance was like having a personal mentor available 24/7.',
    achievement: 'Academic Excellence Award'
  },
  {
    id: 2,
    name: 'Sipho Ndlovu',
    university: 'University of Pretoria',
    program: 'Medicine',
    image: 'lovable-uploads/c4b1dd67-036e-4e3f-ae13-21cd7edba772.png',
    quote:
      'From document verification to interview preparation, EduEasy supported me every step of the way. I felt prepared and confident throughout my journey.',
    achievement: 'Medical School Scholarship Recipient'
  },
  {
    id: 3,
    name: 'Thandiwe Cele',
    university: 'Stellenbosch University',
    program: 'Business Administration',
    image: 'lovable-uploads/5bd44e59-3046-4b66-8ba8-3439553962e0.png',
    quote:
      'The cultural sensitivity and understanding that Thandi showed made all the difference. Finally, an AI that understands the South African student experience.',
    achievement: 'Dean\'s List Honor Student'
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [graduationImageLoaded, setGraduationImageLoaded] = useState(false);

  const graduationImagePath = 'lovable-uploads/57daccfa-072c-4923-9c2c-938786e6a3be.png';

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
            Success Stories from Real Students
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            Hear from South African students who achieved their dreams with EduEasy and Thandi
          </Typography>
        </div>

        <div className="max-w-5xl mx-auto">
          <TestimonialCard testimonial={currentTestimonial} />

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
              {!graduationImageLoaded && (
                <div className="w-full h-64 bg-white/20 animate-pulse rounded-xl flex items-center justify-center">
                  <div className="text-white">Loading...</div>
                </div>
              )}
              
              <img
                src={graduationImagePath}
                alt="South African graduates celebrating success with EduEasy"
                className={`w-full h-auto rounded-xl shadow-lg ${graduationImageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setGraduationImageLoaded(true)}
                onError={() => setGraduationImageLoaded(true)}
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

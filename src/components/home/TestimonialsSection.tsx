
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  university: string;
  program: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Thabo Molefe",
    university: "University of Cape Town",
    program: "Computer Science",
    image: "/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png",
    quote: "EduEasy simplified my application process, allowing me to apply to multiple universities with ease. The dashboard made tracking my applications straightforward."
  },
  {
    id: 2,
    name: "Lerato Ndlovu",
    university: "University of Pretoria",
    program: "Medicine",
    image: "/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png",
    quote: "I was worried about meeting all application requirements, but EduEasy guided me through each step. I'm now enrolled in my dream program!"
  },
  {
    id: 3,
    name: "Sipho Khumalo",
    university: "Stellenbosch University",
    program: "Business Administration",
    image: "/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png",
    quote: "The document verification feature saved me so much stress. Knowing my application was complete before submission gave me confidence."
  }
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section id="testimonials" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 bg-cap-coral rounded"></div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Student Success Stories
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            Hear from students who found their path with EduEasy
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-50 rounded-lg p-6 shadow-lg">
            <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-0">
              <div className="w-16 h-16 rounded-full bg-cap-coral flex items-center justify-center">
                <span className="text-white text-2xl">"</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 pt-8">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-cap-teal">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <p className="text-lg italic mb-4">"{testimonials[activeIndex].quote}"</p>
                <div>
                  <h3 className="font-semibold text-xl">{testimonials[activeIndex].name}</h3>
                  <p className="text-cap-teal">{testimonials[activeIndex].program}</p>
                  <p className="text-gray-600 text-sm">{testimonials[activeIndex].university}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-cap-teal' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6 gap-4">
            <Button 
              variant="outline" 
              onClick={prevTestimonial}
              className="border-cap-teal text-cap-teal"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={nextTestimonial}
              className="border-cap-teal text-cap-teal"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

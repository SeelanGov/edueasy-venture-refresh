import { Typography } from '@/components/ui/typography';
import { StudentSuccessCard } from './StudentSuccessCard';

interface Student {
  id: number;
  name: string;
  university: string;
  program: string;
  image: string;
  quote: string;
  achievement: string;
}

const students: Student[] = [
  {
    id: 1,
    name: 'Lerato Mthembu',
    university: 'University of Cape Town',
    program: 'Computer Science',
    // Image: Smiling girl in South African attire – fits "Lerato" (girl's name)
    image: '/lovable-uploads/03a7ff84-fd7b-4d09-ba1e-4bd6c64a7f38.png',
    quote: 'EduEasy and Thandi helped me navigate the complex application process with confidence. The AI guidance was like having a personal mentor available 24/7.',
    achievement: 'Academic Excellence Award'
  },
  {
    id: 2,
    name: 'Thandiwe Cele',
    university: 'Stellenbosch University',
    program: 'Business Administration',
    // Image: Group scene, use if Thandiwe (girl/woman) is in visible focus
    image: '/lovable-uploads/d1178300-e92d-4476-8e5e-e4854c975f7c.png',
    quote: 'The cultural sensitivity and understanding that Thandi showed made all the difference. Finally, an AI that understands the South African student experience.',
    achievement: "Dean's List Honor Student"
  },
  {
    id: 3,
    name: 'Sipho Ndlovu',
    university: 'University of Pretoria',
    program: 'Medicine',
    // Image: Graduate blowing confetti (assign if it's a boy/man; fits "Sipho")
    image: '/lovable-uploads/9bcfb947-1a2e-46e9-8991-96d07dfdebf1.png',
    quote: 'From document verification to interview preparation, EduEasy supported me every step of the way. I felt prepared and confident throughout my journey.',
    achievement: 'Medical School Scholarship'
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 md:w-20 md:h-1.5 bg-orange-500 rounded"></div>
          </div>
          <Typography variant="h2" className="mb-4 md:text-4xl">
            Student Success Showcase
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            Celebrating the achievements of South African students who reached their goals with EduEasy
          </Typography>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {students.map((student) => (
            <StudentSuccessCard key={student.id} student={student} />
          ))}
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

import { Typography } from '@/components/ui/typography';
import { StudentSuccessCard } from './StudentSuccessCard';
import { StatisticsGrid } from './StatisticsGrid';

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
    quote:
      'EduEasy and Thandi helped me navigate the complex application process with confidence. The AI guidance was like having a personal mentor available 24/7.',
    achievement: 'Academic Excellence Award',
  },
  {
    id: 2,
    name: 'Thandiwe Cele',
    university: 'Stellenbosch University',
    program: 'Business Administration',
    // Image: Group scene, use if Thandiwe (girl/woman) is in visible focus
    image: '/lovable-uploads/d1178300-e92d-4476-8e5e-e4854c975f7c.png',
    quote:
      'The cultural sensitivity and understanding that Thandi showed made all the difference. Finally, an AI that understands the South African student experience.',
    achievement: "Dean's List Honor Student",
  },
  {
    id: 3,
    name: 'Sipho Ndlovu',
    university: 'University of Pretoria',
    program: 'Medicine',
    // Image: Graduate blowing confetti (assign if it's a boy/man; fits "Sipho")
    image: '/lovable-uploads/9bcfb947-1a2e-46e9-8991-96d07dfdebf1.png',
    quote:
      'From document verification to interview preparation, EduEasy supported me every step of the way. I felt prepared and confident throughout my journey.',
    achievement: 'Medical School Scholarship',
  },
];

/**
 * TestimonialsSection
 * @description Function
 */
export const TestimonialsSection = (): void => {
  return (
    <section
      id="testimonials"
      className="py-20 px-4 md:py-24 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 md:w-20 md:h-1.5 bg-orange-500 rounded"></div>
          </div>
          <Typography variant="h2" className="mb-4 md:text-4xl">
            Student Success Showcase
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600 md:text-xl">
            Celebrating the achievements of South African students who reached their goals with
            EduEasy
          </Typography>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {students.map((student) => (
            <StudentSuccessCard key={student.id} student={student} />
          ))}
        </div>

        {/* Enhanced Statistics Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <Typography variant="h3" className="text-gray-800 mb-2">
              Making a Real Impact
            </Typography>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to South African students is reflected in these meaningful numbers
            </Typography>
          </div>

          <StatisticsGrid
            selectedStats={['applicationSuccessRate', 'studentsSupported', 'scholarshipsSecured']}
            variant="featured"
            columns={3}
            className="max-w-4xl mx-auto"
            animateOnScroll={true}
          />
        </div>
      </div>
    </section>
  );
};

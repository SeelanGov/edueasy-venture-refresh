import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { StatisticsGrid } from '@/components/home/StatisticsGrid';

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
    image: '/lovable-uploads/03a7ff84-fd7b-4d09-ba1e-4bd6c64a7f38.png',
    quote:
      'Thanks to my sponsor through EduEasy, I was able to focus on my studies without worrying about tuition fees. The support made my university dream come true.',
    achievement: 'Academic Excellence Award',
  },
  {
    id: 2,
    name: 'Thandiwe Cele',
    university: 'Stellenbosch University',
    program: 'Business Administration',
    image: '/lovable-uploads/d1178300-e92d-4476-8e5e-e4854c975f7c.png',
    quote:
      "The transparency and ease of the sponsorship process through EduEasy gave me confidence. My sponsor's generosity changed my life trajectory completely.",
    achievement: "Dean's List Honor Student",
  },
  {
    id: 3,
    name: 'Sipho Ndlovu',
    university: 'University of Pretoria',
    program: 'Medicine',
    image: '/lovable-uploads/9bcfb947-1a2e-46e9-8991-96d07dfdebf1.png',
    quote:
      'Being sponsored through EduEasy not only covered my medical school fees but also connected me with a mentor who guided me through my studies.',
    achievement: 'Medical School Scholarship Recipient',
  },
];

/**
 * TestimonialsSection
 * @description Function
 */
export function TestimonialsSection(): void {
  return (
    <section className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-1 md:w-20 md:h-1.5 bg-cap-coral rounded"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-cap-teal mb-4">
          Student Success Stories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Real stories from students whose lives were transformed through our sponsorship program
        </p>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
        {students.map((student) => (
          <Card
            key={student.id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <CardContent className="p-6">
              {/* Achievement Badge */}
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {student.achievement}
                </span>
              </div>

              {/* Student Photo */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-cap-teal/20">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 5-Star Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 italic text-center mb-6 leading-relaxed text-sm">
                "{student.quote}"
              </blockquote>

              {/* Student Details */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-1">{student.name}</h4>
                <p className="text-cap-teal font-medium text-sm mb-1">{student.program}</p>
                <p className="text-gray-600 text-sm">{student.university}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Replace hardcoded metrics with StatisticsGrid */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-cap-teal mb-2">Our Sponsorship Goals for 2025</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Building toward these ambitious targets to support more South African students
          </p>
        </div>

        <StatisticsGrid
          selectedStats={['studentsSupported', 'scholarshipsSecured', 'studentSatisfaction']}
          variant="default"
          columns={3}
          className="max-w-4xl mx-auto"
          animateOnScroll={true}
        />
      </div>
    </section>
  );
}

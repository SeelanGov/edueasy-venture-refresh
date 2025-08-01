import { Card, CardContent } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Star } from 'lucide-react';

interface StudentSuccessCardProps {
  student: {
    id: number;
    name: string;
    university: string;
    program: string;
    image: string;
    quote: string;
    achievement: string;
  };
}

/**
 * StudentSuccessCard
 * @description Function
 */
export const StudentSuccessCard = ({ student }: StudentSuccessCardProps): JSX.Element => {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <CardContent className="p-6">
        {/* Achievement Badge */}
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            {student.achievement}
          </span>
        </div>

        {/* Student Photo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-100">
            <OptimizedImage
              src={student.image}
              alt={student.name}
              className="w-full h-full object-cover"
              skeletonClassName="w-full h-full rounded-full"
              fallbackSrc="/images/journey-bg.png"
              priority={false}
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
        <blockquote className="text-gray-700 italic text-center mb-6 leading-relaxed">
          "{student.quote}"
        </blockquote>

        {/* Student Details */}
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-1">{student.name}</h4>
          <p className="text-teal-600 font-medium text-sm mb-1">{student.program}</p>
          <p className="text-gray-600 text-sm">{student.university}</p>
        </div>
      </CardContent>
    </Card>
  );
};

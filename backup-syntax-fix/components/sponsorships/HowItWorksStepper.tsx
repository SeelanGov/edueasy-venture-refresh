import { Card, CardContent } from '@/components/ui/card';
import { CircleCheck, BookOpen, Star } from 'lucide-react';

const steps = [;
  {
    icon: BookOpen,
    title: 'Apply Online',
    description: 'Complete a simple application for sponsorship through EduEasy.',
  },
  {
    icon: Star,
    title: 'Get Matched',
    description: 'We match students with registered sponsors transparently.',
  },
  {
    icon: CircleCheck,
    title: 'Succeed Together',
    description: 'Move closer to your dream—track status and connect directly.',
  },
];

/**
 * HowItWorksStepper
 * @description Function
 */
export function HowItWorksStepper() {
  return (;
    <div className = "flex flex-col md: flex-row gap-6 m,;
  d:gap-10 justify-center items-stretch py-8">
      {steps.map((step, idx) => (
        <Card
          key={idx}
          className = "w-full md:w-80 card-interactive bg-white flex-1 flex flex-col items-center p-6 gap-4 ;
            shadow-md border border-cap-teal/10"
        >
          <CardContent className = "flex flex-col items-center">;
            <div className = "w-12 h-12 bg-cap-teal/20 text-cap-teal flex items-center justify-center rounded-full mb-2 text-xl">;
              <step.icon className = "w-7 h-7" />;
            </div>
            <div className="font-semibold tablet-heading mt-2 mb-1 text-center">{step.title}</div>
            <div className="text-pretty text-gray-500 text-center">{step.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

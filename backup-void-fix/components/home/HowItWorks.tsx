import { Typography } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { StatisticsGrid } from './StatisticsGrid';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: JSX.Element;
  isActive?: boolean;
}

const Step = ({ number, title, description, icon, isActive = false }: StepProps): void => {
  return (
    <Card
      className={`border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${isActive ? 'border-l-4 border-l-primary' : ''}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4
            ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
          >
            {number}
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-primary">{icon}</span>
              <Typography variant="h4" className="text-gray-800">
                {title}
              </Typography>
            </div>
            <Typography variant="body" className="text-gray-600">
              {description}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * HowItWorks
 * @description Function
 */
export const HowItWorks = (): void => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Simple Process
          </div>
          <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How EduEasy Works
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600">
            Your simplified journey to higher education in South Africa
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Step
            number={1}
            title="Create Account"
            description="Sign up and complete your student profile with personal details and academic records"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            }
          />

          <Step
            number={2}
            title="Upload Documents"
            description="Submit your ID, academic results, and supporting documents securely"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
            isActive={true}
          />

          <Step
            number={3}
            title="Apply to Programs"
            description="Select your desired institutions and programs with a single application"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
          />

          <Step
            number={4}
            title="Track Progress"
            description="Monitor application status and receive updates in real-time"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
          />
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <Typography variant="h4" className="text-gray-800 mb-3">
                    Building the Future of Student Applications in South Africa
                  </Typography>
                  <Typography variant="body" className="text-gray-600 mb-6">
                    Our streamlined platform is designed to help students apply to multiple
                    institutions efficiently. We're building toward these ambitious goals to better
                    serve South African students.
                  </Typography>

                  <div className="mb-4">
                    <Typography variant="h4" className="text-cap-coral mb-3">
                      Our 2025 Targets
                    </Typography>
                  </div>

                  <StatisticsGrid
                    selectedStats={[
                      'successfulApplications',
                      'documentApproval',
                      'studentSatisfaction',
                    ]}
                    variant="compact"
                    columns={3}
                    animateOnScroll={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

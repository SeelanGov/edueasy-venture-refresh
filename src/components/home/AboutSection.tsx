
import React from 'react';
import { Typography } from '@/components/ui/typography';

export const AboutSection = () => {
  return (
    <section id="learn-more" className="py-20 px-4 bg-white text-gray-900">
      <div className="container mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-1 bg-teal-600 rounded"></div>
        </div>

        <Typography variant="h2" className="text-center font-heading mb-8">
          About EduEasy
        </Typography>

        <div className="flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500 opacity-20 rounded-full"></div>
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=faces"
                  alt="Students using EduEasy"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-600 opacity-20 rounded-full"></div>
            </div>
          </div>

          <div className="md:w-1/2">
            <Typography variant="h3" className="mb-4 text-primary">
              Simplifying Higher Education Access
            </Typography>

            <Typography variant="body-lg" className="mb-6">
              EduEasy is your gateway to higher education in South Africa. We streamline the
              application process, making it easier for students to apply to multiple institutions
              with a single application form.
            </Typography>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5">Simplified Applications</Typography>
                  <Typography variant="body" className="text-gray-700">
                    Apply to multiple institutions with one application, saving time and reducing
                    stress.
                  </Typography>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5">Document Verification</Typography>
                  <Typography variant="body" className="text-gray-700">
                    Our system ensures your documents meet all requirements before submission.
                  </Typography>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5">Real-time Tracking</Typography>
                  <Typography variant="body" className="text-gray-700">
                    Monitor your application status and receive updates throughout the process.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            }
            title="One Application"
            description="Apply once for multiple institutions and programs"
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            }
            title="Track Progress"
            description="Monitor your application status in real-time"
          />
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
            }
            title="Get Support"
            description="Access guidance throughout your application journey"
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-600 flex items-center justify-center">
        {icon}
      </div>
      <Typography variant="h4" className="mb-4 text-center">
        {title}
      </Typography>
      <Typography variant="body" className="text-gray-600 text-center">
        {description}
      </Typography>
    </div>
  );
};

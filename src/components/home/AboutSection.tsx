import React, { useState } from 'react';
import { Typography } from '@/components/ui/typography';

export const AboutSection = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imagePath = '/lovable-uploads/5bd44e59-3046-4b66-8ba8-3439553962e0.png';

  const handleImageLoad = () => {
    console.log('About image loaded successfully:', imagePath);
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('About image failed to load:', imagePath, e);
    setImageError(true);
  };

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
                {/* Loading indicator */}
                {!imageLoaded && !imageError && (
                  <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">Loading image...</div>
                  </div>
                )}
                
                {/* Error state */}
                {imageError && (
                  <div className="w-full h-64 bg-red-100 flex items-center justify-center">
                    <div className="text-red-600 text-center">
                      <div>Image failed to load</div>
                      <div className="text-xs mt-1">{imagePath}</div>
                    </div>
                  </div>
                )}
                
                {/* Main image - now using your about/study image */}
                <img
                  src={imagePath}
                  alt="Students studying and using EduEasy platform with branding"
                  className={`w-full h-auto ${imageLoaded ? 'block' : 'hidden'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-600 opacity-20 rounded-full"></div>
            </div>
          </div>

          <div className="md:w-1/2">
            <Typography variant="h3" className="mb-4 text-primary">
              Empowering South African Students
            </Typography>

            <Typography variant="body-lg" className="mb-6">
              EduEasy is your comprehensive gateway to higher education in South Africa. We combine 
              cutting-edge AI technology with deep cultural understanding to support students from 
              all backgrounds in achieving their academic dreams.
            </Typography>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5">AI-Powered Guidance</Typography>
                  <Typography variant="body" className="text-gray-700">
                    Thandi, our AI assistant, provides personalized support and guidance throughout 
                    your education journey.
                  </Typography>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5">Cultural Understanding</Typography>
                  <Typography variant="body" className="text-gray-700">
                    Built specifically for South African students, understanding local context, 
                    languages, and cultural nuances.
                  </Typography>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5">Comprehensive Support</Typography>
                  <Typography variant="body" className="text-gray-700">
                    From application guidance to career counseling, we support you every step 
                    of the way to success.
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
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            }
            title="AI Assistant"
            description="24/7 support from Thandi, your personal education AI"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            }
            title="Community Support"
            description="Connect with peers and mentors across South Africa"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            }
            title="Success Tracking"
            description="Monitor your progress and celebrate achievements"
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

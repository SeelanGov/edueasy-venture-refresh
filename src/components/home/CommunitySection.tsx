
import React, { useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export const CommunitySection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imagePath = 'lovable-uploads/c4b1dd67-036e-4e3f-ae13-21cd7edba772.png';

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-teal-50 to-orange-50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-600 opacity-20 rounded-full"></div>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
              {!imageLoaded && (
                <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              )}
              
              <img
                src={imagePath}
                alt="Students collaborating and working together in community"
                className={`w-full h-auto object-cover ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => console.error('Community image failed to load:', imagePath)}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-500 opacity-20 rounded-full"></div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            <div className="mb-6">
              <div className="w-16 h-1 bg-orange-500 rounded mb-4"></div>
            </div>

            <Typography variant="h2" className="mb-4 text-gray-800">
              Join Our Community of Future Leaders
            </Typography>

            <Typography variant="body-lg" className="mb-6 text-gray-600">
              Connect with thousands of ambitious South African students who are transforming 
              their futures through education. Share experiences, get support, and celebrate 
              each other's successes.
            </Typography>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5" className="font-semibold">
                    Peer Support Network
                  </Typography>
                  <Typography variant="body" className="text-gray-700">
                    Connect with students from across South Africa and share your journey.
                  </Typography>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5" className="font-semibold">
                    Mentorship Programs
                  </Typography>
                  <Typography variant="body" className="text-gray-700">
                    Get guidance from successful graduates and industry professionals.
                  </Typography>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600"></div>
                </div>
                <div className="ml-4">
                  <Typography variant="h5" className="font-semibold">
                    Cultural Celebration
                  </Typography>
                  <Typography variant="body" className="text-gray-700">
                    Embrace and celebrate the rich diversity of South African culture.
                  </Typography>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8"
              >
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

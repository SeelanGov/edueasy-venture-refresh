
import React, { useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export const AISupportSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imagePath = 'lovable-uploads/49463fc8-3383-4542-9984-4749a5631579.png';

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <div className="mb-6">
              <div className="w-16 h-1 bg-blue-600 rounded mb-4"></div>
            </div>

            <Typography variant="h2" className="mb-4 text-gray-800">
              Meet Thandi, Your AI Education Assistant
            </Typography>

            <Typography variant="body-lg" className="mb-6 text-gray-600">
              Get 24/7 personalized support from Thandi, our AI assistant designed specifically 
              for South African students. From application guidance to career advice, Thandi is 
              here to help you succeed.
            </Typography>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <Typography variant="h5" className="font-semibold">
                    Smart Application Help
                  </Typography>
                </div>
                <Typography variant="body-sm" className="text-gray-600">
                  Get instant help with forms, documents, and deadlines
                </Typography>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <Typography variant="h5" className="font-semibold">
                    Career Guidance
                  </Typography>
                </div>
                <Typography variant="body-sm" className="text-gray-600">
                  Discover courses and careers that match your interests and goals
                </Typography>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <Typography variant="h5" className="font-semibold">
                    Cultural Understanding
                  </Typography>
                </div>
                <Typography variant="body-sm" className="text-gray-600">
                  Built with South African context and cultural awareness
                </Typography>
              </div>
            </div>

            <div className="pt-6">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
              >
                Chat with Thandi
              </Button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-200 rounded-full opacity-50"></div>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
              {!imageLoaded && (
                <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              )}
              
              <img
                src={imagePath}
                alt="South African cultural heritage with traditional beadwork representing AI technology and tradition"
                className={`w-full h-auto object-cover ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.warn('AI Support image failed to load, using fallback');
                  setImageLoaded(true);
                }}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

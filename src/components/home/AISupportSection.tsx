import React, { useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export const AISupportSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imagePath = '/lovable-uploads/ea352049-18bb-49a0-b8e3-d00ae059e1f1.png';

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

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
              Get 24/7 personalized support from Thandi, our AI assistant designed specifically for
              South African students. From application guidance to career advice, Thandi is here to
              help you succeed.
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
          {/* Right Column - Image/Card */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-200 rounded-full opacity-50"></div>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
              {/* Show loading skeleton while image loads */}
              {!imageLoaded && !imageError && (
                <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              )}
              {/* If image fails, show AI Thandi's real image in the card for consistent branding */}
              {imageError && (
                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                  <div className="flex flex-col items-center p-4">
                    <img
                      src={imagePath}
                      alt="Thandi - AI Education Assistant"
                      className="w-24 h-24 object-cover rounded-full shadow-lg mb-3 border-4 border-white"
                      style={{ background: '#f3f3f3' }}
                    />
                    <div className="text-gray-700 font-medium text-lg">AI Assistant Thandi</div>
                    <div className="text-sm text-gray-500">Your Personal Education Guide</div>
                  </div>
                </div>
              )}
              {/* Main image */}
              <img
                src={imagePath}
                alt="Thandi - AI Education Assistant"
                className={`w-full h-64 object-cover rounded-xl ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
              {/* Overlay Thandi's branded card always (visible when loaded), as in your screenshot */}
              {imageLoaded && !imageError && (
                <div
                  className="absolute bottom-6 right-6 bg-white/90 rounded-xl shadow-lg flex flex-col items-center p-4 z-20"
                  style={{ minWidth: 190, maxWidth: 230 }}
                >
                  <img
                    src={imagePath}
                    alt="Thandi - AI Avatar"
                    className="w-16 h-16 object-cover rounded-full shadow-md mb-2 border-2 border-blue-100"
                  />
                  <div className="text-gray-800 font-semibold text-base mb-1">
                    AI Assistant Thandi
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Your Personal Education Guide
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

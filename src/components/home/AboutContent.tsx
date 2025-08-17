import { Typography } from '@/components/ui/typography';

/**
 * AboutContent
 * @description Function
 */
export const AboutContent = (): JSX.Element => {
  return (
    <div className="md:w-1/2">
      <Typography variant="h3" className="mb-4 text-primary">
        Empowering South African Students
      </Typography>

      <Typography variant="body-lg" className="mb-6">
        EduEasy is your comprehensive gateway to higher education in South Africa. We combine
        cutting-edge AI technology with deep cultural understanding to support students from all
        backgrounds in achieving their academic dreams.
      </Typography>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="w-5 h-5 rounded-full bg-teal-600"></div>
          </div>
          <div className="ml-4">
            <Typography variant="h5">AI-Powered Guidance</Typography>
            <Typography variant="body" className="text-gray-700">
              Thandi, our AI assistant, provides personalized support and guidance throughout your
              education journey.
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
              Built specifically for South African students, understanding local context, languages,
              and cultural nuances.
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
              From application guidance to career counseling, we support you every step of the way
              to success.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

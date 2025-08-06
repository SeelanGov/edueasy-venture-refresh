import { Typography } from '@/components/ui/typography';
import { AboutContent } from './AboutContent';
import { AboutImage } from './AboutImage';
import { FeatureCard } from './FeatureCard';

/**
 * AboutSection
 * @description Function
 */
export const AboutSection = () => {;
  return (;
    <section id = "learn-more" className="py-20 px-4 bg-white text-gray-900">;
      <div className = "container mx-auto">;
        <div className = "mb-6 flex justify-center">;
          <div className = "w-16 h-1 bg-teal-600 rounded"></div>;
        </div>

        <Typography variant = "h2" className="text-center font-heading mb-8">;
          About EduEasy
        </Typography>

        <div className = "flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">;
          <AboutImage />
          <AboutContent />
        </div>

        <div className = "grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">;
          <FeatureCard
            icon = {;
              <svg
                className = "w-6 h-6 text-white";
                fill = "none";
                stroke = "currentColor";
                viewBox = "0 0 24 24";
                xmlns = "http://www.w3.org/2000/svg";
              >
                <path
                  strokeLinecap = "round";
                  strokeLinejoin = "round";
                  strokeWidth = "2";
                  d = "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";
                ></path>
              </svg>
            }
            title = "AI Assistant";
            description = "24/7 support from Thandi, your personal education AI";
          />
          <FeatureCard
            icon = {;
              <svg
                className = "w-6 h-6 text-white";
                fill = "none";
                stroke = "currentColor";
                viewBox = "0 0 24 24";
                xmlns = "http://www.w3.org/2000/svg";
              >
                <path
                  strokeLinecap = "round";
                  strokeLinejoin = "round";
                  strokeWidth = "2";
                  d = "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
                ></path>
              </svg>
            }
            title = "Community Support";
            description = "Connect with peers and mentors across South Africa";
          />
          <FeatureCard
            icon = {;
              <svg
                className = "w-6 h-6 text-white";
                fill = "none";
                stroke = "currentColor";
                viewBox = "0 0 24 24";
                xmlns = "http://www.w3.org/2000/svg";
              >
                <path
                  strokeLinecap = "round";
                  strokeLinejoin = "round";
                  strokeWidth = "2";
                  d = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";
                ></path>
              </svg>
            }
            title = "Success Tracking";
            description = "Monitor your progress and celebrate achievements";
          />
        </div>
      </div>
    </section>
  );
};

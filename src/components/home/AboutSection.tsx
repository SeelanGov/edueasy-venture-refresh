
import React from "react";

export const AboutSection = () => {
  return (
    <section id="learn-more" className="py-20 px-4 bg-white text-cap-dark">
      <div className="container mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-1 bg-cap-teal rounded"></div>
        </div>
        
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">
          About EduEasy
        </h2>
        <p className="text-xl mb-12 max-w-3xl mx-auto">
          EduEasy is your gateway to higher education in South Africa.
          We simplify the application process, making it easier for students to apply to multiple institutions.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2h-2a2 2 0 01-2-2z"></path>
              </svg>
            } 
            title="One Application" 
            description="Apply once for multiple institutions and programs" 
          />
          <FeatureCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            } 
            title="Track Progress" 
            description="Monitor your application status in real-time" 
          />
          <FeatureCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
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
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cap-teal flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

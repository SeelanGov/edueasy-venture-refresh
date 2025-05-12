
import { CheckCircle } from "lucide-react";
import { Typography } from "@/components/ui/typography";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isActive?: boolean;
}

const Step = ({ number, title, description, isActive = false }: StepProps) => {
  return (
    <div className={`flex flex-col items-center ${isActive ? 'scale-105' : ''}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 
        ${isActive ? 'bg-cap-teal text-white' : 'bg-gray-100 text-cap-dark'}`}>
        {number}
      </div>
      <Typography variant="h4" className="mb-2">{title}</Typography>
      <Typography variant="body" className="text-center text-gray-600">{description}</Typography>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 bg-cap-teal rounded"></div>
          </div>
          <Typography variant="h2" className="mb-4">
            How EduEasy Works
          </Typography>
          <Typography variant="body-lg" className="max-w-3xl mx-auto text-gray-600">
            Your simplified journey to higher education in South Africa
          </Typography>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto">
          <Step
            number={1}
            title="Create Account"
            description="Sign up and complete your student profile with personal details and academic records"
          />
          
          <Step
            number={2}
            title="Upload Documents"
            description="Submit your ID, academic results, and supporting documents securely"
            isActive={true}
          />
          
          <Step
            number={3}
            title="Apply to Programs"
            description="Select your desired institutions and programs with a single application"
          />
          
          <Step
            number={4}
            title="Track Progress"
            description="Monitor application status and receive updates in real-time"
          />
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="max-w-3xl bg-white rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <Typography variant="h4" className="mb-2">
                  Students who use EduEasy are 3x more likely to secure university placement
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  Our streamlined application process helps students apply to multiple institutions efficiently,
                  increasing their chances of acceptance. The verification process ensures your documents meet
                  all requirements before submission.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
